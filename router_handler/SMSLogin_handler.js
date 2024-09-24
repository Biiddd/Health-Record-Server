const logger = require("../modules/logger");

// 引入阿里云短信服务SDK
const Dysmsapi20170525 = require("@alicloud/dysmsapi20170525");
// 引入阿里云OpenAPI客户端基础库
const OpenApi = require("@alicloud/openapi-client");
// 引入阿里云SDK工具库，用于处理请求的签名等
const Util = require("@alicloud/tea-util");

// 配置阿里云短信服务所需的密钥和区域信息
const accessKeyId = "replace";
const accessKeySecret = "replace";
const regionId = "replace"; // 设置区域ID
// 定义短信签名，展示在短信前面，用以标识发送方
const signName = "replace"; //
// 定义使用的短信模板ID
const templateCode = "replace";

// 定义一个SMSClient类来封装发送短信的逻辑
class SMSClient {
  // 发送验证码的异步方法
  static async sendCode(phoneNumber, randomCode) {
    // 初始化OpenAPI配置，包括访问密钥
    const config = new OpenApi.Config({
      accessKeyId,
      accessKeySecret,
    });
    // 设置API服务端点
    config.endpoint = "dysmsapi.aliyuncs.com";

    // 创建Dysmsapi20170525客户端实例
    const client = new Dysmsapi20170525.default(config);
    // 打印调试信息
    // console.log(phoneNumber, signName, templateCode, randomCode);

    // 构建发送短信的请求对象
    const request = new Dysmsapi20170525.SendSmsRequest({
      RegionId: regionId, // 指定地区
      phoneNumbers: phoneNumber, // 目标手机号
      signName: signName, // 使用的短信签名
      templateCode: templateCode, // 使用的短信模板ID
      templateParam: `{\"code\":\"${randomCode}\"}`, // 模板参数，动态插入验证码
    });

    try {
      // 设置运行时选项，发送短信请求
      const runtime = new Util.RuntimeOptions({});
      const resp = await client.sendSmsWithOptions(request, runtime);
      console.log("短信发送成功", resp);
      // 返回成功的响应
      return {
        success: true,
        message: "短信发送成功",
      };
    } catch (error) {
      // 记录错误并返回发送失败的响应
      logger.error("短信发送失败", error);
      return {
        success: false,
        message: "短信发送失败",
      };
    }
  }
}

//定义一个方法来暂存验证码用于注册验证，验证码有效期为5分钟
const cache = {};

// 暂存验证码的方法
function storeVerificationCode(
  phoneNumber,
  verificationCode,
  expirationTime = 5 * 60 * 1000,
) {
  // 默认有效期5分钟
  //调试打印手机号及验证码
  // console.log("phoneNumber:", phoneNumber);
  // console.log("verificationCode:", verificationCode);
  // 生成验证码过期时间戳
  const expiresAt = Date.now() + expirationTime;
  // 将验证码及其过期时间存入内存对象
  cache[phoneNumber] = {
    code: verificationCode,
    expiresAt,
  };
  // 设置定时器自动删除过期验证码
  setTimeout(() => {
    delete cache[phoneNumber];
  }, expirationTime);
}

//校验验证码的方法
function checkVerificationCode(phoneNumber, userProvidedCode) {
  const record = cache[phoneNumber];
  if (
    record &&
    record.code === userProvidedCode &&
    record.expiresAt > Date.now()
  ) {
    // 验证码正确且未过期，删除已验证的验证码
    delete cache[phoneNumber];
    return true;
  }
  return false; // 验证码错误或已过期
}

const SMSGenAndSend = (req, res) => {
  // 从请求体中获取手机号
  const  phoneNumber  = req.body.phoneNumber;
  // 生成一个六位数的随机验证码
  const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
  // console.log('phoneNumber:', phoneNumber);// 打印调试信息
  // console.log('randomCode:', randomCode);// 打印调试信息
  try {
    // 调用SMSClient发送验证码
    const response = SMSClient.sendCode(phoneNumber, randomCode);
    storeVerificationCode(phoneNumber, randomCode);
    // 将响应结果返回给前端
    res.status(200).json({code: 200206, msg:"验证码发送成功"});
  } catch (error) {
    // 如果有异常，返回500和错误信息
    res.status(200).json({
      code: 200501,
      msg: "服务器错误",
    });
  }
};

const SMSVerify = (req, res) => {
  const phoneNumber = req.body.phoneNumber; //从请求体中获取手机号
  const userProvidedCode = req.body.verificationCode; //从请求体中获取验证码
  // console.log("phoneNumber:", phoneNumber); // 打印调试信息
  // console.log("userProvidedCode:", userProvidedCode); // 打印调试信息
  if (checkVerificationCode(phoneNumber, userProvidedCode)) {
    res.status(200).json({
      code: 200208,
      msg: "验证码正确",
    });
  } else {
    res.status(200).json({
      code: 200601,
      msg: "请输入正确的手机号或验证码!",
    });
  }
};

module.exports = {
  SMSGenAndSend,
  SMSVerify,
};
