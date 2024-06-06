document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'teacher') {
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
        events: JSON.parse(localStorage.getItem('calendarEvents')) || []
    });
    calendar.render();

    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    renderSubjectsList(subjects);

    const groups = JSON.parse(localStorage.getItem('groups')) || [];
    renderGroupsList(groups);

    const subjectForm = document.getElementById('subjectForm');
    subjectForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const subjectName = document.getElementById('subjectName').value;
        const days = Array.from(document.getElementById('daysSelect').selectedOptions).map(option => option.value);
        const startTime = document.getElementById('startTime').value;
        const endTime = document.getElementById('endTime').value;
        subjects.push({ name: subjectName, days, startTime, endTime });
        localStorage.setItem('subjects', JSON.stringify(subjects));
        renderSubjectsList(subjects);
        updateCalendarEvents(subjects);
        closeModal();
    });

    const groupForm = document.getElementById('groupForm');
    groupForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const groupName = document.getElementById('groupName').value;
        groups.push({ name: groupName });
        localStorage.setItem('groups', JSON.stringify(groups));
        renderGroupsList(groups);
        closeModal();
    });

    function updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
    }

    function renderSubjectsList(subjects) {
        const subjectsList = document.getElementById('subjectsList');
        subjectsList.innerHTML = '';
        subjects.forEach((subject, index) => {
            if (subject && subject.days) {
                const li = document.createElement('li');
                li.textContent = `${subject.name} (${subject.days.join(', ')}, ${subject.startTime} - ${subject.endTime})`;
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Eliminar';
                deleteButton.onclick = () => {
                    subjects.splice(index, 1);
                    localStorage.setItem('subjects', JSON.stringify(subjects));
                    renderSubjectsList(subjects);
                    updateCalendarEvents(subjects);
                };
                li.appendChild(deleteButton);
                subjectsList.appendChild(li);
            }
        });
    }

    function renderGroupsList(groups) {
        const groupsList = document.getElementById('groupsList');
        groupsList.innerHTML = '';
        groups.forEach((group, index) => {
            if (group) {
                const li = document.createElement('li');
                li.textContent = group.name;
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Eliminar';
                deleteButton.onclick = () => {
                    groups.splice(index, 1);
                    localStorage.setItem('groups', JSON.stringify(groups));
                    renderGroupsList(groups);
                };
                li.appendChild(deleteButton);
                groupsList.appendChild(li);
            }
        });
    }

    window.showAddSubjectForm = function showAddSubjectForm() {
        document.getElementById('subjectModal').style.display = 'block';
        document.getElementById('modalTitle').textContent = 'Agregar Materia';
    }

    window.showAddGroupForm = function showAddGroupForm() {
        document.getElementById('groupModal').style.display = 'block';
        document.getElementById('modalTitleGroup').textContent = 'Agregar Grupo';
    }

    window.showAssignGradeForm = function showAssignGradeForm() {
        document.getElementById('gradeModal').style.display = 'block';
        document.getElementById('modalTitleGrade').textContent = 'Asignar Calificación';
        renderGradeSubjects();
        renderStudentNames();
    }

    window.closeModal = function closeModal() {
        document.getElementById('subjectModal').style.display = 'none';
        document.getElementById('groupModal').style.display = 'none';
        document.getElementById('gradeModal').style.display = 'none';
    }

    function renderGradeSubjects() {
        const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
        const gradeSubjectSelect = document.getElementById('gradeSubjectSelect');
        gradeSubjectSelect.innerHTML = '';  // Clear existing options
        subjects.forEach(subject => {
            if (subject && subject.days) {
                const option = document.createElement('option');
                option.value = subject.name;
                option.textContent = subject.name;
                gradeSubjectSelect.appendChild(option);
            }
        });
    }

    function renderStudentNames() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const studentUsernameSelect = document.getElementById('studentUsernameSelect');
        studentUsernameSelect.innerHTML = '';  // Clear existing options
        users.forEach(user => {
            if (user.role === 'student') {
                const option = document.createElement('option');
                option.value = user.username;
                option.textContent = user.username;
                studentUsernameSelect.appendChild(option);
            }
        });
    }

    function updateCalendarEvents(subjects) {
        const events = [];
        subjects.forEach(subject => {
            if (subject && subject.days) {
                subject.days.forEach(day => {
                    events.push({
                        title: subject.name,
                        daysOfWeek: [getDayOfWeek(day)],
                        startTime: subject.startTime,
                        endTime: subject.endTime,
                        startRecur: '2024-01-01',
                        endRecur: '2024-12-31'
                    });
                });
            }
        });
        localStorage.setItem('calendarEvents', JSON.stringify(events));
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
    updateCalendarEvents(subjects);

    // Agregar funcionalidad para calificar estudiantes
    const gradeForm = document.getElementById('gradeForm');
    gradeForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const studentUsername = document.getElementById('studentUsernameSelect').value;
        const subjectName = document.getElementById('gradeSubjectSelect').value;
        const grade = document.getElementById('grade').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const studentIndex = users.findIndex(user => user.username === studentUsername && user.role === 'student');

        if (studentIndex !== -1) {
            const student = users[studentIndex];
            if (!student.grades) {
                student.grades = [];
            }
            student.grades.push({ subject: subjectName, grade });

            if (!student.notifications) {
                student.notifications = [];
            }
            student.notifications.push(`Has recibido una calificación en ${subjectName}: ${grade}`);
            localStorage.setItem('users', JSON.stringify(users));

            alert(`Calificación asignada a ${studentUsername}`);
            closeModal();
        } else {
            alert('Estudiante no encontrado');
        }
    });
});
