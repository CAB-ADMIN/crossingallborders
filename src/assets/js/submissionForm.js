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
    bot: formData.get('honeypot')
  }

  await checkAllInputs(data);
  if (checkAllInputs(data)) {
    try {
      fetch('/.netlify/functions/sendEmail-background', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      event.target.reset();
      
      window.location.href = '/thank-you';
    } catch (error) {
      console.error('Error:', error);
    }
  }
});