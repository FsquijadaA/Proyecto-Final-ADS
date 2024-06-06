document.addEventListener('DOMContentLoaded', () => {
    const loginBox = document.getElementById('loginBox');
    const createAccountBox = document.getElementById('createAccountBox');
    const recoverPasswordBox = document.getElementById('recoverPasswordBox');
    const loginForm = document.getElementById('loginForm');
    const createAccountForm = document.getElementById('createAccountForm');
    const recoverPasswordForm = document.getElementById('recoverPasswordForm');

    // Mostrar formulario de creación de cuenta
    window.showCreateAccount = function() {
        loginBox.style.display = 'none';
        createAccountBox.style.display = 'block';
        recoverPasswordBox.style.display = 'none';
    }

    // Mostrar formulario de inicio de sesión
    window.showLogin = function() {
        createAccountBox.style.display = 'none';
        loginBox.style.display = 'block';
        recoverPasswordBox.style.display = 'none';
    }

    // Mostrar formulario de recuperación de contraseña
    window.showRecoverPassword = function() {
        loginBox.style.display = 'none';
        createAccountBox.style.display = 'none';
        recoverPasswordBox.style.display = 'block';
    }

    // Manejar envío del formulario de inicio de sesión
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        const role = document.getElementById('loginRole').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.username === username && user.password === password && user.role === role);

        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            switch (role) {
                case 'teacher':
                    window.location.href = 'dashboard_teacher.html';
                    break;
                case 'student':
                    window.location.href = 'dashboard.html';
                    break;
                case 'parent':
                    window.location.href = 'dashboard_parent.html';
                    break;
            }
        } else {
            alert('Usuario, contraseña o rol incorrectos.');
        }
    });

    // Manejar envío del formulario de creación de cuenta
    createAccountForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('newUsername').value;
        const password = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const role = document.getElementById('newRole').value;

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden.');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.some(user => user.username === username);

        if (userExists) {
            alert('El nombre de usuario ya existe.');
            return;
        }

        users.push({ username, password, role });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Cuenta creada exitosamente.');
        showLogin();
    });

    // Manejar envío del formulario de recuperación de contraseña
    recoverPasswordForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('recoverUsername').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.username === username);

        if (user) {
            alert(`La contraseña para el usuario ${username} es: ${user.password}`);
        } else {
            alert('Usuario no encontrado.');
        }
    });
});
