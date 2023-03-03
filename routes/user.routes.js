const { Router } = require('express');
const { check } = require('express-validator');
const {
  findAllUsers,
  findOneUser,
  updateUser,
  deleteUser,
  createUser,
} = require('../controllers/user.controllers');
const { protect } = require('../middlewares/auth.middleware');
const { validIfExistUser } = require('../middlewares/user.middleware');
const { validateFields } = require('../middlewares/validateFields.middleware');

const router = Router();

router.get('/', findAllUsers);

router.get('/:id', validIfExistUser, findOneUser);

router.patch(
  '/:id',
  [
    check('name', 'The name is mandatory').not().isEmpty(),
    check('email', 'The email is mandatory').not().isEmpty(),
    check('email', 'The email must be a correct format').isEmail(),
    validateFields,
    protect,
  ],
  validIfExistUser,
  updateUser
);

router.post(
  '/',
  [
    check('name', 'The name is mandatory').not().isEmpty(),
    check('email', 'The email is mandatory').not().isEmpty(),
    check('email', 'The email must be a correct format').isEmail(),
    check('password', 'The password is mandatory').not().isEmpty(),
    validateFields,
  ],
  createUser
);

router.delete('/:id', protect, validIfExistUser, deleteUser);

module.exports = {
  userRouter: router,
};
