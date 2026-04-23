const express = require("express");
const passport = require("../config/passport");
const authController = require("../controllers/authController");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/send-otp", authController.sendOtp);
router.post("/forgot-password", authController.forgotPasswordSendOtp);
router.post("/verify-otp", authController.verifyOtp);
router.post("/reset-password", authController.resetPassword);
router.post("/change-password", verifyToken, authController.changePassword);
router.delete("/delete-account", verifyToken, authController.deleteAccount);

router.get(
    "/google",
    authController.googleAuthStart,
    passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false,
    })
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: "/auth/google/failure",
    }),
    authController.googleAuthSuccess
);

router.get("/google/failure", authController.googleAuthFailure);

module.exports = router;
