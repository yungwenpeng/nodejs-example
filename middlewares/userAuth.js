//importing modules
const db = require("../models");
//Assigning db.users to User variable
const User = db.users;

//Function to check if username or email already exist in the database
//this is to avoid having two users with the same username and email
const saveUser = async (req, res, next) => {
    //search the database to see if user exist
    try {
        //checking if email already exist
        const emailcheck = await User.findOne({
            where: {
                email: req.body.email,
            },
        });
        //if email exist in the database respond with a status of 409
        if (emailcheck) {
            return res.status(403).send("Email is duplicate. You don't have permission to perform this operation!");
        }
        const username = await User.findOne({
            where: {
                userName: req.body.userName,
            },
        });
        //if username exist in the database respond with a status of 409
        if (username) {
            return res.status(409).send("username already token");
        }
        next();
    } catch (error) {
        console.log(error);
    }
};

//exporting module
module.exports = {
 saveUser,
};