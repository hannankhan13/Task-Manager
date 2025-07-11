const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "hannan.khan098@gmail.com",
    subject: "Welcome to Task Manager - Let's Get Things Done! ",
    text: `Hi ${name}, Welcome to Task Manager!  We're excited to have you on board. If you have any questions or need help, we're just an email away. Let's make productivity simple. 

    Cheers,
    The Task Manager Team`,
  });
};

const sendGoodbyeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "hannan.khan098@gmail.com",
    subject: "We’re sad to see you go!",
    text: `Hi ${name}, We’re sorry to hear that you’re leaving Task Manager. Thank you for being part of our journey and trusting us to help you stay productive.
    Wishing you all the best in your next chapter! 

    Take care,
    The Task Manager Team
    `,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendGoodbyeEmail,
};
