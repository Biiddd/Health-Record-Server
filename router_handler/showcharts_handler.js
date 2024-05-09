const db = require("../db/index");

const getData = (req, res) => {
  // 验证 req.query 是否存在
  if (!req.query) {
    return res.status(400).json({ error: "请求参数不完整" });
  }

  // 解构 req.query
  const { startDate, endDate, chartType } = req.query;

  // 检查参数是否存在
  if (!startDate || !endDate || !chartType) {
    return res.status(400).json({ error: "请求参数不完整" });
  }

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
      return res.status(400).json({ error: "无效的图表类型" });
  }

  // 基于传入的参数查询数据库
  const query = `
        SELECT c.check_date AS date, ci.item_value AS value
        FROM check_items ci
                 JOIN checks c ON ci.check_id = c.check_id
        WHERE ci.item_id = ?
          AND c.check_date BETWEEN ? AND ?
        ORDER BY c.check_date ASC ;
    `;

  // 执行数据库查询
  db.query(query, [itemId, startDate, endDate], (err, rows) => {
    if (err) {
      console.error("数据库查询失败：", err);
      return res.status(500).json({ error: "数据库查询失败" });
    }

    // 格式化日期
    rows.forEach((row) => {
      const date = new Date(row.date);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      row.date = `${year}-${month}-${day}`;
    });

    res.json(rows);
  });
};

module.exports = {
  getData,
};
