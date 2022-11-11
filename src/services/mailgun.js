const credentials = require('../credentials');
const mailgun = require('mailgun-js');
const mg = mailgun({ apiKey: credentials.mailgun.apiKey, domain: credentials.mailgun.domain });

const sendMail = (to, subject, text) => {
  const mail = {
    from: `Advertisement Registration <mailgun@${credentials.mailgun.domain}>`,
    to,
    subject,
    text,
  };
  mg.messages().send(mail, function (error, body) {
    console.log(body);
  });
}

module.exports = { sendMail };
