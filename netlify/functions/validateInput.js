'use strict';

const validator = require('validator');

const questions = [
  { id: 0, question: 'What is 1+1?', answer: '2' },
  { id: 1, question: 'What is 3-2?', answer: '1' },
  { id: 2, question: 'What color is the sky?', answer: 'blue' },
  { id: 3, question: 'What color are bananas?', answer: 'yellow' },
  { id: 4, question: 'Type the word "cat"', answer: 'cat' },
  { id: 5, question: 'Type the word "sun"', answer: 'sun' },
  { id: 6, question: 'Is fire hot? (yes or no)', answer: 'yes' },
  { id: 7, question: 'Is ice warm? (yes or no)', answer: 'no' },
  { id: 8, question: 'What is 2+2?', answer: '4' },
  { id: 9, question: 'What color is grass?', answer: 'green' }
];

const ErrorCodes = {
  MISSING_REQUIRED: 'MISSING_REQUIRED',
  NAME_LENGTH: 'NAME_LENGTH',
  NAME_CHARS: 'NAME_CHARS',
  EMAIL_INVALID: 'EMAIL_INVALID',
  SUBJECT_LENGTH: 'SUBJECT_LENGTH',
  SUBJECT_UNSAFE: 'SUBJECT_UNSAFE',
  MESSAGE_LENGTH: 'MESSAGE_LENGTH',
  MESSAGE_UNSAFE: 'MESSAGE_UNSAFE',
  PHONE_INVALID: 'PHONE_INVALID',
  PHONE_AREA_INVALID: 'PHONE_AREA_INVALID',
  BOT_TRAP: 'BOT_TRAP',
  QUESTION_INDEX_INVALID: 'QUESTION_INDEX_INVALID',
  ANSWER_MISSING: 'ANSWER_MISSING',
  ANSWER_INCORRECT: 'ANSWER_INCORRECT'
};

function toStr(v) {
  if (v === null || v === undefined) return "";
  return typeof v === "string" ? v : String(v);
}

function trim(v) {
  return validator.trim(toStr(v));
}

function digitsOnly(v) {
  return validator.whitelist(toStr(v), "0-9");
}

function isSafeText(v) {
  const s = toStr(v);
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

  return !unsafePatterns.some((p) => p.test(s));
}


function validateInputWithCode(fields) {
  console.log(fields)
  let {
    name, email, subject, message,
    phone = '', phoneArea = '',
    bot = '', question, answer
  } = fields || {};

  name = trim(name);
  email = trim(email);
  subject = trim(subject);
  message = trim(message);
  phone = trim(phone);
  phoneArea = trim(phoneArea);
  bot = trim(bot);
  const answerTrim = trim(answer);
  const questionStr = trim(question);

  if (!name || !email || !subject || !message) {
    return { ok: false, code: ErrorCodes.MISSING_REQUIRED, message: 'name, email, subject, message are required' };
  }

  if (!validator.isLength(name, { min: 2, max: 50 })) {
    return { ok: false, code: ErrorCodes.NAME_LENGTH, message: 'name must be 2-50 chars' };
  }
  const nameForCheck = name.replace(/\u2019/g, "'"); // curly -> straight apostrophe
  const nameOk = /^[\p{L}\p{M}\s'-]+$/u.test(nameForCheck);
  if (!nameOk) {
    return { ok: false, code: ErrorCodes.NAME_CHARS, message: 'name must contain only letters, spaces, hyphens, apostrophes' };
  }


  const normalized = validator.normalizeEmail(email) || email;
  if (!validator.isEmail(normalized) || !validator.isLength(normalized, { max: 254 })) {
    return { ok: false, code: ErrorCodes.EMAIL_INVALID, message: 'email invalid or too long' };
  }


  if (!validator.isLength(subject, { min: 2, max: 200 })) {
    return { ok: false, code: ErrorCodes.SUBJECT_LENGTH, message: 'subject must be 2-200 chars' };
  }
  if (!isSafeText(subject)) {
    return { ok: false, code: ErrorCodes.SUBJECT_UNSAFE, message: 'subject contains unsafe content' };
  }

  if (!validator.isLength(message, { min: 2, max: 2000 })) {
    return { ok: false, code: ErrorCodes.MESSAGE_LENGTH, message: 'message must be 2-2000 chars' };
  }
  if (!isSafeText(message)) {
    return { ok: false, code: ErrorCodes.MESSAGE_UNSAFE, message: 'message contains unsafe content' };
  }

  if (phone) {
    if (/(?:ext\.?|extension|x)\s*\d+/i.test(phone)) {
      return { ok: false, code: ErrorCodes.PHONE_INVALID, message: 'phone extensions are not allowed' };
    }
    const p = digitsOnly(phone);
    if (!validator.isLength(p, { min: 10, max: 15 }) || !validator.isNumeric(p)) {
      return { ok: false, code: ErrorCodes.PHONE_INVALID, message: 'phone must be 10-15 digits' };
    }
  }

  if (phoneArea) {
    const a = digitsOnly(phoneArea);
    if (!validator.isLength(a, { min: 1, max: 5 }) || !validator.isNumeric(a)) {
      return { ok: false, code: ErrorCodes.PHONE_AREA_INVALID, message: 'area code must be 1-5 digits' };
    }
  }


  if (bot.length > 0) {
    return { ok: false, code: ErrorCodes.BOT_TRAP, message: 'honeypot must be empty' };
  }

  if (!validator.isInt(questionStr, { min: 0, max: questions.length - 1 })) {
    return { ok: false, code: ErrorCodes.QUESTION_INDEX_INVALID, message: 'invalid question index' };
  }
  const qIndex = parseInt(questionStr, 10);
  if (!answerTrim) {
    return { ok: false, code: ErrorCodes.ANSWER_MISSING, message: 'challenge answer missing' };
  }

  const expected = toStr(questions[qIndex]?.answer || '');
  if (answerTrim.toLowerCase() !== expected.toLowerCase()) {
    return { ok: false, code: ErrorCodes.ANSWER_INCORRECT, message: 'challenge answer incorrect' };
  }

  return { ok: true };
}


function validateInput(name, email, subject, message, phone, phoneArea, bot, question, answer) {
  const res = validateInputWithCode({
    name, email, subject, message, phone, phoneArea, bot, question, answer
  });
  return res.ok;
}

module.exports = { validateInput };