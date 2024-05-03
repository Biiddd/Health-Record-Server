const express = require('express');
const router = express.Router();
const inputHandle = require('../../router_handler/input_handler');

router.post('/api/input', inputHandle.writeData);

module.exports = router;