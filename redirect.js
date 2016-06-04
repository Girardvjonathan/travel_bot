/**
 * Created by john on 6/4/16.
 */
var Bot = require('slackbots');

// create a bot
var settings = {
    token: 'xoxb-48208002487-TnZqostisHVuCgFoWyDP3nvS',
    name: 'travel_bot'
};
var channels;
var users;

//Exemple console.log( channels.getChannelById({id:'C1E6AUVK3'}));
Array.prototype.getById = function(obj) {
    return this.filter(function(item) {
        for (var prop in obj)
            if (!(prop in item) || obj[prop] !== item[prop])
                return false;
        return prop;
    });
};

var bot = new Bot(settings);
bot.on('start', function () {
    bot.getChannels().then(function (data) {
        channels = data.channels;
    });
    bot.getUsers().then(function (data) {
        users = data.users;
    });


    //console.log(channels);
});

bot.on('message', function (data) {
    // all ingoing events https://api.slack.com/rtm
    //console.log(data.type);
    if (data.type == 'message') {
        //console.log("that a message");
        text = data.text;
        if (text.indexOf("@") > -1) {
            console.log(data);
            content = text.substr(text.indexOf(' ') + 1, text.length);
            user = text.substr(text.indexOf("@") + 1, text.indexOf(">") - 2);
            //console.log(content);
            //console.log(user);
            //console.log('here');
            //console.log(data.channel);
            channel = channels.getById({id: data.channel});
            //console.log(channel);
            //console.log(channel[0].name);
            // Get user who posted name
            post_user = data.user;
            console.log(user == 'U1E6402EB');
            if (user == 'U1E6402EB') {
                console.log('postingggggg'+ channel[0].name);
                bot.postMessageToChannel(channel[0].name, 'You said to me : ' + content);
            }
        }
    }

});