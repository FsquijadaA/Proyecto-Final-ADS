document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

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
    }
});

function saveProfile() {
    const updatedUser = {
        username: document.getElementById('profileName').value,
        email: document.getElementById('profileEmail').value,
        phone: document.getElementById('profilePhone').value,
        address: document.getElementById('profileAddress').value,
        password: document.getElementById('profilePassword').value,
        profilePic: document.getElementById('profilePic').src
    };

    let users = JSON.parse(localStorage.getItem('users')) || [];
    users = users.map(user => user.username === updatedUser.username ? updatedUser : user);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    alert('Perfil actualizado exitosamente.');
    window.location.href = 'dashboard.html'; // Redirigir al dashboard
}
