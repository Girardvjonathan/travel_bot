/**
 * Created by john on 6/4/16.
 * Collaborators : kimsl
 */
var express = require('express');
var bodyParser = require('body-parser');
var getphoto = require('./getphoto.js');
var Bot = require('slackbots');

var app = express();
var port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', function (req, res) { res.status(200).send('Hello world!') });

getphoto.search("iceland", function(result) {
    console.log(result);
});

// error handler
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(400).send(err.message);
});

app.listen(port, function () {
    console.log('Slack bot listening on port ' + port);
});

// create a bot
var settings = {
    token: 'xoxb-48208002487-TnZqostisHVuCgFoWyDP3nvS',
    name: 'travel_bot'
};
var bot = new Bot(settings);

bot.on('start', function() {
    bot.postMessageToChannel('general', 'Hello channel!');
    bot.postMessageToUser('kimsly', 'hello bro!');
    bot.postMessageToUser('girardvjonathan', 'hello bro!');
    //bot.postMessageToGroup('some-private-group', 'hello group chat!');
});
