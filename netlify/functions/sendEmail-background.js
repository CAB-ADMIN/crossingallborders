const nodemailer = require('nodemailer');
const { GMAIL_USER, GMAIL_PASS } = process.env;
const fs = require('fs');
const path = require('path');
const blacklistFilePath = path.join(__dirname, 'data', 'blacklist.txt');
const emailBlacklistFilePath = path.join(__dirname, 'data', 'emailBlacklist.txt');
const blacklist = fs.readFileSync(blacklistFilePath, 'utf-8').split('\n').map(ip => ip.trim()).filter(ip => ip);
const emailBlacklist = fs.readFileSync(emailBlacklistFilePath, 'utf-8').split('\n').map(email => email.trim()).filter(email => email);
const { validateInput } = require('./data/validateInput.js');
const { formatMessage } = require('./data/formatMessage.js');

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

    let { name, email, message, subject, phone, phoneArea, bot } = requestData;

  if (!name || !email || !message || !subject) {
    return;
  }

  const ip = event.headers['x-forwarded-for'] || event.headers['X-Forwarded-For'] || 'Unknown IP';

  if (blacklist.includes(ip) || emailBlacklist.includes(email)) {
    console.error(`Blocked request from blacklisted IP or email: ${ip} | ${email}`);
    return;
  }
  if (!validateInput(name, email, subject, message, phone, phoneArea, bot)) {
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

      // await transporter.sendMail({
      //   from: `"${sanitizedName}" <${GMAIL_USER}>`,
      //   replyTo: `"${sanitizedName}" <${sanitizedEmail}>`,
      //   to: 'silasschlax@gmail.com',
      //   subject: `${sanitizedName} - ${sanitizedSubject}`,
      //   html: htmlMessage
      // });
      
      console.log('Email sent successfully');

    } catch (error) {
      console.error('Error sending email:', error.message);
    }

  } catch (error) {
    console.error('Unexpected error:', error.message);
  }
};