window.projectsData = [];

async function loadProjects() {
    try {
        const response = await fetch('https://architect-portfolio-9jvz.onrender.com/api/projects');

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error('Projects API did not return an array');
        }

        window.projectsData = data;

        console.log('Projects Loaded:', data);

        if (typeof renderProjects === 'function') {
            renderProjects(data);
        } else {
            console.error('renderProjects() function not found');
        }

    } catch (error) {
        console.error('Error loading projects:', error);

        const container = document.getElementById('projects-container');

        if (container) {
            container.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-danger">
                        Failed to load projects. Please try again later.
                    </p>
                </div>
            `;
        }
    }
}

document.addEventListener('DOMContentLoaded', loadProjects);