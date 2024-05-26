const express = require('express')

const departmentController = require('../controllers/departmentController')

const router = express.Router()
// get list 
router.get('/', departmentController.getListDepartment)
// get list for doctor
router.get('/doctor', departmentController.getListDepartmentForDoctor)
// create branch
router.post('/', departmentController.createDepartment)
// update branch
router.put('/', departmentController.updateDepartment)
// delete branch 
router.delete('/:id', departmentController.deleteDepartment)

module.exports = router