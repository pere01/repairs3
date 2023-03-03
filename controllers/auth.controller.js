const User = require("../models/users.model");
const catchAsync = require("../utils/catchAsync");
const bcrypt = require('bcryptjs');
const generateJWT = require("../utils/jwt");
const AppError = require("../utils/AppError");


exports.login = catchAsync(async (req, res, next)=> {
    const {email, password} =  req.body;
    
    const user = await User.findOne({
        where: {
            email: email.toLowerCase(),
            status: 'available',
        }
    });

    if(!user){
        return next(new AppError('The user could not be found', 404))
    }

    if(!(await bcrypt.compare(password, user.password))){
        return next(new AppError('Incorrect email or password', 401))
    }

    const token = await generateJWT(user.id);

    res.status(200).json({
        status: 'success',
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        }
    })
})
