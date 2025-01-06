const action = {
    update: 1, delete: 2
}

$(document).ready(function () {
    return drawAdminTable();
});

$(async function () {
    await newUser();
})


async function drawAdminTable() {
    const response = await fetch('/api/admin', {
        method: 'GET', headers: {'Content-Type': 'application/json'}
    });
    const users = await response.json();
    const tbody = $('#users-table-body');

    tbody.empty();
    users.forEach((user) => {
        const {id, name, surname, age, username, email, roles} = user;

        tbody.append(`<tr>
        <td>${id}</td>
        <td>${name}</td>
        <td>${surname}</td>
        <td>${age}</td>
        <td>${email}</td>
        <td>${username}</td>
        <td>${roles.map(({name}) => name.substring(5))}</td>
        <td><button type="button" class="btn btn-primary" onclick="openModalHandler(${action.update}, ${id})">Edit</button></td>
        <td><button type="button" class="btn btn-danger" onclick="openModalHandler(${action.delete}, ${id})">Delete</button></td>
        </tr>`)
    })
}

async function newUser() {
    const roles = await getRoles();
    const createUserRolesField = $("#createRoles");
    createUserRolesField.prop('disabled', false).empty();
    roles.forEach(({id, name}) => {
        createUserRolesField.append(`<option value="${id}">${name.substring(5)}</option>`);
    });

    const form = document.forms["createForm"];

    form.addEventListener('submit', addNewUser);

    function addNewUser(e) {
        e.preventDefault();

        let addedRoles = [];

        createUserRolesField.find(':selected').each(function () {
            addedRoles.push({
                id: parseInt($(this).val()), name: $(this).text(), authority: $(this).text()
            });
        });

        fetch("/api/admin/", {
            method: 'POST', headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({
                name: $("#createName").val(),
                surname: $("#createSurname").val(),
                username: $("#createUsername").val(),
                age: $("#createAge").val(),
                email: $("#createEmail").val(),
                password: $("#createPassword").val(),
                roles: addedRoles
            })
        }).then(() => {
            form.reset();
            drawAdminTable();
            $('#adminUsersTable').click();
        })

    }
}

async function openModalHandler(actionId, userId = null) {
    const modal = $('#exampleModal');

    modal.modal();

    const modalFields = modal.find('.form-group');
    const idField = modalFields.children('#id').first();
    const nameField = modalFields.children('#name').first();
    const surnameField = modalFields.children('#surname').first();
    const emailField = modalFields.children('#email').first();
    const ageField = modalFields.children('#age').first();
    const usernameField = modalFields.children('#username').first();
    const passwordField = modalFields.children('#password').first();
    const rolesField = modalFields.children('#roles').first();
    const submitBtn = $('#submit-action');
    const modalLabel = $('#exampleModalLabel');
    const roles = await getRoles();

    rolesField.prop('disabled', false).empty();
    roles.forEach(({id, name}) => {
        rolesField.append(`<option value="${id}">${name.substring(5)}</option>`);
    });

    const {id, name, surname, age, username, email, password} = await getUser(userId);

    idField.val(id);
    idField.parent().prop('hidden', false);
    nameField.val(name).prop('disabled', false);
    surnameField.val(surname).prop('disabled', false);
    emailField.val(email).prop('disabled', false);
    ageField.val(age).prop('disabled', false);
    usernameField.val(username).prop('disabled', false);
    passwordField.val(password).prop('disabled', false);

    switch (actionId) {
        case action.delete:
            modalLabel.text('Delete user');
            submitBtn
                .removeClass()
                .addClass('btn btn-danger')
                .text('Delete')
                .off('click')
                .click(() => submitBtnHandler(deleteUser));
            nameField.prop('disabled', true);
            surnameField.prop('disabled', true);
            emailField.prop('disabled', true);
            ageField.prop('disabled', true);
            usernameField.prop('disabled', true);
            passwordField.prop('disabled', true);
            rolesField.prop('disabled', true);
            break;
        case action.update:
            modalLabel.text('Edit user');
            submitBtn
                .removeClass()
                .addClass('btn btn-info')
                .text('Edit')
                .off('click')
                .click(() => submitBtnHandler(editUser));
            break;
    }
}

async function getUser(userId) {
    const response = await fetch(`/api/admin/${userId}`, {
        method: 'GET', headers: {'Content-Type': 'application/json'}
    });

    return response.json();
}

async function getRoles() {
    const response = await fetch(`/api/admin/roles/`, {
        method: 'GET', headers: {'Content-Type': 'application/json'}
    });

    return response.json();
}

async function submitBtnHandler(callback) {
    const modal = $('#exampleModal');
    const user = collectUserData();

    modal.modal('hide');
    await callback(user);
    drawAdminTable();
}

function collectUserData() {
    const modalFields = $('#exampleModal').find('.form-group');
    const idField = modalFields.children('#id').first();
    const nameField = modalFields.children('#name').first();
    const surnameField = modalFields.children('#surname').first();
    const emailField = modalFields.children('#email').first();
    const ageField = modalFields.children('#age').first();
    const usernameField = modalFields.children('#username').first();
    const passwordField = modalFields.children('#password').first();
    const rolesField = modalFields.children('#roles').first();

    const user = {
        roles: []
    };

    if (idField.val()) {
        user.id = parseInt(idField.val());
    }

    if (nameField.val()) {
        user.name = nameField.val();
    }

    if (surnameField.val()) {
        user.surname = surnameField.val();
    }

    if (emailField.val()) {
        user.email = emailField.val();
    }

    if (ageField.val()) {
        user.age = parseInt(ageField.val());
    }

    if (usernameField.val()) {
        user.username = usernameField.val();
    }

    if (passwordField.val()) {
        user.password = passwordField.val();
    }

    rolesField.find(':selected').each(function () {
        user.roles.push({
            id: parseInt($(this).val()), name: $(this).text(), authority: $(this).text()
        });
    });

    console.log(user);
    return user;
}

const deleteUser = async ({id}) => fetch(`/api/admin/${id}`, {
    method: 'DELETE', headers: {'Content-Type': 'application/json'}
});

const editUser = async (user) => fetch(`/api/admin/`, {
    method: 'PATCH', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(user)
});