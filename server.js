const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// Home Route
app.get("/", (req, res) => {
  res.send("TDS WhatsApp Bot Running");
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

  // Common Reply Formatter
  function formatReply(section, rate, threshold) {

    // Threshold Check
    if (amount < threshold) {

      return `
${section}

Amount: ₹${amount.toLocaleString()}

Threshold Limit: ₹${threshold.toLocaleString()}

TDS NOT Applicable
(Threshold not crossed)
`;

    }

    // TDS Calculation
    const tds = amount * rate / 100;

    return `
${section}

Amount: ₹${amount.toLocaleString()}

Threshold Limit: ₹${threshold.toLocaleString()}

Rate: ${rate}%

TDS Amount: ₹${tds.toLocaleString()}
`;

  }

  // 194C
  if (
    incomingMsg.includes("194c") ||
    incomingMsg.includes("contract") ||
    incomingMsg.includes("contractor") ||
    incomingMsg.includes("transport") ||
    incomingMsg.includes("labour") ||
    incomingMsg.includes("fabrication") ||
    incomingMsg.includes("printing") ||
    incomingMsg.includes("advertisement")
  ) {

    reply = formatReply(
      "194C - Contractor / Advertisement Payment",
      1,
      30000
    );

  }

  // 194J
  else if (
  incomingMsg.includes("194j") ||
  incomingMsg.includes("professional") ||
  incomingMsg.includes("consultant") ||
  incomingMsg.includes("technical") ||
  incomingMsg.includes("architect") ||
  incomingMsg.includes("ca fees") ||
  incomingMsg.includes("audit fees") ||
  incomingMsg.includes("legal fees")
)
    reply = formatReply(
      "194J - Professional / Technical Fees",
      10,
      50000
    );

  }

  // 194I
  else if (
    incomingMsg.includes("194i") ||
    incomingMsg.includes("offive rent") ||
    incomingMsg.includes("building rent") ||
    incomingMsg.includes("warehouse") ||
    incomingMsg.includes("rent")
  ) {

    reply = formatReply(
      "194I - Rent Payment",
      10,
      600000
    );

  }

  // 194H
  else if (
    incomingMsg.includes("194h") ||
    incomingMsg.includes("commission") ||
    incomingMsg.includes("referral commission") ||
    incomingMsg.includes("agent commission") ||
    incomingMsg.includes("brokerage")
  ) {

    reply = formatReply(
      "194H - Commission / Brokerage",
      2,
      20000
    );

  }

  // 194Q
  else if (
    incomingMsg.includes("194q") ||
    incomingMsg.includes("purchase")
  ) {

    reply = formatReply(
      "194Q - Purchase of Goods",
      0.1,
      5000000
    );

  }

  // 194O
  else if (
    incomingMsg.includes("194o") ||
    incomingMsg.includes("ecommerce")
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

// Server Start
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    "Server running on port " + PORT
  );

});
