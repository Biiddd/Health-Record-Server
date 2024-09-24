const db = require("../db/index");
const logger = require("../modules/logger");

exports.writeData = (req, res) => {
  const insertDateHosQuery = `INSERT INTO checks (check_date, check_hospital, insert_time)
                                VALUES (?, ?, NOW())`;
  const insertDataQuery = `INSERT INTO check_items (check_id, item_id, item_value)
                             VALUES (?, ?, ?)`;

  let {
    date,
    checkHospital,
    ca125Value,
    ca199Value,
    ceaValue,
    ca153Value,
    ca724Value,
    he4Value,
    rbcValue,
    hbValue,
    wbcValue,
    pltValue,
    neutValue,
    weightValue,
  } = req.body;

  // 检查是否已经存在相同日期的数据
  const checkQuery = `SELECT *
                        FROM checks
                        WHERE check_date = ?`;

  db.query(checkQuery, [date, checkHospital], (checkErr, checkResult) => {
    if (checkErr) {
      logger.error("查询是否有相同日期的数据时出错");
      res.status(200).json({ code: 200501, msg: "查询相同日期的数据时出错" });
      return;
    }
    // 如果存在相同日期的数据
    if (checkResult.length > 0) {
      logger.info("无法插入，存在相同日期的数据");
      res.status(200).json({ code: 200502, msg: "相同日期的数据已经存在" });
      return;
    }

    // 如果没有相同日期的数据，继续执行插入操作
    db.query(
      insertDateHosQuery,
      [date, checkHospital],
      (insertErr, insertResult) => {
        if (insertErr) {
          res.status(500).send("医院写入数据库时出错");
          return;
        }

        const thisCheckId = insertResult.insertId;

        // 将所有数据插入到 check_items
        const items = [
          { id: 1, name: "CA125", value: ca125Value },
          { id: 2, name: "CA199", value: ca199Value },
          { id: 3, name: "CEA", value: ceaValue },
          { id: 4, name: "CA153", value: ca153Value },
          { id: 5, name: "CA724", value: ca724Value },
          { id: 6, name: "HE4", value: he4Value },
          { id: 7, name: "红细胞计数", value: rbcValue },
          { id: 8, name: "血红蛋白", value: hbValue },
          { id: 9, name: "白细胞计数", value: wbcValue },
          { id: 10, name: "血小板计数", value: pltValue },
          { id: 11, name: "中性粒细胞计数", value: neutValue },
          { id: 12, name: "体重", value: weightValue },
        ];

        // 使用 Promise.all 执行所有插入操作
        const insertPromises = items.map((item) => {
          if (item.value) {
            return new Promise((resolve, reject) => {
              db.query(
                insertDataQuery,
                [thisCheckId, item.id, item.value],
                (err, result) => {
                  if (err) {
                    logger.error(`插入 ${item.name} 时出错: ${err.message}`);
                    reject(err);
                  } else {
                    logger.info(`插入 ${item.name} 成功`);
                    resolve(result);
                  }
                },
              );
            });
          } else {
            return Promise.resolve();
          }
        });

        // 等待所有插入操作完成
        Promise.all(insertPromises)
          .then(() => {
            logger.info("全部数据已成功写入数据库");
            res.status(200).json({ code: 200205, msg: "数据已成功写入数据库" });
          })
          .catch((error) => {
            res.status(500).send(error);
          });
      },
    );
  });
};
