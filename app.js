var config = require('./config').config;
var express = require('express');
var session = require('express-session');
var path = require('path');
require('./models');
var webRouter = require('./web_router');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var MongoStore = require('connect-mongo')(session);

var app = express();

var urlinfo = require('url').parse(config.host);
config.hostname = urlinfo.hostname || config.host;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
    secret: config.session_secret,
    store: new MongoStore({
        url: config.db
    }),
    resave: true,
    saveUninitialized: true
}));

//在express4中，需要使用res.locals.session=req.session将两者串联。ejs中才能通过locals变量取得session
app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));//设置静态资源路径
app.use(function (req, res, next) {
    var path = __dirname + '/public/upload';
    req.upload_path = path;
    if (fs.existsSync(path)) {
    } else {
        fs.mkdirSync(path);
        console.log('更新目录已创建成功\n');
    }
    next();
});
app.use('/', webRouter);

// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//    var err = new Error('Not Found');
//    err.status = 404;
//    next(err);
//});

// error handlers

// development error handler
// will print stacktrace
//if (app.get('env') === 'development') {
//    app.use(function(err, req, res, next) {
//        res.status(err.status || 500);
//        res.render('error', {
//            message: err.message,
//            error: err
//        });
//    });
//}

// production error handler
// no stacktraces leaked to user
//app.use(function (err, req, res, next) {
//    return res.status(500).send('500 status');
//});

app.listen(config.port, function () {
    console.log("NodeClub listening on port %d in %s mode", config.port, app.settings.env);
    console.log("God bless love....");
    console.log("You can debug your app with http://" + config.hostname + ':' + config.port);
});

module.exports = app;
