document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'student') {
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

    // Inicializar el calendario
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: JSON.parse(localStorage.getItem('enrolledEvents')) || []
    });
    calendar.render();

    const enrolledSubjects = JSON.parse(localStorage.getItem('enrolledSubjects')) || [];
    renderEnrolledSubjectsList(enrolledSubjects);

    const enrollForm = document.getElementById('enrollForm');
    enrollForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const selectedSubjects = Array.from(document.getElementById('subjectsSelect').selectedOptions).map(option => option.value);
        const selectedGroup = document.getElementById('groupsSelect').value;
        selectedSubjects.forEach(subjectName => {
            const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
            const subject = subjects.find(sub => sub.name === subjectName);
            if (subject) {
                enrolledSubjects.push({ ...subject, group: selectedGroup });
            }
        });
        localStorage.setItem('enrolledSubjects', JSON.stringify(enrolledSubjects));
        renderEnrolledSubjectsList(enrolledSubjects);
        updateCalendarEvents(enrolledSubjects);
        closeModal();
    });

    function updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
    }

    function renderAvailableSubjects() {
        const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
        const subjectsSelect = document.getElementById('subjectsSelect');
        subjectsSelect.innerHTML = '';  // Clear existing options
        subjects.forEach(subject => {
            if (subject && subject.days) {
                const option = document.createElement('option');
                option.value = subject.name;
                option.textContent = `${subject.name} (${subject.days.join(', ')} ${subject.startTime} - ${subject.endTime})`;
                subjectsSelect.appendChild(option);
            }
        });
    }

    function renderAvailableGroups() {
        const groups = JSON.parse(localStorage.getItem('groups')) || [];
        const groupsSelect = document.getElementById('groupsSelect');
        groupsSelect.innerHTML = '';  // Clear existing options
        if (groups.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No hay grupos disponibles';
            groupsSelect.appendChild(option);
        } else {
            groups.forEach(group => {
                if (group) {
                    const option = document.createElement('option');
                    option.value = group.name;
                    option.textContent = group.name;
                    groupsSelect.appendChild(option);
                }
            });
        }
    }

    window.renderAvailableSubjects = renderAvailableSubjects;
    window.renderAvailableGroups = renderAvailableGroups;

    function renderEnrolledSubjectsList(enrolledSubjects) {
        const enrolledSubjectsList = document.getElementById('enrolledSubjectsList');
        enrolledSubjectsList.innerHTML = '';  // Clear existing list
        enrolledSubjects.forEach((subject, index) => {
            if (subject && subject.days) {
                const li = document.createElement('li');
                li.textContent = `${subject.name} - Grupo: ${subject.group} (${subject.days.join(', ')} ${subject.startTime} - ${subject.endTime})`;
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Eliminar';
                deleteButton.onclick = () => {
                    enrolledSubjects.splice(index, 1);
                    localStorage.setItem('enrolledSubjects', JSON.stringify(enrolledSubjects));
                    renderEnrolledSubjectsList(enrolledSubjects);
                    updateCalendarEvents(enrolledSubjects);
                };
                li.appendChild(deleteButton);
                enrolledSubjectsList.appendChild(li);
            }
        });
    }

    function updateCalendarEvents(enrolledSubjects) {
        const events = [];
        enrolledSubjects.forEach(subject => {
            if (subject && subject.days) {
                subject.days.forEach(day => {
                    events.push({
                        title: `${subject.name} - Grupo: ${subject.group}`,
                        daysOfWeek: [getDayOfWeek(day)],
                        startTime: subject.startTime,
                        endTime: subject.endTime,
                        startRecur: '2024-01-01',
                        endRecur: '2024-12-31'
                    });
                });
            }
        });
        localStorage.setItem('enrolledEvents', JSON.stringify(events));
        calendar.removeAllEvents();
        calendar.addEventSource(events);
        calendar.render();
    }

    function getDayOfWeek(day) {
        switch(day) {
            case 'lunes': return 1;
            case 'martes': return 2;
            case 'miércoles': return 3;
            case 'jueves': return 4;
            case 'viernes': return 5;
            default: return 0;
        }
    }

    // Inicializar eventos en el calendario
    updateCalendarEvents(enrolledSubjects);

    // Mostrar calificaciones y notificaciones
    renderGrades(currentUser.grades || []);
    renderNotifications(currentUser.notifications || []);

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

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}
