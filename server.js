const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// Home Route
app.get("/", (req, res) => {
  res.send("TDS WhatsApp Bot Running Successfully");
});

// WhatsApp Webhook
app.post("/api/whatsapp/webhook", (req, res) => {

  const incomingMsg = (req.body.Body || "").toLowerCase();

  let reply = "Sorry, I could not identify the TDS section.";

  // Extract Amount
  const amountMatch = incomingMsg.match(/\d+/);

  const amount = amountMatch
    ? parseFloat(amountMatch[0])
    : 0;

  // Formatter Function
  function formatReply(section, rate, threshold) {

    // Threshold Check
    if (amount > 0 && amount < threshold) {

      return `
${section}

Amount: ₹${amount.toLocaleString()}

Threshold Limit: ₹${threshold.toLocaleString()}

TDS NOT Applicable
(Threshold not crossed)
`;

    }

    // If no amount entered
    if (amount === 0) {

      return `
${section}

Threshold Limit: ₹${threshold.toLocaleString()}

Applicable TDS Rate: ${rate}%
`;

    }

    // TDS Calculation
    const tds = amount * rate / 100;

    return `
${section}

Amount: ₹${amount.toLocaleString()}

Threshold Limit: ₹${threshold.toLocaleString()}

TDS Rate: ${rate}%

TDS Amount: ₹${tds.toLocaleString()}
`;

  }

  // =========================
  // 194C
  // =========================
  if (
    incomingMsg.includes("194c") ||
    incomingMsg.includes("contract") ||
    incomingMsg.includes("contractor") ||
    incomingMsg.includes("advertisement") ||
    incomingMsg.includes("transport") ||
    incomingMsg.includes("labour") ||
    incomingMsg.includes("fabrication") ||
    incomingMsg.includes("printing")
  ) {

    reply = formatReply(
      "194C - Contractor / Advertisement Payment",
      1,
      30000
    );

  }

  // =========================
  // 194J
  // =========================
  else if (
    incomingMsg.includes("194j") ||
    incomingMsg.includes("professional") ||
    incomingMsg.includes("technical") ||
    incomingMsg.includes("consultant") ||
    incomingMsg.includes("consultancy") ||
    incomingMsg.includes("architect") ||
    incomingMsg.includes("legal") ||
    incomingMsg.includes("lawyer") ||
    incomingMsg.includes("advocate") ||
    incomingMsg.includes("audit") ||
    incomingMsg.includes("ca fees") ||
    incomingMsg.includes("doctor")
  ) {

    reply = formatReply(
      "194J - Professional / Technical Fees",
      10,
      50000
    );

  }

  // =========================
  // 194I
  // =========================
  else if (
    incomingMsg.includes("194i") ||
    incomingMsg.includes("rent") ||
    incomingMsg.includes("warehouse") ||
    incomingMsg.includes("office") ||
    incomingMsg.includes("building") ||
    incomingMsg.includes("godown")
  ) {

    reply = formatReply(
      "194I - Rent Payment",
      10,
      600000
    );

  }

  // =========================
  // 194H
  // =========================
  else if (
    incomingMsg.includes("194h") ||
    incomingMsg.includes("commission") ||
    incomingMsg.includes("brokerage") ||
    incomingMsg.includes("referral")
  ) {

    reply = formatReply(
      "194H - Commission / Brokerage",
      2,
      20000
    );

  }

  // =========================
  // 194Q
  // =========================
  else if (
    incomingMsg.includes("194q") ||
    incomingMsg.includes("purchase") ||
    incomingMsg.includes("purchase of goods") ||
    incomingMsg.includes("goods purchase")
  ) {

    reply = formatReply(
      "194Q - Purchase of Goods",
      0.1,
      5000000
    );

  }

  // =========================
  // 194O
  // =========================
  else if (
    incomingMsg.includes("194o") ||
    incomingMsg.includes("ecommerce") ||
    incomingMsg.includes("amazon") ||
    incomingMsg.includes("flipkart")
  ) {

    reply = formatReply(
      "194O - E-Commerce Transactions",
      0.1,
      500000
    );

  }

  // Twilio Response
  const twiml = new twilio.twiml.MessagingResponse();

  twiml.message(reply);

  res.writeHead(200, {
    "Content-Type": "text/xml"
  });

  res.end(twiml.toString());

});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    "Server running on port " + PORT
  );

});
