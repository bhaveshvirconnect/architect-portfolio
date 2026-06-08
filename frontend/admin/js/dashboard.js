const token = localStorage.getItem('adminToken');

if (!token) {
    window.location.href = 'login.html';
}

async function loadDashboard() {

    try {

        const projectRes = await fetch(
            'http://localhost:5000/api/projects',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!projectRes.ok) {
            throw new Error('Failed to load projects');
        }

        const projects = await projectRes.json();

        const totalProjects =
            document.getElementById('totalProjects');

        if (totalProjects) {
            totalProjects.textContent = projects.length;
        }

        const messageRes = await fetch(
            'http://localhost:5000/api/contact',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (messageRes.status === 401) {
            localStorage.removeItem('adminToken');
            window.location.href = 'login.html';
            return;
        }

        if (!messageRes.ok) {
            throw new Error('Failed to load messages');
        }

        const messages = await messageRes.json();

        const totalMessages =
            document.getElementById('totalMessages');

        if (totalMessages) {
            totalMessages.textContent = messages.length;
        }

    } catch (error) {

        console.error('Dashboard Error:', error);

        const totalProjects =
            document.getElementById('totalProjects');

        const totalMessages =
            document.getElementById('totalMessages');

        if (totalProjects) {
            totalProjects.textContent = '0';
        }

        if (totalMessages) {
            totalMessages.textContent = '0';
        }
    }
}

function logout() {
    localStorage.removeItem('adminToken');
    window.location.href = 'login.html';
}

document.addEventListener(
    'DOMContentLoaded',
    loadDashboard
);