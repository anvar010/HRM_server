const express = require ('express')
const router = express.Router();

const userController = require('../controller/userController')


const accessControl = require ("../utils/access-control").accessControl;

const setAccessControl = (access_type) => {
    return (req, res, next) => {
        accessControl(access_type, req, res, next)
    }
};



router.post('/users',setAccessControl('1,2'),userController.createUser);
router.get('/users',setAccessControl('1'),userController.getUserData);
router.get('/users/:id',setAccessControl('1'),userController.getSingleUserData);

module.exports = router;