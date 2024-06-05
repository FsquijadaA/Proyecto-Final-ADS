document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('dashboard.html')) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            window.location.href = 'login.html';
        } else {
            document.getElementById('username').textContent = currentUser.username;

            const dashboardProfilePic = document.getElementById('dashboardProfilePic');
            if (currentUser.profilePic) {
                dashboardProfilePic.src = currentUser.profilePic;
            }
            updateClock();
            setInterval(updateClock, 1000);

            const data1 = {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'Dataset 1',
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: [0, 10, 5, 2, 20, 30, 45],
                }]
            };

            const data2 = {
                labels: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
                datasets: [{
                    label: 'Dataset 2',
                    backgroundColor: 'rgb(54, 162, 235)',
                    borderColor: 'rgb(54, 162, 235)',
                    data: [3, 2, 1, 4, 5, 6, 7],
                }]
            };

            const config1 = {
                type: 'line',
                data: data1,
                options: {}
            };

            const config2 = {
                type: 'bar',
                data: data2,
                options: {}
            };

            const chart1 = new Chart(
                document.getElementById('chart1'),
                config1
            );

            const chart2 = new Chart(
                document.getElementById('chart2'),
                config2
            );
        }
    }

    // Función para actualizar el reloj
    function updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        document.getElementById('clock').textContent = `${hours}:${minutes}`;
    }
});
