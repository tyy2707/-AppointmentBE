const express = require("express");

// controller functions
const scheduleController = require("../controllers/schedule.controller");

const router = express.Router();
// signup route
router.post("/", scheduleController.signupSchedule);
// //list account user
router.get("/", scheduleController.getListSchedule);
//edit info
router.put("/", scheduleController.updateSchedule);
//
router.delete("/:id", scheduleController.deleteSchedule);

module.exports = router;
