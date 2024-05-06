const db = require("../db/index");
const bcrypt = require("bcrypt");
const saltRounds = 10; // 可以根据需要调整盐的轮数

// 要插入的用户数据
const username = "a";
const password = "12345678";
const birthday = "1990-01-01";
const height = 170.0;

// 对密码进行加盐哈希处理
bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error("加盐哈希密码失败：", err);
    return;
  }

  // 使用 `hash` 值和其他数据将用户插入数据库
  const query =
    "INSERT INTO `user` (`user_name`, `password`, `brth`, `height`) VALUES (?, ?, ?, ?)";
  const values = [username, hash, birthday, height];

  // 使用 `db.query` 来执行 SQL 查询插入数据
  db.query(query, values, (err, results) => {
    if (err) {
      console.error("插入用户失败：", err);
      return;
    }
    console.log("用户成功插入，用户ID：", results.insertId);
  });
});
