function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatMessage(data) {
  const { name, email, subject, message, phone, phoneArea, ip } = data;

  // Sanitize all user inputs
  const sanitizedName = escapeHtml(name);
  const sanitizedEmail = escapeHtml(email);
  const sanitizedSubject = escapeHtml(subject);
  const sanitizedMessage = escapeHtml(message);

  const newSubject = `Re: Crossing All Borders - ${sanitizedSubject}`;
  const newMessage = `Dear ${sanitizedName},

Thank you for reaching out to, Crossing All Borders! We appreciate your taking time to contact us.



Re: ${sanitizedSubject}
  ${sanitizedMessage}
  `;

  return `
    <h2>📬 New Contact Submission</h2>
    <p>Dear CAB Team, you have a new contact submission:</p>

    <hr style="margin-bottom: 2em;">

    <p><strong>Name:</strong> ${sanitizedName} (<a href="mailto:${sanitizedEmail}">${sanitizedEmail}</a>)</p>
    <p><strong>Subject:</strong> ${sanitizedSubject}</p>
    ${phone ? `<p><strong>Phone:</strong> ${formatPhoneNumber(phone, phoneArea)}</p>` : ''}

    <p><strong>Message:</strong><br>
    ${sanitizedMessage.replace(/\n/g, '<br>')}
    </p>

    <button style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
      <a href="mailto:${sanitizedEmail}?subject=${encodeURIComponent(newSubject)}&body=${encodeURIComponent(newMessage)}" style="color: white; text-decoration: none;">Reply to ${sanitizedName}</a>
    </button>

    <hr style="margin-top: 2em;">

    <p style="font-size: 0.9em; color: #666;">
    Best regards,<br>
    The Crossing All Borders Website<br>
    <em>(${randomEnding()})</em>
    </p>
    <p style="font-size: 0.001em; opacity: 0;">
    <strong>IP Address:</strong> ${escapeHtml(ip)} (this is for abuse prevention purposes only)</p>
  `;
}

function formatPhoneNumber(phone, phoneArea) {
  // Sanitize inputs
  phone = phone ? escapeHtml(phone.replace(/[^0-9]/g, '')) : '';
  phoneArea = phoneArea ? escapeHtml(phoneArea.replace(/[^0-9]/g, '')) : '';
  
  if (!phone) return '';
  
  // Format phone number
  if (phone.length === 10) {
    phone = phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }
  
  return phoneArea ? `${phoneArea} ${phone}` : phone;
}


function randomEnding() {
  const endings = [
    "Sent by a highly caffeinated website",
    "Digitally handcrafted just for you",
    "Your friendly neighborhood website",
    "Powered by pixels and optimism",
    "Delivered by invisible code ninjas",
    "Sent from our server, not a magic owl",
    "This email brought to you by caffeine and good intentions",
    "Your website, keeping it professional-ish",
    "Generated with love and JavaScript",
    "Another successful mission completed by our website",
    "Brought to you by a team of very small electrons",
    "From the desk of a busy website",
    "Where no pixel is left behind",
    "Spam-free and full of charm",
    "Typed, compiled, and sent with care",
    "This website never sleeps (literally)",
    "Built with coffee, hope, and code",
    "Your message has been safely teleported",
    "Powered by good vibes and HTML",
    "Sent from a place where HTML dreams come true"
  ];
  return endings[Math.floor(Math.random() * endings.length)];
}

module.exports = { formatMessage };