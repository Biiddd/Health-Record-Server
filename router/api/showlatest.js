const express = require('express');
const router = express.Router();
const showlatestHandle = require('../../router_handler/showlatest_handler');

router.get('/api/latest', showlatestHandle.getLatestData);

module.exports = router;