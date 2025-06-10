const { pool } = require('../config/dbConnection');
const path = require('path');
const fs = require('fs');

async function addTestimonials(req, res) {

    console.log(req.body);
    console.log(req.file);

    const { name, company, designation, testimonialsText } = req.body;

    const companyLogoPath = req.file ? req.file.path : null;

    // const imgpath  = companyLogoPath.replace(companyLogoPath,)


    if (!companyLogoPath) {
        return res.status(400).json({ message: 'No file uploaded' });
    }




    if (!name || !company || !designation || !testimonialsText) {
        return res.status(400).json({ message: 'All fields required' });
    }



    try {
        pool.query('INSERT INTO testimonials (name,company,designation,testimonialText,companyLogoPath) VALUES (?,?,?,?,?)',




            [name, company, designation, testimonialsText, companyLogoPath],
            (err, results) => {
                if (err) {
                    return res.status(500).json({ message: 'Error adding details', error: err.message });
                }
                res.status(201).json({ message: 'Data Saved Successfuly !' });
            })
    } catch (error) {
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }

}
async function deleteTestimonials(req, res) {

    const id = req.params.id;

    try {

        if (id) {

            const [results] = await pool.promise().query('SELECT  * FROM testimonials where id=?', [id]);

            if (results.length === 0) {
                return res.status(404).json({ message: 'requested details not found or invalid id to delete' });
            }

            const imgName = path.basename(results[0].companyLogoPath);

            const imgPath = path.join('uploads/testimonials/', imgName)

            try {

                if (fs.existsSync(imgPath)) {

                    fs.unlink(imgPath, (error) => {

                        if (error) {
                            return res.status(500).json({ message: 'Error deleting file from Server', error });
                        }
                    })

                    await pool.promise().query('DELETE FROM testimonials where id = ?', [id]);
                }

                return res.status(200).json({ message: 'Delete Succesfull' });

            } catch (error) {
                console.log(error)

            }







        }
        else {
            return res.status(500).json({ message: 'Please provide id to delete', });
        }
    }
    catch (error) {
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }

}

// this function for add imgSrc in images  
function formatingResponse(req, results) {

    const formattedResponse = results.map(item => {

        const filename = path.basename(item.companyLogoPath);   // get last file name from logopath


        return {

            /// adding imgSrc in here and return data to formatedResponse variable
            ...item,
            imgSrc: `${req.protocol}://${req.get('host')}/uploads/testimonials/${filename}`, // Full URL for the image

        };

    });
    return formattedResponse;


}

async function getTestimonials(req, res) {

    const id = req.params.id;  // by params 
    try {
        //return if  ID provided
        if (id) {



            const [results] = await pool.promise().query('SELECT * FROM testimonials where id = ?', [id]);

            if (results.length === 0) {
                return res.status(500).json({ message: 'requested details not found or invalid id' });
            }


            const newResponse = formatingResponse(req, results);


            return res.status(200).json({ newResponse });
        }






        // return all details without ID

        else {



            const [results] = await pool.promise().query('SELECT * FROM testimonials');

            if (results.length === 0) {
                return res.status(500).json({ message: 'No any details to show' });
            }


            const newResponse = formatingResponse(req, results);


            return res.status(200).json({ newResponse });

        }

    } catch (error) {
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }


}





module.exports = { addTestimonials, deleteTestimonials, getTestimonials };