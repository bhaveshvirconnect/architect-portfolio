const token = localStorage.getItem('adminToken');

if (!token) {
    window.location.href = 'login.html';
}

async function loadMessages() {

    try {

        const response = await fetch(
            'http://localhost:5000/api/contact',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.status === 401) {
            localStorage.removeItem('adminToken');
            window.location.href = 'login.html';
            return;
        }

        if (!response.ok) {
            throw new Error('Failed to load messages');
        }

        const messages = await response.json();

        const table =
            document.getElementById('messagesTable');

        if (!table) return;

        table.innerHTML = '';

        messages.forEach(message => {

            table.innerHTML += `
                <tr>
                    <td>${message.id}</td>
                    <td>${message.name}</td>
                    <td>${message.email}</td>
                    <td>${message.project_type || '-'}</td>
                    <td>${message.message}</td>
                    <td>${new Date(message.created_at).toLocaleString()}</td>
                </tr>
            `;
        });

    } catch (error) {

        console.error('Load Messages Error:', error);

        const table =
            document.getElementById('messagesTable');

        if (table) {
            table.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-danger">
                        Failed to load messages
                    </td>
                </tr>
            `;
        }
    }
}

document.addEventListener(
    'DOMContentLoaded',
    loadMessages
);