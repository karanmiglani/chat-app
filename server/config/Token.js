const jwt = require('jsonwebtoken');
const generateToken = (id) => {
    return jwt.sign({id},"karan",{
        expiresIn:"30d"
    })
};

module.exports = generateToken;