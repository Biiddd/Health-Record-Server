const express = require("express");
const router = express.Router();
const updateDataHandle = require("../../router_handler/updateData_handler");

router.post("/api/updateData", updateDataHandle.updateData);

module.exports = router;
