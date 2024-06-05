const e = require('express');
const {sign, verify} = require('jsonwebtoken');
require('dotenv').config();

const createOwnerToken = (ownerID,role='owner') => {
    const accessToken = sign({ownerID,role},process.env.Owner_JWT_SECRET_KEY, {expiresIn: "10h"});
    return accessToken;	
};

const validateOwnerToken = (req, res, next) => {
    const accessToken = req.headers["x-access-token"]
    console.log(accessToken);
    if (!accessToken) {
        console.log("User not authenticated");
        return res.status(402).json({status:402,message: "User not authenticated"});
    }
    try {
        const validToken = verify(accessToken,process.env.Owner_JWT_SECRET_KEY)
        if (validToken && validToken.role === "owner") {
            req.authenticated = true;
            req.ownerID = validToken.ownerID;
            req.role = validToken.role;
            console.log("User authenticated");
            return next();
        }else{
            console.log("User not authenticated");
            return res.status(402).json({status:402,message: "User not authenticated"});
        }
    }catch(err) {
        console.log(err);
        return res.status(402).json({status:402,message: "JWT ERROR",err});
    }   

  };

module.exports = {createOwnerToken, validateOwnerToken};