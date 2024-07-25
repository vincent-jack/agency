const urlParams = new URLSearchParams(window.location.search);
const idValue = urlParams.get('id');

document.getElementById('firstName').value = urlParams.get('firstName');
document.getElementById('surname').value = urlParams.get('surname');
const editable = (urlParams.get('editable') === 'true')

async function getCompanies(file) {
    const response = await fetch(file);
    const json = await response.json();

    const table = document.getElementById("data-table");
    for (let i = 0; i < json.length; i++) {
        const row = document.createElement("tr");
        const buttonCol = document.createElement("th");

        if (editable == true) {
            const addCheck = document.createElement("input");
            addCheck.classList.add("form-check-input");
            addCheck.classList.add("border");
            addCheck.classList.add("border-primary");
            addCheck.classList.add("add-person-check");
            addCheck.setAttribute("type", "checkbox");
            addCheck.setAttribute("value", json[i].Id);
            buttonCol.appendChild(addCheck);
        } else {
            document.getElementById('checkDiv').style.display = "none";
            document.getElementById('submitButton').style.display = "none";
            document.getElementById('firstName').disabled = true;
            document.getElementById('surname').disabled = true;
            document.getElementById('pageTitle').innerHTML = "View Person"
        }
        row.appendChild(buttonCol);
 

        const idCol = document.createElement("th");
        idCol.appendChild(document.createTextNode(json[i].Id));
        const firstNameCol = document.createElement("th");
        firstNameCol.appendChild(document.createTextNode(json[i].CompanyName));
        const surnameCol = document.createElement("th");
        surnameCol.appendChild(document.createTextNode(json[i].Town));
        row.appendChild(idCol);
        row.appendChild(firstNameCol);
        row.appendChild(surnameCol);

        table.appendChild(row);
        }
    }

getCompanies("http://127.0.0.1:5000/companies");


const submitButton = document.getElementById('submitButton');

submitButton.addEventListener('click', async function (e) {
    const newFirstName = document.getElementById('firstName').value
    const newSurname = document.getElementById('surname').value
    const checkSave = document.getElementById('checkSave')

    if (newFirstName == "" || newSurname == "" 
        || newFirstName.includes("'") == true || newFirstName.includes('"') == true || newSurname.includes("'") == true || newSurname.includes('"') == true) {
        const incorrectToastEl = document.getElementById('incorrectToast')
        const incorrectToast = new bootstrap.Toast(incorrectToastEl)
        incorrectToast.show();
        return
    }
    const data = JSON.stringify({
        first_name: newFirstName,
        surname: newSurname,
    });

    await fetch('http://127.0.0.1:5000/people/update/' + idValue, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: data
    });
    if (checkSave.checked == false) {
        window.location.replace("http://127.0.0.1:8080/people.html");
    }

    const successToastEl = document.getElementById('successToast')
    const successToast = new bootstrap.Toast(successToastEl)
    successToast.show();


});