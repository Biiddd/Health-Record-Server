const db = require("../db/index");

exports.updateData = (req, res) => {
  const ifDataExistQuery = `SELECT check_item_id
                              FROM check_items
                              WHERE check_id = ?
                                AND item_id = ?;`;

  const insertDataQuery = `INSERT INTO check_items (check_id, item_id, item_value)
                             VALUES (?, ?, ?);`;

  const updateDataQuery = `UPDATE check_items
                             SET item_value = ?
                             WHERE check_id = ?
                               AND item_id = ?;`;

  const updateTimeQuery = `UPDATE checks
                             SET update_time = NOW()
                             WHERE check_date = ?;`;

  const {
    date,
    check_id,
    checkHospital,
    ca125,
    ca199,
    cea,
    ca153,
    ca724,
    he4,
  } = req.body;

  const items = [
    { id: 1, value: ca125 },
    { id: 2, value: ca199 },
    { id: 3, value: cea },
    { id: 4, value: ca153 },
    { id: 5, value: ca724 },
    { id: 6, value: he4 },
  ];

  // 使用 Promise.all 来执行所有更新/插入操作
  const updatePromises = items.map((item) => {
    if (item.value !== null && item.value !== undefined) {
      return new Promise((resolve, reject) => {
        // 检查记录是否存在
        db.query(ifDataExistQuery, [check_id, item.id], (err, results) => {
          if (err) {
            return reject(`查询 ${item.id} 数据是否存在时出错: ${err.message}`);
          }
          if (results.length > 0) {
            db.query(
              updateDataQuery,
              [item.value, check_id, item.id],
              (updateErr, updateResult) => {
                if (updateErr) {
                  console.error(
                    `更新 ${item.id} 数据时出错: ${updateErr.message}`,
                  );
                  return reject(
                    `更新 ${item.id} 数据时出错: ${updateErr.message}`,
                  );
                }
                resolve(updateResult);
              },
            );
          } else {
            console.log(`记录 ${item.id} 不存在，执行插入操作`);
            db.query(
              insertDataQuery,
              [check_id, item.id, item.value],
              (insertErr, insertResult) => {
                if (insertErr) {
                  console.error(
                    `插入 ${item.id} 数据时出错: ${insertErr.message}`,
                  );
                  return reject(
                    `插入 ${item.id} 数据时出错: ${insertErr.message}`,
                  );
                }
                resolve(insertResult);
              },
            );
          }
        });
      });
    } else {
      return Promise.resolve();
    }
  });

  // 等待所有更新/插入操作完成
  Promise.all(updatePromises)
    .then(() => {
      db.query(updateTimeQuery, [date], (err, result) => {
        if (err) {
          return res.status(500).send(`更新时间时出错: ${err.message}`);
        }
        res.status(200).send("数据已成功更新并更新时间成功");
      });
    })
    .catch((error) => {
      res.status(500).send(`数据更新时出错: ${error.message}`);
    });
};
