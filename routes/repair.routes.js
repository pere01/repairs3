const { Router } = require('express');
const { check } = require('express-validator');
const {
  findAllRepairs,
  findOneRepair,
  createRepair,
  updateRepair,
  deleteRepair,
} = require('../controllers/repair.controller');
const { protectEmployee } = require('../middlewares/auth.middleware');
const { validIfExistRepair } = require('../middlewares/repair.middleware');
const { validateFields } = require('../middlewares/validateFields.middleware');

const router = Router();

router.get('/', protectEmployee, findAllRepairs);

router.get('/:id', protectEmployee, validIfExistRepair, findOneRepair);

router.post(
  '/',
  [
    check('date', 'The date is mandatory').not().isEmpty(),
    check('motorsNumber', 'The motorsNumber is mandatary').isNumeric(),
    check('description', 'The date is mandatory').not().isEmpty(),
    validateFields,
  ],
  createRepair
);

router.patch('/:id', protectEmployee, validIfExistRepair, updateRepair);

router.delete('/:id', protectEmployee, validIfExistRepair, deleteRepair);

module.exports = {
  repairRouter: router,
};
