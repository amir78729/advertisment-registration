const credentials = require('../credentials');
const mailgun = require('mailgun-js');
const mg = mailgun({ apiKey: credentials.mailgunApiKey, domain: credentials.mailgunDomain });

const sendMail = (to, subject, text) => {
  const mail = {
    from: `Advertisement Registration <personal@${credentials.mailgunDomain}>`,
    to,
    subject,
    text,
  };
  mg.messages().send(mail, function (error, body) {
    console.log(body);
  });
}

module.exports = { sendMail };
