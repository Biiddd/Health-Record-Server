const express = require("express");
const router = express.Router();
const fetchDataHandler = require("../../router_handler/fetchData_handler");

router.get("/api/data", fetchDataHandler.getAllData);

module.exports = router;
