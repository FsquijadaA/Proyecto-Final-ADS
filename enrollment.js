document.addEventListener('DOMContentLoaded', () => {
    const subjectSelect = document.getElementById('subjectSelect');
    const groupSelect = document.getElementById('groupSelect');
    const enrollSubjectButton = document.getElementById('enrollSubject');
    const enrolledSubjectsList = document.getElementById('enrolledSubjectsList');

    // Cargar las materias y los grupos desde el almacenamiento local
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    const groups = JSON.parse(localStorage.getItem('groups')) || [];

    subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject.name;
        option.textContent = `${subject.name} (${subject.days.join(', ')} ${subject.startTime} - ${subject.endTime})`;
        subjectSelect.appendChild(option);
    });

    groups.forEach(group => {
        const option = document.createElement('option');
        option.value = group.name;
        option.textContent = group.name;
        groupSelect.appendChild(option);
    });

    // Cargar las materias inscritas desde el almacenamiento local
    const enrolledSubjects = JSON.parse(localStorage.getItem('enrolledSubjects')) || [];
    renderEnrolledSubjects(enrolledSubjects);

    enrollSubjectButton.addEventListener('click', () => {
        const selectedSubject = subjectSelect.value;
        const selectedGroup = groupSelect.value;

        if (selectedSubject && selectedGroup) {
            const enrolledSubject = { subject: selectedSubject, group: selectedGroup, username: currentUser.username };
            enrolledSubjects.push(enrolledSubject);
            localStorage.setItem('enrolledSubjects', JSON.stringify(enrolledSubjects));
            renderEnrolledSubjects(enrolledSubjects);
        } else {
            alert('Por favor, seleccione una materia y un grupo.');
        }
    });

    function renderEnrolledSubjects(subjects) {
        enrolledSubjectsList.innerHTML = '';
        subjects.forEach((subject, index) => {
            const li = document.createElement('li');
            li.textContent = `${subject.subject} - ${subject.group}`;
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.onclick = () => {
                subjects.splice(index, 1);
                localStorage.setItem('enrolledSubjects', JSON.stringify(subjects));
                renderEnrolledSubjects(subjects);
            };
            li.appendChild(deleteButton);
            enrolledSubjectsList.appendChild(li);
        });
    }
});
