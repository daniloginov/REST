document.addEventListener('DOMContentLoaded', function () {
    fetchCurrentUser();
    fetchUsers();
    loadRoles();
    setupCloseButtons();
});

function fetchCurrentUser() {
    console.log('Fetching current user info...');
    fetch('/admin/currentUser')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch current user info');
            }
            return response.json();
        })
        .then(user => {
            console.log('Current user fetched:', user);
            const emailSpan = document.getElementById('currentUserEmail');
            const roleSpan = document.getElementById('currentUserRole');
            emailSpan.textContent = user.email;
            roleSpan.textContent = user.roles.map(role => role.name).join(', ');
        })
        .catch(error => {
            console.error('Error fetching current user info:', error);
        });
}

function fetchUsers() {
    console.log('Fetching users...');
    fetch('/admin/users')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            return response.json();
        })
        .then(response => {
            console.log('Users fetched:', response);
            const tableBody = document.getElementById('users-table-body');
            tableBody.innerHTML = '';
            response.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>
                    <td>${user.roles.map(role => role.name).join(', ')}</td> 
                    <td><button class="btn btn-info" onclick="openEditUserPopup(${user.id})">Edit</button></td>
                    <td><button class="btn btn-danger" onclick="openDeleteUserPopup(${user.id})">Delete</button></td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching users:', error);
            alert('Ошибка при загрузке пользователей');
        });
}

function loadRoles() {
    console.log('Loading roles...');
    fetch('/admin/users/roles')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch roles');
            }
            return response.json();
        })
        .then(roles => {
            console.log('Roles fetched:', roles);
            const roleSelect = document.getElementById('roles');
            const editRoleSelect = document.getElementById('editRoles');
            roleSelect.innerHTML = '';
            editRoleSelect.innerHTML = '';
            roles.forEach(role => {
                const option = document.createElement('option');
                option.value = role.id;
                option.text = role.authority;
                roleSelect.appendChild(option);
                const editOption = document.createElement('option');
                editOption.value = role.id;
                editOption.text = role.authority;
                editRoleSelect.appendChild(editOption);
            });
        })
        .catch(error => {
            console.error('Error loading roles:', error);
            alert('Ошибка при загрузке ролей');
        });
}

document.getElementById('new-user-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const rolesSelected = Array.from(document.getElementById('roles').selectedOptions).map(option => ({
        id: parseInt(option.value, 10)
    }));
    const user = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        age: parseInt(formData.get('age'), 10),
        email: formData.get('email'),
        password: formData.get('password'),
        roles: rolesSelected
    };
    console.log('Creating user:', user);
    fetch('/admin/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            if (response.ok) {
                fetchUsers();
                alert('Пользователь успешно создан!');
                this.reset();
                closeModal('newUserPopup');
            } else {
                return response.json().then(data => {
                    throw new Error(data.message || 'Не удалось создать пользователя');
                });
            }
        })
        .catch(error => {
            console.error('Error creating user:', error);
            alert('Ошибка при создании пользователя: ' + error.message);
        });
});

function openEditUserPopup(userId) {
    console.log('Opening edit modal for user ID:', userId);
    fetch(`/admin/users/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }
            return response.json();
        })
        .then(user => {
            console.log('User fetched for edit:', user);
            document.getElementById('editUserId').value = user.id;
            document.getElementById('editFirstName').value = user.firstName;
            document.getElementById('editLastName').value = user.lastName;
            document.getElementById('editAge').value = user.age;
            document.getElementById('editEmail').value = user.email;
            const editRolesSelect = document.getElementById('editRoles');
            Array.from(editRolesSelect.options).forEach(option => {
                option.selected = user.roles.some(role => role.id === parseInt(option.value, 10));
            });
            openModal('editUserModal');
        })
        .catch(error => {
            console.error('Error fetching user:', error);
            alert('Ошибка при загрузке данных пользователя');
        });
}

document.getElementById('editUserForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    const userId = parseInt(formData.get('id'), 10);
    const rolesSelected = Array.from(document.getElementById('editRoles').selectedOptions).map(option => ({
        id: parseInt(option.value, 10)
    }));
    const user = {
        id: userId, // ID пользователя обязательно
        firstName: formData.get('editFirstName'),
        lastName: formData.get('editLastName'),
        age: parseInt(formData.get('editAge'), 10),
        email: formData.get('editEmail'),
        roles: rolesSelected
    };
    console.log('Updating user:', user);
    fetch(`/admin/users/${userId}`, { // Исправлен путь
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            if (response.ok) {
                fetchUsers(); // Перезагрузка таблицы
                alert('Пользователь успешно обновлен!');
                closeModal('editUserModal');
            } else {
                return response.json().then(data => {
                    console.error('Ошибка обновления:', data);
                    alert('Ошибка при обновлении пользователя: ' + data.message);
                });
            }
        })
        .catch(error => {
            console.error('Error updating user:', error);
            alert('Ошибка при обновлении пользователя: ' + error.message);
        });
});

function openDeleteUserPopup(userId) {
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
        console.log('Deleting user ID:', userId);
        fetch(`/admin/users/${userId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    fetchUsers();
                    alert('Пользователь успешно удалён!');
                } else {
                    return response.json().then(data => {
                        throw new Error(data.message || 'Не удалось удалить пользователя');
                    });
                }
            })
            .catch(error => {
                console.error('Error deleting user:', error);
                alert('Ошибка при удалении пользователя: ' + error.message);
            });
    }
}

function openModal(modalId) {
    console.log('Opening modal:', modalId);
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('overlay');
    if (modal && overlay) {
        modal.style.display = 'block';
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    console.log('Closing modal:', modalId);
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('overlay');
    if (modal && overlay) {
        modal.style.display = 'none';
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function setupCloseButtons() {
    const closeButtons = document.querySelectorAll('.close-popup');
    closeButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const modalId = this.getAttribute('data-modal');
            if (modalId) {
                closeModal(modalId);
            }
        });
    });

    const overlay = document.getElementById('overlay');
    overlay.addEventListener('click', function () {
        const modals = document.querySelectorAll('.popup');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
        this.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
}