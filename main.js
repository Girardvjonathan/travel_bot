/**
 * Created by john on 6/4/16.
 */
var Bot = require('slackbots');

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