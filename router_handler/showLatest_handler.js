const db = require("../db/index");
const dayjs = require("dayjs");
const getLatestData = (req, res) => {

  // 查询最近肿瘤指标化验日期
  const latestDateQuery = `
        SELECT MAX(check_date) AS latest_date
        FROM checks;
    `;
  // 按最新日期查询
  db.query(latestDateQuery, [], (err, result) => {
    if (err) {
      return res.status(200).json({ code:200500, msg: "数据库查询失败" });
    }

    const latestDate = result[0].latest_date; //赋值最近肿瘤指标化验日期

    // 按最新日期查询最肿瘤指标
    const latest_tumor_value = `
            SELECT
                i.item_id,
                i.item_name,
                COALESCE(ci.item_value, '未检查') AS value,
                c.check_date AS date
            FROM
                items i
            LEFT JOIN
                check_items ci ON i.item_id = ci.item_id
            LEFT JOIN
                checks c ON ci.check_id = c.check_id
            WHERE
                c.check_date = ?
            GROUP BY
                i.item_id, i.item_name, ci.item_value, c.check_date;
        `;

    db.query(latest_tumor_value, [latestDate], (err, rows) => {
      if (err) {
        return res.status(200).json({ code:200500, msg: "数据库查询失败" });
      }

      rows.forEach((row) => {
        row.date = dayjs(row.date).format("YYYY-MM-DD");
      });

      res.status(200).json({code: 200, msg:rows});
    });
  });
};

module.exports = {
  getLatestData,
};
