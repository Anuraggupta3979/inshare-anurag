const nodemailer = require("nodemailer");
async function sendMail({ from, to, subject, text, html }) {
  let transporter = nodemailer.createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 587,
    secure: false,
    auth: {
      user: "anuraggupta3979@gmail.com",
      pass: "BM2ZCdFx3rpyRbVO",
    },
  });

  let info = await transporter.sendMail({
    from: `inShare <${from}>`,
    to,
    subject,
    text,
    html,
  });
  console.log(info);
}

module.exports = sendMail;
