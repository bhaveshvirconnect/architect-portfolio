const form = document.getElementById('loginForm');

if (form) {

    form.addEventListener('submit', async (e) => {

        e.preventDefault();

        const username =
            document.getElementById('username').value.trim();

        const password =
            document.getElementById('password').value;

        try {

            const response = await fetch(
                'http://localhost:5000/api/admin/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || 'Login failed');
                return;
            }

            localStorage.setItem(
                'adminToken',
                data.token
            );

            window.location.href =
                'dashboard.html';

        } catch (error) {

            console.error('Login Error:', error);

            alert(
                'Unable to connect to server. Please try again.'
            );
        }
    });
}