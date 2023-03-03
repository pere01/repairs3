const Jwt = require('jsonwebtoken');

const generateJWT = id => {
    return new Promise((resolve, reject) => {
        const payLoad = {id};

        Jwt.sign(
            payLoad, 
            process.env.SECRET_JWT_SEED,
            {
                expiresIn: process.env.JWT_EXPIRE_IN,
            },
            (err, token) => {
                if(err){
                    console.log(err);
                    reject(err);
                }
                resolve(token)
            }
        );
    });
};

module.exports = generateJWT