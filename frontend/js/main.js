document.addEventListener('DOMContentLoaded', function () {
    AOS.init({
        once: true,
        duration: 800
    });

    initTheme();
    renderTestimonials();
    renderMasonry();
    initCounters();
    initContactForm();

    // Smooth Scroll
   // Smooth Scroll
document.addEventListener('click', function (e) {

    const anchor = e.target.closest('a');

    if (!anchor) return;

    const href = anchor.getAttribute('href');

    if (!href) return;

    if (!href.startsWith('#')) return;

    if (href === '#') return;

    const target = document.querySelector(href);

    if (!target) return;

    e.preventDefault();

    target.scrollIntoView({
        behavior: 'smooth'
    });

});

    // Filter Buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('active');
            });

            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            let filtered = window.projectsData || [];

            if (filter !== 'all') {
                filtered = filtered.filter(
                    p => p.category === filter
                );
            }

            renderProjects(filtered);
        });
    });
});

function renderProjects(filteredProjects = window.projectsData || []) {
    const container = document.getElementById('projects-container');

    if (!container) return;

    container.innerHTML = '';

    filteredProjects.forEach(project => {
        const cardHTML = `
            <div class="col-lg-4 col-md-6" data-aos="fade-up">
                <div class="card project-card h-100" onclick="showProjectModal(${project.id})">
                    <img
                        src="${project.thumbnail_url}"
                        class="card-img-top"
                        alt="${project.name}"
                        style="height: 260px; object-fit: cover;"
                    >
                    <div class="card-body">
                        <span class="badge bg-warning text-dark">
                            ${project.category}
                        </span>

                        <h5 class="card-title mt-3">
                            ${project.name}
                        </h5>

                        <p class="text-muted">
                            ${project.location} • ${project.year}
                        </p>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML += cardHTML;
    });

    AOS.refresh();
}

function showProjectModal(id) {
    const project = window.projectsData.find(
        p => p.id === id
    );

    if (!project) return;

    document.getElementById('modal-project-name').textContent =
        project.name;

    document.getElementById('modal-info').innerHTML = `
        <h5>Project Details</h5>

        <ul class="list-unstyled">
            <li><strong>Location:</strong> ${project.location || ''}</li>
            <li><strong>Year:</strong> ${project.year || ''}</li>
            <li><strong>Area:</strong> ${project.area || ''}</li>
            <li><strong>Client:</strong> ${project.client || ''}</li>
        </ul>

        <p class="mt-4">
            ${project.description || ''}
        </p>
    `;

    const sliderContainer =
        document.getElementById('slider-images');

    sliderContainer.innerHTML = '';

    (project.images || []).forEach((slide, index) => {
        sliderContainer.innerHTML += `
            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                <img
                    src="${slide}"
                    class="d-block w-100"
                    style="height: 520px; object-fit: cover;"
                    alt="Slide ${index + 1}"
                >
            </div>
        `;
    });

    document.getElementById('download-pdf').href =
        project.project_link || '#';

    const modal = new bootstrap.Modal(
        document.getElementById('projectModal')
    );

    modal.show();
}

// Search
document.addEventListener('input', function (e) {
    if (e.target.id === 'project-search') {
        const term = e.target.value.toLowerCase();

        const filtered = (window.projectsData || []).filter(p =>
            (p.name || '').toLowerCase().includes(term) ||
            (p.location || '').toLowerCase().includes(term) ||
            (p.category || '').toLowerCase().includes(term)
        );

        renderProjects(filtered);
    }
});

function initCounters() {
    const counters = document.querySelectorAll('.counter');

    counters.forEach(counter => {
        const target = parseInt(
            counter.getAttribute('data-target')
        );

        let count = 0;
        const increment = target / 60;

        const updateCount = () => {
            count += increment;

            if (count < target) {
                counter.textContent = Math.ceil(count);

                setTimeout(updateCount, 30);
            } else {
                counter.textContent = target;
            }
        };

        updateCount();
    });
}

function renderTestimonials() {
    const testimonials = [
        {
            name: "Priya Malhotra",
            role: "CEO, Lotus Group",
            text: "Working with Ajay was transformative. His vision brought our headquarters to life.",
            img: "https://picsum.photos/id/64/120"
        },
        {
            name: "Vikram Singh",
            role: "Private Client",
            text: "The villa he designed for us is beyond our dreams. Every detail is perfect.",
            img: "https://picsum.photos/id/91/120"
        }
    ];

    const container =
        document.getElementById('testimonials-container');

    if (!container) return;

    container.innerHTML = testimonials.map((t, i) => `
        <div class="carousel-item ${i === 0 ? 'active' : ''}">
            <div class="d-flex justify-content-center">
                <div class="text-center" style="max-width:600px;">
                    <img
                        src="${t.img}"
                        class="rounded-circle mb-4"
                        width="80"
                        alt=""
                    >

                    <p class="fst-italic fs-5">
                        "${t.text}"
                    </p>

                    <h6>${t.name}</h6>

                    <small class="text-muted">
                        ${t.role}
                    </small>
                </div>
            </div>
        </div>
    `).join('');
}

function renderMasonry() {
    const grid = document.getElementById('masonry-grid');

    if (!grid) return;

    const images = [1015, 133, 201, 237, 312, 64];

    images.forEach(id => {
        const item = document.createElement('div');

        item.className = 'masonry-item';

        item.innerHTML = `
            <img
                src="https://picsum.photos/id/${id}/600/800"
                class="img-fluid"
                alt="Architecture"
            >
        `;

        grid.appendChild(item);
    });
}

function initContactForm() {
    const form = document.getElementById('contact-form');

    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const payload = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            project_type: document.getElementById('project_type').value,
            message: document.getElementById('message').value
        };

        try {
            const response = await fetch(
                'http://localhost:5000/api/contact',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                }
            );

            const data = await response.json();

            alert(data.message);

            form.reset();

        } catch (error) {
            console.error(error);
            alert('Failed to send message');
        }
    });
}