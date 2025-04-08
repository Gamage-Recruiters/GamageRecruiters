const express = require('express');
const router = express.Router();
const {
    getAllWorkshops,
    getWorkshopById,
    createWorkshop,
    updateWorkshop,
    deleteWorkshop
} = require('../Controllers/workshopsController');

// Corrected routes
router.get('/', getAllWorkshops); // /api/workshops
router.get('/:id', getWorkshopById); // /api/workshops/:id
router.post('/add', createWorkshop); // /api/workshops/add
router.put('/update/:id', updateWorkshop); // /api/workshops/update/:id
router.delete('/delete/:id', deleteWorkshop); // /api/workshops/delete/:id

module.exports = router;
