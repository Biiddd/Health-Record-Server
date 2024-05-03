const express = require('express');
const app = express();

const cors = require('cors')
app.use(cors())

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))

const inputRouter = require('./router/api/input')
app.use(inputRouter)

const showChartsRouter = require('./router/api/showcharts')
app.use(showChartsRouter)

const showLatestRouter = require('./router/api/showlatest')
app.use(showLatestRouter)

app.listen(33001, () => {
    console.log('Server is running at port 33001');
})