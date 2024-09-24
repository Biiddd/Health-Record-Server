const db = require("../db/index");
const dayjs = require("dayjs");

const getData = (req, res) => {
  // 验证 req.query 是否存在
  if (!req.query) {
    return res.status(200).json({ code: 200400, msg: "请求参数不完整" });
  }

  // 解构 req.query
  const { startDate, endDate, chartType } = req.query;

  // 检查参数是否存在
  if (!startDate || !endDate || !chartType) {
    return res.status(200).json({ code: 200400, msg: "请求参数不完整" });
  }

  let threshold;
  let itemId;
  switch (chartType) {
    case "CA125":
      itemId = 1;
      break;
    case "CA199":
      itemId = 2;
      break;
    case "CEA":
      itemId = 3;
      break;
    case "CA153":
      itemId = 4;
      break;
    case "CA724":
      itemId = 5;
      break;
    case "HE4":
      itemId = 6;
      break;
    default:
      return res.status(200).json({ code: 200401, msg: "无效的图表类型" });
  }

  const thresholdQuery = `
        SELECT item_normal_max
        FROM items
        WHERE item_id = ?
    `;

  // 基于传入的参数查询数据库
  const query = `
        SELECT c.check_date AS date, ci.item_value AS value
        FROM check_items ci
                 JOIN checks c ON ci.check_id = c.check_id
        WHERE ci.item_id = ?
          AND c.check_date BETWEEN ? AND ?
        ORDER BY c.check_date ASC;
    `;

  // 查询阈值
  db.query(thresholdQuery, itemId, (err, thresholdResult) => {
    if (err) {
      console.error("数据库查询失败：", err);
      return res.status(200).json({ code: 200500, msg: "数据库查询失败" });
    }
    threshold = thresholdResult[0].item_normal_max;
  });

  // 执行数据库查询
  db.query(query, [itemId, startDate, endDate], (err, rows) => {
    if (err) {
      console.error("数据库查询失败：", err);
      return res.status(200).json({ code: 200500, msg: "数据库查询失败" });
    }

    // 格式化日期
    rows.forEach((row) => {
      row.date = dayjs(row.date).format("YYYY-MM-DD");
    });

    res
      .status(200)
      .json({
        code: 200,
        msg: "请求成功",
        data: { threshold: threshold, chartData: rows },
      });
  });
};

module.exports = {
  getData,
};
