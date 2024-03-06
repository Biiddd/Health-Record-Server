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
    const insert_data = `INSERT INTO check_items (check_id, item_id, item_value) VALUES (?, ?, ?)`;
    let { date, checkHospital, ca125Value, ca199Value, ceaValue, ca153Value, ca724Value, he4Value } = req.body;

    // console.log("body", req.body);

    db.query(insert_date_hos, [date, checkHospital], (err, result) => {
        if (err) {
            console.error('写入数据库时出错:', err);
            res.status(500).send('写入数据库时出错');
            return;
        }
        console.log('日期和检查医院成功写入数据库:', result);

        //获取刚刚插入的检查id
        const this_check_id = result.insertId;
        // console.log("this_check_id", this_check_id);

        //写入CA125
        if (ca125Value) {
            db.query(insert_data, [this_check_id, 1, ca125Value], (err, result) => {
                if (err) {
                    console.error('写入数据库时出错:', err);
                    res.status(500).send('写入数据库时出错');
                    return;
                }
                console.log('CA125成功写入数据库:', result);
            });
        }

        //写入CA199
        if (ca199Value) {
            db.query(insert_data, [this_check_id, 2, ca199Value], (err, result) => {
                if (err) {
                    console.error('写入数据库时出错:', err);
                    res.status(500).send('写入数据库时出错');
                    return;
                }
                console.log('CA199成功写入数据库:', result);
            });
        }

        //写入CEA
        if (ceaValue) {
            db.query(insert_data, [this_check_id, 3, ceaValue], (err, result) => {
                if (err) {
                    console.error('写入数据库时出错:', err);
                    res.status(500).send('写入数据库时出错');
                    return;
                }
                console.log('CEA成功写入数据库:', result);
            });
        }

        //写入CA153
        if (ca153Value) {
            db.query(insert_data, [this_check_id, 4, ca153Value], (err, result) => {
                if (err) {
                    console.error('写入数据库时出错:', err);
                    res.status(500).send('写入数据库时出错');
                    return;
                }
                console.log('CA153成功写入数据库:', result);
            });
        }

        //写入CA724
        if (ca724Value) {
            db.query(insert_data, [this_check_id, 5, ca724Value], (err, result) => {
                if (err) {
                    console.error('写入数据库时出错:', err);
                    res.status(500).send('写入数据库时出错');
                    return;
                }
                console.log('CA724成功写入数据库:', result);
            });
        }

        //写入HE4
        if (he4Value) {
            db.query(insert_data, [this_check_id, 6, he4Value], (err, result) => {
                if (err) {
                    console.error('写入数据库时出错:', err);
                    res.status(500).send('写入数据库时出错');
                    return;
                }
                console.log('HE4成功写入数据库:', result);
            });
        }

        // 发送响应
        res.status(200).send('数据已成功写入数据库');
    });
}


