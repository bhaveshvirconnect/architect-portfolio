const pool = require('../config/db');

exports.getAllProjects = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                p.*,
                COALESCE(
                    ARRAY_AGG(pi.image_url ORDER BY pi.sort_order)
                    FILTER (WHERE pi.image_url IS NOT NULL),
                    '{}'
                ) AS images
            FROM projects p
            LEFT JOIN project_images pi
                ON p.id = pi.project_id
            GROUP BY p.id
            ORDER BY p.year DESC
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};

exports.getProjectById = async (req, res) => {
    try {

        const { id } = req.params;

        const result = await pool.query(`
            SELECT
                p.*,
                COALESCE(
                    ARRAY_AGG(pi.image_url ORDER BY pi.sort_order)
                    FILTER (WHERE pi.image_url IS NOT NULL),
                    '{}'
                ) AS images
            FROM projects p
            LEFT JOIN project_images pi
                ON p.id = pi.project_id
            WHERE p.id = $1
            GROUP BY p.id
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Project not found'
            });
        }

        res.json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};

exports.createProject = async (req, res) => {

    const {
        name,
        category,
        location,
        year,
        area,
        client,
        description,
        thumbnail_url,
        project_link,
        slides = []
    } = req.body;

    try {

        const projectResult = await pool.query(
            `
            INSERT INTO projects
            (
                name,
                category,
                location,
                year,
                area,
                client,
                description,
                thumbnail_url,
                project_link
            )
            VALUES
            ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            RETURNING *
            `,
            [
                name,
                category,
                location,
                year,
                area,
                client,
                description,
                thumbnail_url,
                project_link
            ]
        );

        const project = projectResult.rows[0];

        if (Array.isArray(slides) && slides.length > 0) {

            for (let i = 0; i < slides.length; i++) {

                if (!slides[i]) continue;

                await pool.query(
                    `
                    INSERT INTO project_images
                    (
                        project_id,
                        image_url,
                        sort_order
                    )
                    VALUES
                    ($1,$2,$3)
                    `,
                    [
                        project.id,
                        slides[i],
                        i + 1
                    ]
                );
            }
        }

        res.status(201).json({
            message: 'Project added successfully',
            project
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};

exports.updateProject = async (req, res) => {

    const { id } = req.params;

    const {
        name,
        category,
        location,
        year,
        area,
        client,
        description,
        thumbnail_url,
        project_link,
        slides
    } = req.body;

    try {

        const result = await pool.query(
            `
            UPDATE projects
            SET
                name = COALESCE($1, name),
                category = COALESCE($2, category),
                location = COALESCE($3, location),
                year = COALESCE($4, year),
                area = COALESCE($5, area),
                client = COALESCE($6, client),
                description = COALESCE($7, description),
                thumbnail_url = COALESCE($8, thumbnail_url),
                project_link = COALESCE($9, project_link)
            WHERE id = $10
            RETURNING *
            `,
            [
                name,
                category,
                location,
                year,
                area,
                client,
                description,
                thumbnail_url,
                project_link,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Project not found'
            });
        }

        if (Array.isArray(slides)) {

            await pool.query(
                'DELETE FROM project_images WHERE project_id = $1',
                [id]
            );

            for (let i = 0; i < slides.length; i++) {

                if (!slides[i]) continue;

                await pool.query(
                    `
                    INSERT INTO project_images
                    (
                        project_id,
                        image_url,
                        sort_order
                    )
                    VALUES
                    ($1,$2,$3)
                    `,
                    [
                        id,
                        slides[i],
                        i + 1
                    ]
                );
            }
        }

        res.json({
            message: 'Project updated successfully',
            project: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};

exports.deleteProject = async (req, res) => {
    try {

        const result = await pool.query(
            'DELETE FROM projects WHERE id = $1 RETURNING *',
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Project not found'
            });
        }

        res.json({
            message: 'Project deleted successfully'
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};