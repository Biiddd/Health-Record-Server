const express = require("express");
const router = express.Router();
const SMSHandle = require("../../router_handler/SMSLogin_handler");

router.post("/api/requestSMS", SMSHandle.SMSGenAndSend);
router.post("/api/verifyCode", SMSHandle.SMSVerify)

module.exports = router;
