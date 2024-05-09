const db = require("../db/index");
const dayjs = require("dayjs");

exports.getAllData = (req, res) => {
    const query = `
        SELECT
            c.check_date,
            c.check_hospital,
            i.item_name,
            COALESCE(ci.item_value, '') AS item_value
        FROM
            checks c
        LEFT JOIN
            check_items ci ON c.check_id = ci.check_id
        LEFT JOIN
            items i ON ci.item_id = i.item_id
        ORDER BY
            c.check_date DESC;
    `;

    // 执行查询
    db.query(query, [], (err, rows) => {
        if (err) {
            console.error("查询数据库时出错:", err);
            return res.status(500).send("查询数据库时出错");
        }

        // 使用对象存储数据，按日期分组
        const groupedData = {};

        rows.forEach(row => {
            const { check_date, check_hospital, item_name, item_value } = row;
            const formattedDate = dayjs(check_date).format('YYYY-MM-DD');

            // 如果该日期还没有对应的记录，则初始化一个对象
            if (!groupedData[formattedDate]) {
                groupedData[formattedDate] = {
                    date: formattedDate,
                    hospital: check_hospital,
                    ca125: '',
                    ca199: '',
                    cea: '',
                    ca153: '',
                    ca724: '',
                    he4: '',
                };
            }

            // 根据项目名称设置对应的值
            if (item_name === 'CA125') {
                groupedData[formattedDate].ca125 = item_value;
            } else if (item_name === 'CA199') {
                groupedData[formattedDate].ca199 = item_value;
            } else if (item_name === 'CEA') {
                groupedData[formattedDate].cea = item_value;
            } else if (item_name === 'CA153') {
                groupedData[formattedDate].ca153 = item_value;
            } else if (item_name === 'CA724') {
                groupedData[formattedDate].ca724 = item_value;
            } else if (item_name === 'HE4') {
                groupedData[formattedDate].he4 = item_value;
            }
        });

        // 将 groupedData 转换为数组
        const formattedData = Object.values(groupedData);

        res.status(200).json(formattedData);
    });
};
