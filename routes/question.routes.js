const express = require("express");

// controller functions
const questionController = require("../controllers/question.controller");
const router = express.Router();
// signup route
router.post("/", questionController.signupQuestion);
// //list account user
router.get("/", questionController.getListQuestion);
//edit info
router.put("/", questionController.updateQuestion);
//
// router.delete("/:id", scheduleController.deleteSchedule);

module.exports = router;
