const db = require("../db/index");
const logger = require("../modules/logger");
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
    logger.error("加盐哈希密码失败：", err);
    return;
  }

  const query =
    "INSERT INTO `user` (`user_name`, `password`, `birth`, `height`) VALUES (?, ?, ?, ?)";
  const values = [username, hash, birthday, height];

  db.query(query, values, (err, results) => {
    if (err) {
      logger.error("插入用户失败：", err);
      return;
    }
    logger.info("用户成功插入");
  });
});
