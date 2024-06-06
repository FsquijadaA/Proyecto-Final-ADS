document.addEventListener('DOMContentLoaded', () => {
    const loadStudentsButton = document.getElementById('loadStudents');
    const saveGradesButton = document.getElementById('saveGrades');
    const studentList = document.getElementById('studentList');
    const subjectSelect = document.getElementById('subjectSelect');

    // Cargar las materias desde el almacenamiento local
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        subjectSelect.appendChild(option);
    });

    loadStudentsButton.addEventListener('click', loadStudents);
    saveGradesButton.addEventListener('click', saveGrades);

    function loadStudents() {
        // Recuperar los usuarios desde el almacenamiento local
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const students = users.filter(user => user.role === 'student');

        studentList.innerHTML = '';
        students.forEach(student => {
            const li = document.createElement('li');
            li.textContent = student.username;
            const input = document.createElement('input');
            input.type = 'number';
            input.min = 0;
            input.max = 10;
            input.placeholder = 'Nota';
            input.dataset.studentId = student.username; // Usar el nombre de usuario como ID para la demostración
            li.appendChild(input);
            studentList.appendChild(li);
        });
    }

    function saveGrades() {
        const grades = [];
        const inputs = studentList.querySelectorAll('input');
        inputs.forEach(input => {
            const grade = {
                studentId: input.dataset.studentId,
                value: input.value
            };
            grades.push(grade);
        });

        // Guardar las calificaciones en el almacenamiento local o enviar a la API
        localStorage.setItem('grades', JSON.stringify(grades));
        alert('Calificaciones guardadas exitosamente.');
    }
});
