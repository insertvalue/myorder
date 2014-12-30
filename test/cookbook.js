/**
 * Created by hongdian on 2014/12/29.
 * 抓取菜单
 */
var eventproxy = require('eventproxy');
var superagent = require('superagent');
var cheerio = require('cheerio');
var fs = require('fs');
var ep = new eventproxy();
var async = require('async');
var urls = [];
var foods = new Array();
for (var i = 1; i <= 10; i++) {
    urls.push('http://i.meishi.cc/recipe_list/?st=new&page=' + i + '#bbtitles');
}

// 命令 ep 重复监听 topicUrls.length 次（在这里也就是 40 次） `topic_html` 事件再行动
ep.after('topic_html', urls.length, function (topics) {
    // topics 是个数组，包含了 40 次 ep.emit('topic_html', pair) 中的那 40 个 pair
    topics.forEach(function (topic) {
        foods = foods.concat(topic[1]);
    });

    console.log(foods);
    console.log(foods.length);

    var localPath = "D:/foods/";
    if (fs.existsSync(localPath)) {
        console.log('已经创建过此目录了');
    } else {
        fs.mkdirSync(localPath);
        console.log('目录已创建成功\n');
    }
    async.mapLimit(foods, 10, function (food, callback) {//控制并发数下载图片
        superagent.get(food.imgHref)
            .end(function (err, img) {
                var path = localPath + food.foodName + '.jpg';
                fs.exists(path, function (exists) {
                    return;
                });
                var writeStream = fs.createWriteStream(path);
                writeStream.write(img.body);
                writeStream.end();
                callback();
                console.log(path + "保存成功");
            });
    }, function (err, result) {
        console.log('final:');
        console.log(result);
    });
});

urls.forEach(function (topicUrl) {
    superagent.get(topicUrl)
        .end(function (err, sres) {
            console.log('fetch ' + topicUrl + ' successful');
            // 常规的错误处理
            if (err) {
                return next(err);
            }
            // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
            // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
            // 剩下就都是 jquery 的内容了
            var $ = cheerio.load(sres.text);
            var items = [];
            $('#cdlist .cplist li').each(function (idx, element) {
                var $element = $(element);
                items.push({
                    imgHref: $element.find("img").attr('src'),
                    foodName: $element.find("h4").text()
                });
            });
            ep.emit('topic_html', [topicUrl, items]);
        });
});