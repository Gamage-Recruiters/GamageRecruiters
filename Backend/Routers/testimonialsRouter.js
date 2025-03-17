const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer');

const testimonialController = require('../Controllers/testimonialsController')

// Add router
router.post('/addTestimonials', upload.single('file'), testimonialController.addTestimonials);


// delete Router by path params
router.route('/deleteTestimonials/:id').delete( testimonialController.deleteTestimonials);

// get router by path params
router.route('/getTestimonials/:id').get( testimonialController.getTestimonials);


// get router All data
router.route('/getTestimonials').get( testimonialController.getTestimonials);

module.exports = router;