const db = require("../db/index");

const getData = (req, res) => {
  const type = req.params.chartType;

  let itemId;
  switch (type) {
    case "ca125":
      itemId = 1;
      break;
    case "ca199":
      itemId = 2;
      break;
    case "cea":
      itemId = 3;
      break;
    case "ca153":
      itemId = 4;
      break;
    case "ca724":
      itemId = 5;
      break;
    case "he4":
      itemId = 6;
      break;
    default:
      return res.status(400).json({ error: "无效的数据类型" });
  }

  const query = `
        SELECT c.check_date AS date, ci.item_value AS value
        FROM check_items ci
        JOIN checks c ON ci.check_id = c.check_id
        WHERE ci.item_id = ?
        ORDER BY c.check_date DESC
        LIMIT 5;
    `;

  db.query(query, [itemId], (err, rows) => {
    if (err) {
      // console.error('数据库查询失败：', err);
      return res.status(500).json({ error: "数据库查询失败" });
    }

    rows.forEach((row) => {
      const date = new Date(row.date);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      row.date = `${year}-${month}-${day}`;
    });

    res.json(rows.reverse());
  });
};

module.exports = {
  getData,
};
