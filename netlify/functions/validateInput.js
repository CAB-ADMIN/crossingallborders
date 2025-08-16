const validator = require('email-validator');

const questions = [
  { id: 0, question: 'What is your favorite color?', answer: 'blue' },
  { id: 1, question: 'What is your favorite animal?', answer: 'dog' },
  { id: 2, question: 'What is your favorite food?', answer: 'pizza' }
];

function validateInput(name, email, subject, message, phone, phoneArea, bot, question, answer) {
  if (!name || !email || !subject || !message) {
    return false;
  }
  
  if (name.length < 2 || name.length > 50 || checkIfContainsIllegalCharacters(name) || checkIfContainsNumbers(name)) {
    return false;
  }

  if (!validator.validate(email) || email.length > 254) {
    return false;
  }

  if (subject.length < 2 || subject.length > 200 || checkIfContainsUnsafeCharacters(subject)) {
    return false;
  }

  if (message.length < 2 || message.length > 2000) {
    return false;
  }

  phone = phone ? stripPhone(phone) : null;
  if (phone && (phone.length < 10 || phone.length > 15 || !checkIfOnlyNumbers(phone))) {
    return false;
  }

  phoneArea = phoneArea ? stripPhone(phoneArea) : null;
  if (phoneArea && (phoneArea.length < 1 || phoneArea.length > 5 || !checkIfOnlyNumbers(phoneArea))) {
    return false;
  }

  if (!answer || !question || answer.toLowerCase().replace(/\s+/g, '') != questions[question].answer.toLowerCase().replace(/\s+/g, '')) {
    return false;
  }

  // Bot field should be empty (honeypot)
  if (bot && bot.length > 0) {
    return false;
  }

  return true;
}

function checkIfOnlyNumbers(input) {
  return /^[0-9]+$/.test(input);
}
function checkIfContainsIllegalCharacters(input) {
  const illegalCharacters = "!@#$%^&*()_+={}[]|\\:;\"'<>,.?/~`";
  for (let char of illegalCharacters) {
    if (input.includes(char)) {
      return true;
    }
  }
  return false;
}

function checkIfContainsUnsafeCharacters(input) {
  // Check for potentially dangerous characters that could be used in injection attacks
  const unsafePatterns = [
    /<script/i,           // Script tags
    /javascript:/i,       // JavaScript protocol
    /on\w+\s*=/i,        // Event handlers (onclick, onload, etc.)
    /<iframe/i,          // Iframe tags
    /<object/i,          // Object tags
    /<embed/i,           // Embed tags
    /eval\s*\(/i,        // Eval function
    /expression\s*\(/i,  // CSS expression
    /vbscript:/i,        // VBScript protocol
    /data:text\/html/i,  // Data URL with HTML
    /\0/,                // Null bytes
    /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/  // Control characters
  ];
  
  return unsafePatterns.some(pattern => pattern.test(input));
}

function checkIfContainsNumbers(input) {
  return /\d/.test(input);
}
function stripPhone(nbr) {
  return nbr.replace(/[^0-9]/g, '');
}


module.exports = { validateInput };