app.post('/api/input', (req, res) => {
    // 从请求体中获取前端发送的数据
    const checkData = req.body;

    // 将数据写入数据库
    const sql = 'INSERT INTO your_table_name SET ?'; // 替换为您的表格名称
    connection.query(sql, checkData, (err, result) => {
        if (err) {
            console.error('写入数据库时出错:', err);
            res.status(500).send('写入数据库时出错');
            return;
        }
        console.log('成功将数据写入数据库:', result);
        res.status(200).send('数据已成功写入数据库');
    });
});