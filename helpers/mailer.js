const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure:false,
    requireTLS: true,
    auth: {
        user: process.env.SMTP_MAIL, 
        pass: process.env.SMTP_PASSWORD
     }
});


const sendMail = async(email, subject, content) => {

    try {

        var mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject: subject,
            html: content
        };

        transporter.sendMail(mailOptions, (error, info) => {

            if (error) {
                console.log(error);
            }

            console.log("We've just sent an email to the address you provided with your registration details. Please check your inbox. If you don't see the email in a few minutes, don't forget to check your spam folder.", info.messageId);

        });
        
    } catch (error) {
        console.log(error.message);
    }

}

module.exports = {
    sendMail
}
