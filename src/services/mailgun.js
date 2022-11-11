const credentials = require('../credentials');
const mailgun = require('mailgun-js');
const mg = mailgun({ apiKey: credentials.mailgun.apiKey, domain: credentials.mailgun.domain });

const sendMail = async (to, subject, text) => {
  const mail = {
    from: `Advertisement Registration <personal@${credentials.mailgun.domain}>`,
    to,
    subject,
    text,
  };
  await mg.messages().send(mail, (error, body) => {
    console.log(body);
  });
}

module.exports = { sendMail };
