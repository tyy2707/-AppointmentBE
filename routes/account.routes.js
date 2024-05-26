const express = require("express");

// controller functions
const accountController = require("../controllers/account.controller");

const router = express.Router();
// signup route
router.post("/", accountController.signupAccount);
router.post("/doctor", accountController.signupAccountDoctor);
// //list account user
router.get("/", accountController.getListAccount);
// //list account user
router.get("/:id", accountController.getAccountDetail);
// // login route
router.post("/login", accountController.loginAccount);

//edit info
router.put("/:id", accountController.updateAccountInfo);

router.put("/change-password/:id", accountController.changePassword);
module.exports = router;
