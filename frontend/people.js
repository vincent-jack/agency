async function getPeople(file) {
    const response = await fetch(file);
    const json = await response.json();

    const table = document.getElementById("data-table");

    for (let i = 0; i < json.length; i++) {
        const row = document.createElement("tr");
        const buttonCol = document.createElement("th");

        const viewButton = document.createElement("a");
        viewButton.appendChild(document.createTextNode("View"));
        const viewUrl = new URL("http://127.0.0.1:8080/edit-person.html");
        viewUrl.searchParams.append("id", json[i].Id)
        viewUrl.searchParams.append("firstName", json[i].FirstName)
        viewUrl.searchParams.append("surname", json[i].Surname)
        viewUrl.searchParams.append("editable", false)
        viewButton.href = viewUrl
        viewButton.classList.add("btn");
        viewButton.classList.add("btn-outline-dark");
        buttonCol.appendChild(viewButton);

        const editButton = document.createElement("a");
        editButton.appendChild(document.createTextNode("Edit"));
        const url = new URL("http://127.0.0.1:8080/edit-person.html");
        url.searchParams.append("id", json[i].Id)
        url.searchParams.append("firstName", json[i].FirstName)
        url.searchParams.append("surname", json[i].Surname)
        url.searchParams.append("editable", true)
        editButton.href = url
        editButton.classList.add("btn");
        editButton.classList.add("btn-outline-primary");
        buttonCol.appendChild(editButton)

        const deletebutton = document.createElement("button");
        deletebutton.appendChild(document.createTextNode("Delete"));
        deletebutton.dataset.id = json[i].Id;
        deletebutton.addEventListener("click", deleteRow);
        deletebutton.classList.add("btn");
        deletebutton.classList.add("btn-outline-danger");
        buttonCol.appendChild(deletebutton);

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


async function deleteRow(event) {
    const deletePerson = confirm("Are you sure you want to delete this person?")
    if (deletePerson == true) {
        const person_id = event.target.dataset.id;
        await fetch("http://127.0.0.1:5000/people/delete/" + person_id, {
            method: "DELETE"
        });
        location.reload();
    }
}

async function updateRow(event) {
    const person_id = event.target.dataset.id;
    const new_first_name = prompt("Enter First Name:");
    const new_surname = prompt("Enter Surname:");
    const data = JSON.stringify({
        first_name: new_first_name,
        surname: new_surname,
    });

    await fetch("http://127.0.0.1:5000/people/update/" + person_id, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
          },
        body: data,
    })
    location.reload();
}


