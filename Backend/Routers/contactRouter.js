const express = require('express');
const router = express.Router();

const contactController = require('../Controllers/contactController')



router.route('/addinquiry').post(contactController.sendInquiry);  //by body

router.route('/getinquiry/:id').get(contactController.getInquiry); // by path params

router.route('/deleteinquiry/:id').delete(contactController.deleteInquiry);  // by path params

router.route('/getinquiry').get(contactController.getInquiry); // not send any on req. just get all

// router.route('/deleteinquiry').delete( contactController.deleteInquiry);









module.exports = router;