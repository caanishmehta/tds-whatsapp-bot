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

  const tdsData = {
  "194c": "194C: Contractor payments - 1% Individual/HUF, 2% Others.",
  "194j": "194J: Professional fees - 10% TDS.",
  "194i": "194I: Rent payment - 2% plant/machinery, 10% land/building.",
  "194h": "194H: Commission/Brokerage - 5% TDS.",
  "194q": "194Q: Purchase of goods - 0.1% above threshold.",
  "194o": "194O: E-commerce transactions - 0.1% TDS."
};

let reply = "Sorry, no matching TDS section found.";

for (const key in tdsData) {
  if (incomingMsg.includes(key)) {
    reply = tdsData[key];
    break;
  }
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
