const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { 
    getAllProjects, 
    getProjectById, 
    createProject, 
    updateProject, 
    deleteProject 
} = require('../controllers/projectController');

// Public Routes
router.get('/', getAllProjects);
router.get('/:id', getProjectById);

// Protected Routes (Admin Only)
router.post('/', protect, createProject);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;


