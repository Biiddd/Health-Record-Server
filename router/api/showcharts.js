const express = require("express");
const router = express.Router();
const chartsHandle = require("../../router_handler/showcharts_handler");

router.get("/api/charts", chartsHandle.getData);

module.exports = router;
