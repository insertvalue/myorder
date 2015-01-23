/**
 * Created by hongdian on 2015/1/22.
 */
var nodemailer = require('nodemailer');
var config = require('../config.js').config;

/*初始化nodemailer*/
var transport = nodemailer.createTransport("SMTP", {
    //service: config.nodeMailer.service, // 主机
    //secureConnection: true, // 使用 SSL
    host:config.nodeMailer.host,
    port: 25, // SMTP 端口
    auth: {
        user: config.nodeMailer.auth.user,
        pass: config.nodeMailer.auth.pass
    }
});

transport.sendMail({
    from: config.nodeMailer.from,
    to: "503170163@qq.com",
    subject: "nodemailer测试邮件",
    attachments: [
        {   // use URL as an attachment
            filename: 'text.txt',
            content: 'hello world!'
        }
    ],
    html: '<div style="color:#008800;font-weight: 100;font-size: 20px;">这是来自nodemailer的测试邮件</div>',
    alternatives: [
        {
            contentType: 'text/x-web-markdown',
            content: '**Hello world!**'
        }
    ]
}, function (err, resStatus) {
    if (err) {
        console.log(err);
    }
    console.log(resStatus);
});