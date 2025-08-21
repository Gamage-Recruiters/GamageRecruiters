
const { pool } = require('../config/dbConnection');

const sendEmail = require('../config/nodemailerConfig');



async function sendInquiry(req, res) {

    const { phoneNumber, email, name, subject, message } = req.body;

    if (!phoneNumber || !email || !name || !subject || !message) {

        return res.status(400).json({ message: 'All fields required.' });
    }

    try {
        pool.query('INSERT INTO contacttable (phoneNumber,email,name,subject,message) VALUES (?,?,?,?,?)',

            [phoneNumber, email, name, subject, message],


            async (err, results) => {

                if (err) {
                    return res.status(500).json({ message: 'Error adding details', error: err.message });
                }

            }

        )
        
         // sending Email
        await sendEmail(email, "Inquiry Received", name, subject, message, "+94 77 479 5371", "https://gamagerecruiters.lk/");

        return res.status(201).json({ message: 'Data Saved Successfuly and Email Sent !' });

    } catch (error) {
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }



}

async function getInquiry(req, res) {

    const id = req.params.id;   // url like this :  /api/contact/getinquiry/1

    try {

        if (id) {

            const [results] = await pool.promise().query('SELECT * FROM contacttable where id = ?', [id]);

            if (results.length === 0) {
                return res.status(500).json({ message: 'requested inquiry not found or invalid id' });
            }

            return res.status(200).json({ results });

        }
        else {

            const [results] = await pool.promise().query('SELECT * FROM contacttable');

            if (results.length === 0) {
                return res.status(500).json({ message: 'No any inquiries to show' });
            }

            return res.status(200).json({ results });

        }

    } catch (error) {
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }

}

async function deleteInquiry(req, res) {

    const id = req.params.id;
    try {


        if (id) {
            const [results] = await pool.promise().query('SELECT * FROM contacttable where id = ?', [id]);

            if (results.length === 0) {
                return res.status(404).json({ message: 'requested inquiry not found or invalid id to delete' });
            }

            await pool.promise().query('DELETE FROM contacttable where id = ?', [id])

            return res.status(200).json({ message: 'Delete Succesfull' });
        }
        else {
            return res.status(500).json({ message: 'Please provide id to delete', });
        }




    } catch (error) {
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }

}






module.exports = { sendInquiry, getInquiry, deleteInquiry };