const api_url = "https://api-b3hj.onrender.com"

const submitButton = document.getElementById('submitButton');
submitButton.addEventListener('click', async function (e) {
    const newCompanyName = document.getElementById('companyName').value;
    const newTown = document.getElementById('town').value;
    const newAddress = document.getElementById('address').value;
    const newTelephoneNumber = document.getElementById('telephoneNumber').value;
    const newWebsite = document.getElementById('website').value;
    const checkSave = document.getElementById('checkSave');

    if (validateForm(newCompanyName, newTown, newAddress, newTelephoneNumber, newWebsite) == false) {
        return
    }

    document.getElementById('companyName').value = '';
    document.getElementById('town').value = '';
    document.getElementById('address').value = '';
    document.getElementById('telephoneNumber').value = '';
    document.getElementById('website').value = '';

    const data = JSON.stringify({
        company_name: newCompanyName,
        town: newTown,
        address: newAddress,
        telephone_number: newTelephoneNumber,
        website: newWebsite,
    });

    await fetch(api_url + '/companies/create', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: data
    });
    if (checkSave.checked == false) {
        window.location.replace("companies.html");
    }

    const successToastEl = document.getElementById('successToast');
    const successToast = new bootstrap.Toast(successToastEl);
    successToast.show();

});


function validateForm(companyName, town, address, telephoneNumber, website) {
    function isValidHttpUrl(string) {
        let url;
        try {
          url = new URL(string);
        } catch (_) {
          return false;  
        }
        return true;
    }

    
    let incorrectData = false;
    const toastMessage = document.getElementById("incorrectToastMessage");
    if (companyName == "" || town == "" || address == "" || telephoneNumber == "" || website == "") {
        toastMessage.innerHTML = "Fields cannot be left blank.";
        incorrectData = true;
    } else if (/^\d+$/.test(telephoneNumber) == false) {
        toastMessage.innerHTML = "Telephone Number field can only include numbers.";
        incorrectData = true;
    } else if (isValidHttpUrl(website) == false) {
        toastMessage.innerHTML = "Website field must be a valid URL.";
        incorrectData = true;
    };

    if (incorrectData == true) {
        const incorrectToastEl = document.getElementById('incorrectToast');
        const incorrectToast = new bootstrap.Toast(incorrectToastEl);
        incorrectToast.show();
        return false;
    } else {
        return true;
    }
};