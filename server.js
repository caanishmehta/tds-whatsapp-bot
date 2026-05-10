const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("TDS WhatsApp Bot Running");
});

app.post("/api/whatsapp/webhook", (req, res) => {
  const incomingMsg = (req.body.Body || "").toLowerCase();

  let reply = "Sorry, I could not identify the TDS section.";

if (
  incomingMsg.includes("194c") ||
  incomingMsg.includes("contract") ||
  incomingMsg.includes("contractor")
) {
  reply =
    "194C: Contractor Payment TDS\nRate: 1% Individual/HUF, 2% Others.";
}

else if (
  incomingMsg.includes("194j") ||
  incomingMsg.includes("professional") ||
  incomingMsg.includes("consultant")
) {
  reply =
    "194J: Professional Fees TDS\nRate: 10%.";
}

else if (
  incomingMsg.includes("194i") ||
  incomingMsg.includes("rent")
) {
  reply =
    "194I: Rent TDS\n2% Plant & Machinery\n10% Land/Building.";
}

else if (
  incomingMsg.includes("194h") ||
  incomingMsg.includes("commission") ||
  incomingMsg.includes("brokerage")
) {
  reply =
    "194H: Commission/Brokerage TDS\nRate: 2%.";
}

else if (
  incomingMsg.includes("194q") ||
  incomingMsg.includes("purchase")
) {
  reply =
    "194Q: Purchase of Goods TDS\nRate: 0.1% above threshold.";
}

else if (
  incomingMsg.includes("194o") ||
  incomingMsg.includes("ecommerce")
) {
  reply =
    "194O: E-commerce TDS\nRate: 0.1%.";
}
  const twiml = new twilio.twiml.MessagingResponse();
  twiml.message(reply);

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
