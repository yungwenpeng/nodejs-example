//importing modules
const jwt = require("jsonwebtoken");
const db = require("../models");
require('dotenv').config();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY } = process.env;

// Assigning users to the variable User
const User = db.users;

//login authentication
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        //find a user by their email
        const user = await User.findOne({ where: { email: email } });
        //if user email is found, compare password
        if (user) {
            const isSame = password == user.password ? true : false;
            if (isSame) {
                const accessToken = jwt.sign(
                    {name: user.username, password: user.password, email: user.email, role: user.role},
                    ACCESS_TOKEN_SECRET,
                    { expiresIn: ACCESS_TOKEN_EXPIRY }
                );
                const refreshToken = jwt.sign(
                    {name: user.username, password: user.password, email: user.email, role: user.role},
                    REFRESH_TOKEN_SECRET,
                    { expiresIn: REFRESH_TOKEN_EXPIRY }
                );
                res.status(201).send({
                    token: accessToken,
                    refreshToken: refreshToken
                });
            }
        } else {
            return res.status(401).send("Authentication failed");
        }
    } catch(error) {
        console.log(error);
    }
}

//signing a user up
//hashing users password before its saved to the database
const signup = async (req, res) => {
    try {
        const { userName, email, password, role } = req.body;
        const data = {
            userName,
            email,
            password,
            role
        };
        //saving the user
        const user = await User.create(data);
        //if user details is captured
        //generate token with the user's id and the secretKey in the env file
        // set cookie with the token generated
        if (user) {
            let token = jwt.sign(
                {name: user.username, password: user.password, email: user.email, role: user.role},
                REFRESH_TOKEN_SECRET,
                { expiresIn: REFRESH_TOKEN_EXPIRY }
            );
            res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
            console.log("user", JSON.stringify(user, null, 2));
            console.log(token);
            //send users details
            return res.status(201).send(user);
        } else {
            return res.status(409).send("Details are not correct");
        }
    } catch(error) {
        console.log(error);
    }
}

const getUser = async (req, res) => {
    var queryType = req.query.query;
    console.log('getUser - query: ', req.query.query);
    if(!queryType){
        console.log("Requested item wasn't found!, ?query=xxxx is required!");
        return res.status(409).send("?query=xxxx is required! NB: xxxx is all / email");
    }
    try {
        if(queryType == 'all'){
            const users = await User.findAll({
                attributes: { exclude: ['updatedAt', 'createdAt'] }
              });
            return res.json(users);
        } else {
            const user = await User.findOne({
                where: {
                    email: queryType//{[Op.like]: queryType+'%'}
                }
            });
            return res.json(user);
        }
    } catch(error) {
        console.log(error);
    }
}

module.exports = {
    login,
    signup,
    getUser,
};