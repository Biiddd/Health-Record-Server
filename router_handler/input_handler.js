const db = require('../db/index')
const {body} = require("express/lib/request");
const req = require("express/lib/request");

exports.writeData = (req, res) => {
    const insert_date_hos= `INSERT INTO checks (check_date, check_hospital, insert_time) VALUES (?, ?, NOW())`;
    const insert_data = `INSERT INTO check_items (check_id, item_id, item_value) VALUES (?, ?, ?)`;
    let { date, checkHospital, ca125Value, ca199Value, ceaValue, ca153Value, ca724Value, he4Value } = req.body;
    // console.log("body", req.body);

    db.query(insert_date_hos, [date, checkHospital], (err, result) => {
        if (err) {
            //console.error('写入数据库时出错:', err);
            res.status(500).send('写入数据库时出错');
            return;
        }

        const this_check_id = result.insertId;
        //写入CA125
        if (ca125Value) {
            db.query(insert_data, [this_check_id, 1, ca125Value], (err, result) => {
                if (err) {
                    //console.error('写入数据库时出错:', err);
                    res.status(500).send('写入数据库时出错');
                }
                //console.log('CA125成功写入数据库:', result);
            });
        }

        //写入CA199
        if (ca199Value) {
            db.query(insert_data, [this_check_id, 2, ca199Value], (err, result) => {
                if (err) {
                    console.error('写入数据库时出错:', err);
                    res.status(500).send('写入数据库时出错');
                }
                //console.log('CA199成功写入数据库:', result);
            });
        }

        //写入CEA
        if (ceaValue) {
            db.query(insert_data, [this_check_id, 3, ceaValue], (err, result) => {
                if (err) {
                    console.error('写入数据库时出错:', err);
                    res.status(500).send('写入数据库时出错');
                }
                //console.log('CEA成功写入数据库:', result);
            });
        }

        //写入CA153
        if (ca153Value) {
            db.query(insert_data, [this_check_id, 4, ca153Value], (err, result) => {
                if (err) {
                    console.error('写入数据库时出错:', err);
                    res.status(500).send('写入数据库时出错');
                }
                //console.log('CA153成功写入数据库:', result);
            });
        }

        //写入CA724
        if (ca724Value) {
            db.query(insert_data, [this_check_id, 5, ca724Value], (err, result) => {
                if (err) {
                    console.error('写入数据库时出错:', err);
                    res.status(500).send('写入数据库时出错');
                }
                //console.log('CA724成功写入数据库:', result);
            });
        }

        //写入HE4
        if (he4Value) {
            db.query(insert_data, [this_check_id, 6, he4Value], (err, result) => {
                if (err) {
                    console.error('写入数据库时出错:', err);
                    res.status(500).send('写入数据库时出错');
                }
                //console.log('HE4成功写入数据库:', result);
            });
        }
        res.status(200).send('数据已成功写入数据库');
    });
}
