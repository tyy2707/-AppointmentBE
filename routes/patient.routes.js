const express = require("express");

// controller functions
const patientController = require("../controllers/patient.controller");

const router = express.Router();
// delete  patient
// router.delete("/:id", patientController.deletePatient);
// signup patient
router.post("/", patientController.signupPatient);
// //list  patient user
router.get("/", patientController.getListPatient);

//patient detail
router.get("/:id", patientController.getPatientDetail);

//edit patient
router.put("/", patientController.updatePatientInfo);

// update photo 
// router.put("/photo/:id", accountController.updateAccountPhotoList);





module.exports = router;
