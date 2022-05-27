const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const twilio = require("twilio");
const morgan = require("morgan");

dotenv.config();
const { SID: accountSid, AUTH_TOKEN: TwilloAuthToken } = process.env;

twilio(accountSid, TwilloAuthToken);
const { MessagingResponse } = twilio.twiml;
const app = express();

const { PORT = 3000 } = process.env;

app.use(cors());
app.use(morgan());

app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hola");
});
app.post("/bot", (req, res, next) => {
  const twiml = new MessagingResponse();
  const q = req.body.Body;
  twiml.message(processInput(q));

  res.set("Content-Type", "text/xml");

  return res.status(200).send(twiml.toString());
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    errors: {
      message: err.message,
    },
  });
});

app.listen(PORT, () => console.log(`App Listening on port ${PORT}`));

const processInput = (input) => {
  if (input.includes("Hola")) {
    return "Probando un mensaje multilinea: \n *1. Segunda linea en Bold*\n 2. Tercera Linea \n\n\n Abajito el Emoji 😏";
  } else {
    return `Tu mensaje FUE: ${input} `;
  }
};
