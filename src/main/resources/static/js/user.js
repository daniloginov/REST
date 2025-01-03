document.addEventListener("DOMContentLoaded", function () {
    fetch("/user/profile_user")
        .then(response => response.json())
        .then(user => {
            document.getElementById("userId").textContent = user.id;
            document.getElementById("firstName").textContent = user.firstName;
            document.getElementById("lastName").textContent = user.lastName;
            document.getElementById("age").textContent = user.age;
            document.getElementById("email").textContent = user.email;
            let roles = user.authorities.map(role => role.authority.substring(5)).join(", ");
            document.getElementById("roles").textContent = roles;
            document.getElementById("navbarUserEmail").textContent = user.username;
            document.getElementById("navbarUserRoles").textContent = roles;
        })
        .catch(error => console.error("Error fetching user data:", error));
});