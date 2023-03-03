const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/users.model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.Split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in!, please log in to access', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.SECRET_JWT_SEED
  );

  const user = await User.findOne({
    where: {
      id: decoded.id,
      status: true,
    },
  });

  if (!user) {
    return next(new AppError('User not found', 401));
  }

  next();
});

exports.protectEmployee = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in!, please log in to access', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.SECRET_JWT_SEED
  );

  const repair = await User.findOne({
    where: {
      id: decoded.id,
      status: 'employee',
    },
  });

  if (!repair) {
    return next(new AppError('You must be an employee to enter', 401));
  }

  next();
});
