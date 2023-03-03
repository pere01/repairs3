const Repair = require('../models/repairs.models');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.validIfExistRepair = catchAsync(async () => {
  const { id } = req.params;

  const repair = await Repair.findOne({
    where: {
      status: 'pending',
      id,
    },
    include: [
      {
        model: User,
      },
    ],
  });

  if (!repair) {
    return next(new AppError('User not found', 404));
  }
  req.repair = repair;
  next();
});
