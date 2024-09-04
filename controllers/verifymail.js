const nodemailer = require("nodemailer");

const verifyEmail = async (req, res) => {
  const transporter = nodemailer.createTransport({
    host: "http://hostingarena.co.in",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "verification@hostingarena.co.in",
      pass: "k35Wc#a87",
    },
  });

  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Tanmay" <tanmay@gmail.com>', // sender address
      to: "bar@example.com", // list of receivers
      subject: "Hello ", // Subject line
      text: "Testing nodemailer", // plain text body
      html: "<b>Hello world?</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }

  main().catch(console.error);
};

module.exports = verifyEmail;
