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

  let reply = "No matching TDS section found.";

  if (incomingMsg.includes("194c")) {
    reply = "Section 194C: Contractor Payment TDS rate is 1%/2%.";
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
