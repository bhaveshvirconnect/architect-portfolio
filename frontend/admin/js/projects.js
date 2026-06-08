const token = localStorage.getItem('adminToken');

if (!token) {
    window.location.href = 'login.html';
}

// Load Projects
async function loadProjects() {

    try {

        const response = await fetch(
            'http://localhost:5000/api/projects'
        );

        const projects = await response.json();

        const table =
            document.getElementById('projectsTable');

        if (!table) return;

        table.innerHTML = '';

        projects.forEach(project => {

            table.innerHTML += `
                <tr>
                    <td>${project.id}</td>
                    <td>${project.name}</td>
                    <td>${project.category || '-'}</td>
                    <td>${project.location || '-'}</td>
                    <td>
                        <button
                            class="btn btn-warning btn-sm me-2"
                            onclick="openEditModal(${project.id})"
                        >
                            Edit
                        </button>

                        <button
                            class="btn btn-danger btn-sm"
                            onclick="deleteProject(${project.id})"
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {

        console.error(error);
    }
}

// Add Project
const projectForm =
    document.getElementById('projectForm');

if (projectForm) {

    projectForm.addEventListener(
        'submit',
        async (e) => {

            e.preventDefault();

            const payload = {
                name: document.getElementById('name').value,
                category: document.getElementById('category').value,
                location: document.getElementById('location').value,
                year: document.getElementById('year').value,
                area: document.getElementById('area').value,
                client: document.getElementById('client').value,
                description: document.getElementById('description').value,
                thumbnail_url: document.getElementById('thumbnail_url').value,
                project_link: document.getElementById('project_link').value,

                slides: document
                    .getElementById('slides')
                    .value
                    .split('\n')
                    .map(url => url.trim())
                    .filter(url => url !== '')
            };

            try {

                const response = await fetch(
                    'http://localhost:5000/api/projects',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify(payload)
                    }
                );

                const data = await response.json();

                if (response.status === 401) {
                    localStorage.removeItem('adminToken');
                    window.location.href =
                        'login.html';
                    return;
                }

                if (!response.ok) {
                    alert(data.message);
                    return;
                }

                projectForm.reset();

                await loadProjects();

                alert(
                    'Project Added Successfully'
                );

            } catch (error) {

                console.error(error);
            }
        }
    );
}

// Delete Project
async function deleteProject(id) {

    const confirmDelete =
        confirm('Delete this project?');

    if (!confirmDelete) return;

    try {

        const response = await fetch(
            `http://localhost:5000/api/projects/${id}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (response.status === 401) {
            localStorage.removeItem('adminToken');
            window.location.href =
                'login.html';
            return;
        }

        alert(data.message);

        await loadProjects();

    } catch (error) {

        console.error(error);
    }
}

// Open Edit Modal
async function openEditModal(id) {

    try {

        const response = await fetch(
            `http://localhost:5000/api/projects/${id}`
        );

        const project = await response.json();

        document.getElementById('edit_id').value =
            project.id;

        document.getElementById('edit_name').value =
            project.name || '';

        document.getElementById('edit_category').value =
            project.category || '';

        document.getElementById('edit_location').value =
            project.location || '';

        document.getElementById('edit_year').value =
            project.year || '';

        document.getElementById('edit_area').value =
            project.area || '';

        document.getElementById('edit_client').value =
            project.client || '';

        document.getElementById('edit_description').value =
            project.description || '';

        document.getElementById('edit_thumbnail_url').value =
            project.thumbnail_url || '';

        document.getElementById('edit_project_link').value =
            project.project_link || '';

        document.getElementById('edit_slides').value =
            (project.images || []).join('\n');

        const modal = new bootstrap.Modal(
            document.getElementById(
                'editProjectModal'
            )
        );

        modal.show();

    } catch (error) {

        console.error(error);
    }
}

// Update Project
async function updateProject() {

    const id =
        document.getElementById('edit_id').value;

    const payload = {
        name: document.getElementById('edit_name').value,
        category: document.getElementById('edit_category').value,
        location: document.getElementById('edit_location').value,
        year: document.getElementById('edit_year').value,
        area: document.getElementById('edit_area').value,
        client: document.getElementById('edit_client').value,
        description: document.getElementById('edit_description').value,
        thumbnail_url: document.getElementById('edit_thumbnail_url').value,
        project_link: document.getElementById('edit_project_link').value,

        slides: document
            .getElementById('edit_slides')
            .value
            .split('\n')
            .map(url => url.trim())
            .filter(url => url !== '')
    };

    try {

        const response = await fetch(
            `http://localhost:5000/api/projects/${id}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            }
        );

        const data = await response.json();

        if (response.status === 401) {
            localStorage.removeItem('adminToken');
            window.location.href =
                'login.html';
            return;
        }

        if (!response.ok) {
            alert(data.message);
            return;
        }

        alert(
            'Project Updated Successfully'
        );

        const modal =
            bootstrap.Modal.getInstance(
                document.getElementById(
                    'editProjectModal'
                )
            );

        if (modal) {
            modal.hide();
        }

        await loadProjects();

    } catch (error) {

        console.error(error);
    }
}

document.addEventListener(
    'DOMContentLoaded',
    loadProjects
);