const express = require('express');
const router = express.Router();
const inputHandle = require('../../router_handler/input_handler');

router.post('/api/input', inputHandle);

//录入数据
module.exports = router;