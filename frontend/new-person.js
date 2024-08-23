const api_url = "http://127.0.0.1:5000";
const submitButton = document.getElementById('submitButton');


submitButton.addEventListener('click', async function (e) {
    const newFirstName = document.getElementById('firstName').value;
    const newSurname = document.getElementById('surname').value;
    const newEmail = document.getElementById('email').value;
    const newTelephoneNumber = document.getElementById('telephoneNumber').value;
    const newDateOfBirth = document.getElementById('dateOfBirth').value;

    const checkSave = document.getElementById('checkSave');

    if (validateForm(newFirstName, newSurname, newEmail, newTelephoneNumber, newDateOfBirth) == false) {
        return;
    };

    document.getElementById('firstName').value = '';
    document.getElementById('surname').value = '';
    document.getElementById('email').value = '';
    document.getElementById('telephoneNumber').value = '';
    document.getElementById('dateOfBirth').value = '';

    const data = JSON.stringify({
        first_name: newFirstName,
        surname: newSurname,
        email: newEmail,
        telephone_number: newTelephoneNumber,
        date_of_birth: newDateOfBirth
    });

    await fetch(api_url + '/people/create', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: data
    });
    if (checkSave.checked == false) {
        window.location.replace("people.html");
    }

    const successToastEl = document.getElementById('successToast');
    const successToast = new bootstrap.Toast(successToastEl);
    successToast.show();


});


function validateForm(firstName, surname, email, telephoneNumber, dateOfBirth) {
    let incorrectData = false;
    const now = new Date;
    const toastMessage = document.getElementById("incorrectToastMessage");
    if (firstName == "" || surname == "" || email == "" || telephoneNumber == "" || dateOfBirth == "") {
        toastMessage.innerHTML = "Fields cannot be left blank.";
        incorrectData = true;
    } else if (/^\d+$/.test(telephoneNumber) == false) {
        toastMessage.innerHTML = "Telephone Number field can only include numbers.";
        incorrectData = true;
    } else if (new Date(dateOfBirth) > now) {
        toastMessage.innerHTML = "Date of Birth cannot be in the future.";
        incorrectData = true;
    };
    

    if (incorrectData == true) {
        const incorrectToastEl = document.getElementById('incorrectToast');
        const incorrectToast = new bootstrap.Toast(incorrectToastEl);
        incorrectToast.show();
        return false;
    } else {
        return true;
    };
};