/**
 * Created by john on 6/4/16.
 * Collaborators : kimsl
 */
var getphoto = require('./getphoto.js');
var Bot = require('slackbots');

// create a bot
var settings = {
    token: 'xoxb-48208002487-TnZqostisHVuCgFoWyDP3nvS',
    name: 'travel_bot'
};
var bot = new Bot(settings);

var vacayEndDate = 2018;
var destination = "new zealand";
var vacayMessage = 'Someone is on vacation until ' + vacayEndDate + '.';
var messageParams = {};
if(destination) {
    getphoto.search(destination, function(result) {
        if(result) {
            messageParams.attachments = [
                {
                    "color": "#1CC6FF",
                    "title": result.pageUrl,
                    "title_link": result.pageUrl,
                    "image_url": result.imageUrl
                }
            ];
        }
        destination = destination.toLowerCase().replace(/\b[a-z]/g, function(letter) {
            return letter.toUpperCase();
        });
        vacayMessage = 'Someone is on vacation until ' + vacayEndDate + ' in ' + destination + '.';
        bot.postMessageToChannel('random', vacayMessage, messageParams);
    });
}
else {
    bot.postMessageToChannel('random', vacayMessage, messageParams);
}

bot.on('start', function() {
    //bot.postMessageToGroup('some-private-group', 'hello group chat!');
});
