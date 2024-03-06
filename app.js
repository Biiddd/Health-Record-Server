const express = require('express');
const app = express();

// 导入 cors 中间件
const cors = require('cors')
// 将 cors 注册为全局中间件
app.use(cors())

const bodyParser = require('body-parser')
const {router} = require("express/lib/application");
// 使用body-parse中间件 要放在路由之前
app.use(bodyParser.json())
// 配置解析 application/x-www-form-urlencoded 格式的表单数据的中间件
app.use(express.urlencoded({ extended: false }))


const inputRouter = require('./router/api/input')
app.use(inputRouter)


app.listen(3000, () => {
    console.log('Server is running at port 3000');
})