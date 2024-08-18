const api_url = "https://api-b3hj.onrender.com"

const submitButton = document.getElementById('submitButton');
submitButton.addEventListener('click', async function (e) {
    const newFirstName = document.getElementById('firstName').value
    const newSurname = document.getElementById('surname').value
    const checkSave = document.getElementById('checkSave')

    if (newFirstName == "" || newSurname == ""
        || newFirstName.includes("'") == true || newFirstName.includes('"') == true || newSurname.includes("'") == true || newSurname.includes('"') == true
    ) {
        const incorrectToastEl = document.getElementById('incorrectToast')
        const incorrectToast = new bootstrap.Toast(incorrectToastEl)
        incorrectToast.show();
        return
    }

    document.getElementById('firstName').value = ''
    document.getElementById('surname').value = ''

    const data = JSON.stringify({
        first_name: newFirstName,
        surname: newSurname,
    });

    await fetch(api_url + '/people/create', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: data
    });
    if (checkSave.checked == false) {
        window.location.replace("people.html");
    }

    const successToastEl = document.getElementById('successToast')
    const successToast = new bootstrap.Toast(successToastEl)
    successToast.show();


});