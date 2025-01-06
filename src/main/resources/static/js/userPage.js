$(document).ready(function () {
    return drawUserTable();
});

async function drawUserTable() {
    const response = await fetch('/api/user/', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });
    const {id, name, surname, age, username, email, roles} = await response.json();

    $('#user-table-body').append(`<tr>
        <td>${id}</td>
        <td>${name}</td>
        <td>${surname}</td>
        <td>${age}</td>
        <td>${email}</td>
        <td>${username}</td>
        <td>${roles.map(({name}) => name.substring(5))}</td>
      </tr>`);
}