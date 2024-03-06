/**
 * 在这里定义和登录注册相关的路由处理函数
 * 供/router/admin.js模块进行调用
 */
const db = require('../db/index')
const {body} = require("express/lib/request");
const req = require("express/lib/request");

//写数据

exports.writeData = (req, res) => {
// 构建 SQL 插入语句
    const insert_date_hos= `INSERT INTO checks (check_date, check_hospital, insert_time) VALUES (?, ?, NOW())`;
    const insert_CA125 = `INSERT INTO check_items () VALUES (?, ?, ?)`;
    let { date, checkHospital, ca125Value, ca199, cea, ca153, ca724, he4 } = req.body;
    console.log("body", req.body);

    db.query(insert_date_hos, [date, checkHospital], (err, result) => {
        if (err) {
            console.error('写入数据库时出错:', err);
            res.status(500).send('写入数据库时出错');
            return;
        }
        console.log('日期和检查医院成功写入数据库:', result);
        res.status(200).send('日期和检查医院已成功写入数据库');
    });
// // 执行 SQL 查询
//     db.query(sql, [date, selectedHospital, ca125Value], (err, result) => {
//         if (err) {
//             console.error('写入数据库时出错:', err);
//             res.status(500).send('写入数据库时出错');
//             return;
//         }
//         console.log('成功将数据写入数据库:', result);
//         res.status(200).send('数据已成功写入数据库');
//     });
}


