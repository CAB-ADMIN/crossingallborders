function checkAllInputs(formData) {
  const errors = [];
  //^ Name:
  if (!formData.name) {
    errors.push("Please enter your name.");
  } else if (formData.name.length > 50) {
    errors.push("Name is too long.");
  } else if (formData.name.length < 2 ) {
    errors.push("Name is too short.");
  } else if (checkIfContainsIllegalCharacters(formData.name)) {
    errors.push("Name contains illegal characters.");
  } else if (checkIfContainsNumbers(formData.name)) {
    errors.push("Name cannot contain numbers.");
  }

  //^ Email:
  if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.push("Email is invalid.");
  } else if (formData.email.length > 254) {
    errors.push("Email is too long.");
  }

  //^ Subject:
  if (!formData.subject) {
    errors.push("Please enter a subject.");
  } else if (formData.subject.length < 2) {
    errors.push("Subject is too short.");
  } else if (formData.subject.length > 200) {
    errors.push("Subject is too long.");
  }

  //^ Message:
  if (!formData.message) {
    errors.push("Please enter a message.");
  } else if (formData.message.length < 2) {
    errors.push("Message is too short.");
  } else if (formData.message.length > 2000) {
    errors.push("Message is too long.");
  }

  //^ Phone Number:
  if (formData.phone) {
    const strippedPhone = stripPhoneNumber(formData.phone);
    if (strippedPhone.length != 10) {
      errors.push("Phone number must be 10 digits long.");
    } else if (!checkIfOnlyNumbers(strippedPhone)) {
      errors.push("Your phone number must contain only numbers, parentheses, or dashes.");
    }
  }


  //^ Phone Area Code:
  if (formData.phoneArea) {
    const strippedAreaCode = stripAreaCode(formData.phoneArea);
    if (strippedAreaCode.length < 1 || strippedAreaCode.length > 5) {
      errors.push("Phone area code must be between 1 and 5 digits.");
    } else if (!checkIfOnlyNumbers(strippedAreaCode)) {
      errors.push("Your phone area code must contain only numbers, or a plus sign.");
    }
  }

  //^ Honeypot:
  if (formData.bot && formData.bot.trim() !== '') {
    document.location.href = "https://www.google.com";
  }

  errors.forEach((error) => {
    const errorDiv = document.getElementById("submission-form").querySelector(".errors");
    errorDiv.innerHTML = "";
    if (errorDiv) {
      const errorElement = document.createElement("p");
      errorElement.textContent = error;
      errorDiv.appendChild(errorElement);
    }
  })
  return errors.length > 0 ? false : true;
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

function checkIfContainsNumbers(input) {
  return /\d/.test(input);
}

function checkIfOnlyNumbers(input) {
  return /^[0-9]+$/.test(input);
}



function stripPhoneNumber(input) {
  return input.replace(/[^0-9+]/g, '');
}

function stripAreaCode(input) {
  return input.replace(/[^0-9]/g, '');
}


