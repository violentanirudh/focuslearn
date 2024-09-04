const nodemailer = require("nodemailer");

/**
 * Sends an email using the provided parameters.
 * 
 * @param {string} purpose - The purpose of sending mail : verification | password | newsletter | support.
 * @param {string} to - The email address of the recipient.
 * @param {string} subject - The subject of the email.
 * @param {string} html - The HTML content of the email.
 * @returns {Promise<void>} - A promise that resolves when the email is sent successfully.
 */

const sendMail = async (purpose, to, subject, html) => {

    let from = null;
    let name = null;

    switch (purpose) {
        case "verification":
            from = "verification@hostingarena.co.in";
            name = "FocusLearn | Verification";
            break;
        case "password":
            from = "password@hostingarena.co.in";
            name = "FocusLearn | Password Reset";
            break;
        case "newsletter":
            from = "newsletter@hostingarena.co.in";
            name = "FocusLearn | Newsletter";
            break;
        default:
            from = "support@hostingarena.co.in";
            name = "FocusLearn | Support";
            break;
    }

    const transporter = nodemailer.createTransport({
        host: "hostingarena.co.in",
        port: 465,
        secure: true,
        auth: {
            user: from,
            pass: "k35Wc#a87",
        },
    });

    // Send email
    const info = await transporter.sendMail({ from: `"${name}" <${from}>`, to, subject, html });
    console.log("Message sent: %s", info.messageId);
};

module.exports = {
    sendMail
};
