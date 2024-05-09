const db = require("../db/index");
const bcrypt = require("bcrypt");

const isCorrect = (req, res) => {
  const { username, password } = req.body;

  const query = `
        SELECT password
        FROM user
        WHERE user_name = ?;
    `;

  db.query(query, [username], async (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "数据库查询失败" });
    }

    if (rows.length === 0) {
      // 用户名不存在
      return res.status(401).json({ error: "用户名或密码错误" });
    }

    // 获取数据库中的密码哈希值
    const passwordHash = rows[0].password;

    // 确保 passwordHash 不为空
    if (!passwordHash) {
      // console.error('数据库中的密码哈希为空');
      return res.status(500).json({ error: "密码哈希为空" });
    }

    // 比较输入的密码和数据库中的密码哈希值
    const match = await bcrypt.compare(password, passwordHash);
    if (match) {
      // 密码匹配，返回成功
      return res.json({ success: true });
    } else {
      // 密码不匹配
      return res.status(401).json({ error: "用户名或密码错误" });
    }
  });
};

module.exports = {
  isCorrect,
};
