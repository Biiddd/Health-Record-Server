const express = require("express");
const router = express.Router();
const loginHandle = require("../../router_handler/login_handler");

router.post("/api/login", loginHandle.isCorrect);

module.exports = router;
