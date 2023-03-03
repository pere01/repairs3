const Repair = require('./repairs.models');
const User = require('./users.model');

const initModel = () => {
  User.hasMany(Repair);
  Repair.belongsTo(User);
};

module.exports = initModel;
