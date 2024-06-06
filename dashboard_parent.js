document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'parent') {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('username').textContent = currentUser.username;

    const dashboardProfilePic = document.getElementById('dashboardProfilePic');
    if (currentUser.profilePic) {
        dashboardProfilePic.src = currentUser.profilePic;
    }

    updateClock();
    setInterval(updateClock, 1000);

    // Obtener el estudiante relacionado
    const students = JSON.parse(localStorage.getItem('users')) || [];
    const student = students.find(user => user.username === currentUser.child);

    if (student) {
        renderGrades(student.grades || []);
        renderNotifications(student.notifications || []);
    } else {
        alert('No se encontró al estudiante asociado.');
    }

    function updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
    }

    function renderGrades(grades) {
        const gradesList = document.getElementById('gradesList');
        gradesList.innerHTML = '';
        grades.forEach(grade => {
            const li = document.createElement('li');
            li.textContent = `${grade.subject}: ${grade.grade}`;
            gradesList.appendChild(li);
        });
    }

    function renderNotifications(notifications) {
        const notificationsList = document.getElementById('notificationsList');
        notificationsList.innerHTML = '';
        notifications.forEach(notification => {
            const li = document.createElement('li');
            li.textContent = notification;
            notificationsList.appendChild(li);
        });
    }
});
