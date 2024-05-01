const e = require('express');
const {sign, verify} = require('jsonwebtoken');

const createToken = (userID) => {
    const accessToken = sign({userID},"JWT_SECRET_KEY", {expiresIn: "2h"});
    return accessToken;	
};

const validateToken = (req, res, next) => {
    const accessToken = req.headers["x-access-token"]
    if (!accessToken) {
        return res.status(400).json({message: "User not authenticated"});
    }
    try {
        const validToken = verify(accessToken,"JWT_SECRET_KEY")
        if (validToken) {
            req.authenticated = true;
            req.customerID = validToken.userID.customerID;
            return next();
        }else{
            return res.status(400).json({message: "User not authenticated"});
        }
    }catch(err) {
        return res.status(500).json({message: err});
    }   

  };

module.exports = {createToken, validateToken};