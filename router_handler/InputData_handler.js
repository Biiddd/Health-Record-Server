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
  } = req.body;

  // 检查是否已经存在相同日期的数据
  const checkQuery = `SELECT *
                        FROM checks
                        WHERE check_date = ?`;

  db.query(checkQuery, [date, checkHospital], (checkErr, checkResult) => {
    if (checkErr) {
      res.status(500).send("查询相同日期的数据时出错");
      return;
    }
    // 如果存在相同日期的数据
    if (checkResult.length > 0) {
      res.status(400).send("相同日期的数据已经存在");
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
          { id: 1, value: ca125Value },
          { id: 2, value: ca199Value },
          { id: 3, value: ceaValue },
          { id: 4, value: ca153Value },
          { id: 5, value: ca724Value },
          { id: 6, value: he4Value },
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
                    logger.info(`插入 ${item.id} 时出错: ${err.message}`);
                    reject(err);
                  } else {
                    logger.info(`插入 ${item.id} 成功`);
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
            res.status(200).send("数据已成功写入数据库");
          })
          .catch((error) => {
            res.status(500).send(error);
          });
      },
    );
  });
};
