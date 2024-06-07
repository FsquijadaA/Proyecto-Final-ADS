let currentUser;

document.addEventListener('DOMContentLoaded', () => {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        window.location.href = 'login.html';
    } else {
        document.getElementById('profileName').value = currentUser.username;
        document.getElementById('profileEmail').value = currentUser.email || '';
        document.getElementById('profilePhone').value = currentUser.phone || '';
        document.getElementById('profileAddress').value = currentUser.address || '';
        document.getElementById('profilePassword').value = currentUser.password;

        const profilePic = document.getElementById('profilePic');
        if (currentUser.profilePic) {
            profilePic.src = currentUser.profilePic;
        }

        const profilePicInput = document.getElementById('profilePicInput');
        profilePicInput.addEventListener('change', function() {
            const file = profilePicInput.files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                profilePic.src = e.target.result;
                currentUser.profilePic = e.target.result;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            };

            if (file) {
                reader.readAsDataURL(file);
            }
        });

        if (currentUser.role === 'student') {
            document.getElementById('parentSection').style.display = 'block';
            document.getElementById('profileParent').value = currentUser.parent || '';
        } else {
            document.getElementById('parentSection').style.display = 'none';
        }
    }
});

function saveProfile() {
    const parentUsername = document.getElementById('profileParent') ? document.getElementById('profileParent').value : null;

    if (parentUsername) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const parentUser = users.find(user => user.username === parentUsername && user.role === 'parent');

        if (!parentUser) {
            alert('El nombre del padre/madre/responsable ingresado no es válido o no tiene el rol de padre/madre.');
            return;
        }
    }

    const updatedUser = {
        username: document.getElementById('profileName').value,
        email: document.getElementById('profileEmail').value,
        phone: document.getElementById('profilePhone').value,
        address: document.getElementById('profileAddress').value,
        password: document.getElementById('profilePassword').value,
        profilePic: document.getElementById('profilePic').src,
        parent: parentUsername,
        role: currentUser.role
    };

    let users = JSON.parse(localStorage.getItem('users')) || [];
    users = users.map(user => user.username === updatedUser.username ? updatedUser : user);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    alert('Perfil actualizado exitosamente.');
    goBack(); // Regresar al dashboard correspondiente
}

function goBack() {
    if (currentUser.role === 'student') {
        window.location.href = 'dashboard.html';
    } else if (currentUser.role === 'teacher') {
        window.location.href = 'dashboard_teacher.html';
    } else if (currentUser.role === 'parent') {
        window.location.href = 'dashboard_parent.html';
    }
}
