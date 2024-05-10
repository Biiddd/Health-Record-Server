const express = require("express");
const router = express.Router();
const showLatestHandle = require("../../router_handler/showLatest_handler");

router.get("/api/latest", showLatestHandle.getLatestData);

module.exports = router;
