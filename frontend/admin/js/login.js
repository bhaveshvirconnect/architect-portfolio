const form = document.getElementById('loginForm');

if (form) {

    form.addEventListener('submit', (e) => {

        e.preventDefault();

        const username =
            document.getElementById('username').value.trim();

        const password =
            document.getElementById('password').value;

        if (
            username === 'bhavesh1' &&
            password === 'bhavesh1312'
        ) {

            localStorage.setItem(
                'adminLoggedIn',
                'true'
            );

            window.location.href =
                'dashboard.html';

        } else {

            alert('Invalid credentials');

        }
    });
}