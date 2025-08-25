const questions = [
  { id: 0, question: 'What is 1+1?', answer: '2' },
  { id: 1, question: 'What is 3-2?', answer: '1' },
  { id: 2, question: 'What color is the sky?', answer: 'blue' },
  { id: 3, question: 'What color are bananas?', answer: 'yellow' },
  { id: 4, question: 'Type the word: cat', answer: 'cat' },
  { id: 5, question: 'Type the word: sun', answer: 'sun' },
  { id: 6, question: 'Is fire hot? (yes or no)', answer: 'yes' },
  { id: 7, question: 'Is ice warm? (yes or no)', answer: 'no' },
  { id: 8, question: 'What is 2+2?', answer: '4' },
  { id: 9, question: 'What color is grass?', answer: 'green' }
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
  botTest.placeholder = `Prove You're Human: ${testData.question}`;
  currentQuestionId = testData.id;
})


function newQuestion() {
  return questions[Math.floor(Math.random() * questions.length)];
}
