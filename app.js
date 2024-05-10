const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
// 登录
const loginRouter = require("./router/api/login");
app.use(loginRouter);
// 更录入数据
const inputDataRouter = require("./router/api/inputData");
app.use(inputDataRouter);
// 图表展示
const showChartsRouter = require("./router/api/showCharts");
app.use(showChartsRouter);
// 展示最近一次数据
const showLatestRouter = require("./router/api/showLatest");
app.use(showLatestRouter);
// 获取全部数据到表格
const fetchDataRouter = require("./router/api/fetchData");
app.use(fetchDataRouter);
// 更新数据
const updateDataRouter = require("./router/api/updateData");
app.use(updateDataRouter);

app.listen(33001, () => {
  console.log("Server is running at port 33001");
});
