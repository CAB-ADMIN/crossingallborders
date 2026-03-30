const nodemailer = require('nodemailer');
const { GMAIL_USER, GMAIL_PASS, ADMIN, ADMIN_DEBUG } = process.env;
const { validateInput, validateInputWithCode } = require('./validateInput.js');
const { formatMessage } = require('./formatMessage.js');
const ipList = require('./ipBlacklist.js');
const emailList = require ('./emailBlacklist.js');


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  pool: true,
  maxConnections: 1,
  maxMessages: 20,
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS
  }
});
console.log("Created Transporter!")

transporter.verify().catch(() => {});
console.log("Verified Transporter!")


function sanitizeForEmailHeader (input) {
  if (!input) return '';
  return input.replace(/[\r\n\t]/g, '').replace(/[<>]/g, '');
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') return { statusCode: 403, body: JSON.stringify({ reason: "Forbidden - Incorrect httpMethod." }) };

    let requestedData = JSON.parse(event.body);
    if (!requestedData || requestedData === null || requestedData === undefined) {
      return { statusCode: 400, body: JSON.stringify({ reason: "Bad request - Payload missing or corrupted." }) };
    }
    let { name, email, message, subject, phone, phoneArea, bot, question, answer, terms } = requestedData;

    if (!name || !email || !subject || !message) {
      return { statusCode: 400, body: JSON.stringify({ reason: "Bad request - Missing parameters or content." }) };
    }

    const ip = event.headers['x-forwarded-for'] || event.headers['X-Forwarded-For'] || null;
    if (checkBlockLists(ipList, emailList, ip, email)) return { statusCode: 401, body: JSON.stringify({ reason: "Unauthorized - Blocked." }) };

    const response = validateInput(name, email, subject, message, phone, phoneArea, bot, question, answer, terms);
    if (response.ok) {
      const htmlMessage = formatMessage({ name, email, subject, message, phone, phoneArea, ip });

      try {
        const sanitizedName = sanitizeForEmailHeader(name);

        const response = await transporter.sendMail({
          from: `"${sanitizedName}" <${GMAIL_USER}>`,
          replyTo: `"${sanitizedName}" <${sanitizeForEmailHeader(email)}>`,
          to: `${ADMIN}`,
          subject: `${sanitizedName} - ${sanitizeForEmailHeader(subject)}`,
          html: htmlMessage
        })
        console.log("---------------")
        console.log(response)
        console.log("---------------")
        return { statusCode: 202, body: JSON.stringify({ 
          reason: "Accepted - Email has been sent, thank you!",
          nodemailerData: response
        }) }

      } catch (err) {
        console.log(err)
        return { statusCode: 500, body: JSON.stringify({ reason: `Internal Server Error: ${err}.` }) }
      }

    } else {
      return { statusCode: 403, body: JSON.stringify({ reason: `Forbidden - ${response.code} [${response.message}].` }) }
    }

  } catch (err) {
    console.log(err)
    return { statusCode: 500, body: JSON.stringify({ reason: `Internal Server Error: ${err}.` }) }
  }
}

function checkBlockLists(ipList, emailList, ip, email) {
  if (ipList.includes(ip) || emailList.includes(email)) return true
}