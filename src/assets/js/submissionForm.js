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

let currentQuestionId = null;
let formTouched = false;
let redirecting = false



document.getElementById('submission-form').addEventListener('submit', async function(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = {
    name: formData.get('name').trim(),
    email: formData.get('email').trim(),
    message: formData.get('message').trim(),
    subject: formData.get('subject').trim(),
    phone: formData.get('phone') ? stripPhoneNumber(formData.get('phone')).trim() : null,
    phoneArea: formData.get('area-phone') ? stripAreaCode(formData.get('area-phone')).trim() : null,
    bot: formData.get('honeypot'),
    question: currentQuestionId,
    answer: formData.get('bot-test'),
    terms: formData.get('terms') === 'on' ? true : false
  }

  if (checkAllInputs(data, questions)) {
    try {
      fetch('/.netlify/functions/sendEmail-background', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      redirecting = true;
      window.location.href = '/thank-you';
      event.target.reset();
    } catch (error) {
      console.error('Error:', error);
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("submission-form");
  const botTest = form.querySelector('.bot-test');
  const testData = newQuestion();
  botTest.placeholder = `Prove You're Human: ${testData.question}`;
  currentQuestionId = testData.id;

  //^ Mark Fields are "touched" for color styling
  if (!form) return;
  const fields = form.querySelectorAll('input[required], textarea[required]');

  fields.forEach(el => {
    el.addEventListener('blur', () => el.classList.add('touched'));
    el.addEventListener('input', () => el.classList.remove('touched'));
    formTouched = true;
  });

  form.addEventListener('submit', () => {
    fields.forEach(el => el.classList.add('touched'));
    formTouched = true;
  });

  form.addEventListener('reset', () => {
    fields.forEach(el => el.classList.remove('touched'));
    formTouched = false;
  });

})


window.onload = function() {
  window.addEventListener("beforeunload", function (e) {
    if (redirecting || !formTouched) return; // No prompt if redirecting or untouched
    let conMsg = "Are you sure you want to leave? Your message will not be saved."; 
    (e || window.event).returnValue = conMsg; 
    return conMsg;
  });
}



function newQuestion() {
  return questions[Math.floor(Math.random() * questions.length)];
}
