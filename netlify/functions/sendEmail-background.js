const nodemailer = require('nodemailer');
const { GMAIL_USER, GMAIL_PASS, ADMIN } = process.env;
const { validateInput } = require('./validateInput.js');
const { formatMessage } = require('./formatMessage.js');
const { decryptData } = require('./decrypt');
const encryptedIpList = require("./ipBlacklist.js");
const encryptedEmailList = require("./emailBlacklist.js")
const ipBlacklist = decryptData(encryptedIpList);
const emailBlacklist = decryptData(encryptedEmailList);



function sanitizeForEmailHeader(input) {
  if (!input) return '';
  return input.replace(/[\r\n\t]/g, '').replace(/[<>]/g, '');
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      console.log('Non-POST request rejected');
      return;
    }

    let requestData;
    try {
      requestData = JSON.parse(event.body);
    } catch (parseError) {
      console.log('Invalid JSON received');
      return;
    }

    let { name, email, message, subject, phone, phoneArea, bot, question, answer } = requestData;

  if (!name || !email || !message || !subject) {
    return;
  }

  const ip = event.headers['x-forwarded-for'] || event.headers['X-Forwarded-For'] || 'Unknown IP';

  if (ipBlacklist.includes(ip) || emailBlacklist.includes(email)) {
    console.error(`Blocked request from blacklisted IP or email: ${ip} | ${email}`);
    return;
  }

  if (!validateInput(name, email, subject, message, phone, phoneArea, bot, question, answer)) {
    return;
  }

    const htmlMessage = formatMessage({name, email, subject, message, phone, phoneArea, ip});

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: GMAIL_USER,
          pass: GMAIL_PASS
        }
      });

      const sanitizedName = sanitizeForEmailHeader(name);
      const sanitizedSubject = sanitizeForEmailHeader(subject);
      const sanitizedEmail = sanitizeForEmailHeader(email);

      await transporter.sendMail({
        from: `"${sanitizedName}" <${GMAIL_USER}>`,
        replyTo: `"${sanitizedName}" <${sanitizedEmail}>`,
        to: `${ADMIN}`,
        subject: `${sanitizedName} - ${sanitizedSubject}`,
        html: htmlMessage
      });
      
      console.log('Email sent successfully');

    } catch (error) {
      console.error('Error sending email:', error.message);
    }

  } catch (error) {
    console.error('Unexpected error:', error.message);
  }
};