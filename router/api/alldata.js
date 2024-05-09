const express = require("express");
const router = express.Router();
const allDataHandle = require("../../router_handler/alldata_handler");

router.post("/api/data", allDataHandle.getAllData);

module.exports = router;
