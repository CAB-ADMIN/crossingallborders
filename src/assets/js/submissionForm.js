const questions = [
  { id: 0, question: 'What is your favorite color?', answer: 'blue' },
  { id: 1, question: 'What is your favorite animal?', answer: 'dog' },
  { id: 2, question: 'What is your favorite food?', answer: 'pizza' }
];
let currentQuestionId = null;



document.getElementById('submission-form').addEventListener('submit', async function(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
    subject: formData.get('subject'),
    phone: formData.get('phone') ? stripPhoneNumber(formData.get('phone')) : null,
    phoneArea: formData.get('area-phone') ? stripAreaCode(formData.get('area-phone')) : null,
    bot: formData.get('honeypot'),
    question: currentQuestionId,
    answer: formData.get('bot-test')
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
      // event.target.reset();
      
      // window.location.href = '/thank-you';
    } catch (error) {
      console.error('Error:', error);
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const botTest = document.getElementById("submission-form").querySelector('.bot-test');
  const testData = newQuestion();
  botTest.placeholder = testData.question;
  currentQuestionId = testData.id;
})


function newQuestion() {
  return questions[Math.floor(Math.random() * questions.length)];
}
