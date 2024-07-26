const urlParams = new URLSearchParams(window.location.search);
const idValue = urlParams.get('id');

document.getElementById('companyName').value = urlParams.get('companyName');
document.getElementById('town').value = urlParams.get('town');
const editable = (urlParams.get('editable') === 'true')

async function getPeople(file) {
    const response = await fetch(file);
    const json = await response.json();

    const employeesResponse = await fetch("http://127.0.0.1:5000/company-people/" + idValue);
    const employeesJson = await employeesResponse.json();

    console.log(employeesJson)

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
            if (employeesJson.includes(json[i].Id)) {
                addCheck.checked = true;
            };
            buttonCol.appendChild(addCheck);
        } else {
            document.getElementById('checkDiv').style.display = "none";
            document.getElementById('submitButton').style.display = "none";
            document.getElementById('companyName').disabled = true;
            document.getElementById('town').disabled = true;
            document.getElementById('pageTitle').innerHTML = "View Company"
        }
        row.appendChild(buttonCol);
 

        const idCol = document.createElement("th");
        idCol.appendChild(document.createTextNode(json[i].Id));
        const firstNameCol = document.createElement("th");
        firstNameCol.appendChild(document.createTextNode(json[i].FirstName));
        const surnameCol = document.createElement("th");
        surnameCol.appendChild(document.createTextNode(json[i].Surname));
        row.appendChild(idCol);
        row.appendChild(firstNameCol);
        row.appendChild(surnameCol);

        table.appendChild(row);
        }
    }

getPeople("http://127.0.0.1:5000/people");

const submitButton = document.getElementById('submitButton');

submitButton.addEventListener('click', async function (e) {
    const newCompanyName = document.getElementById('companyName').value
    const newTown = document.getElementById('town').value
    const checkSave = document.getElementById('checkSave')

    const checkedList = document.querySelectorAll('[type="checkbox"]:checked')
    const checkedArr = Array.prototype.slice.call(checkedList);
    if (checkSave.checked == true) {
        checkedArr.shift();
    }
    const companyPeopleId = checkedArr.map(a => a.value);

    if (newCompanyName == "" || newTown == "" 
        || newCompanyName.includes("'") == true || newCompanyName.includes('"') == true || newTown.includes("'") == true || newTown.includes('"') == true) {
        const incorrectToastEl = document.getElementById('incorrectToast')
        const incorrectToast = new bootstrap.Toast(incorrectToastEl)
        incorrectToast.show();
        return
    }
    const data = JSON.stringify({
        company_name: newCompanyName,
        town: newTown,
        company_people_id: companyPeopleId
    });

    await fetch('http://127.0.0.1:5000/companies/update/' + idValue, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: data
    });
    if (checkSave.checked == false) {
        window.location.replace("http://127.0.0.1:8080/companies.html");
    }

    const successToastEl = document.getElementById('successToast')
    const successToast = new bootstrap.Toast(successToastEl)
    successToast.show();


});

