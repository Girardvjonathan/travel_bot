/**
 * Created by john on 6/4/16.
 */
var Bot = require('slackbots');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('redirect.db');
var check;


// create a bot
var settings = {
    token: 'xoxb-48208002487-TnZqostisHVuCgFoWyDP3nvS',
    name: 'travel_bot'
};
var channels;
var users;
var vacation_users;
//Exemple console.log( channels.getChannelById({id:'C1E6AUVK3'}));
Array.prototype.getByProps = function (obj) {
    return this.filter(function (item) {
        for (var prop in obj)
            if (!(prop in item) || obj[prop] !== item[prop])
                return false;
        return prop;
    });
};

var bot = new Bot(settings);
bot.on('start', function () {
    db.run("CREATE TABLE if not exists user_redirect (user TEXT, user_to TEXT)");
    db.all("SELECT * from user_redirect", function (err, rows) {
        //console.log(rows);
        vacation_users = rows
    });
    //addRedirect();
    bot.getChannels().then(function (data) {
        channels = data.channels;
        console.log(channels);
    });
    bot.getUsers().then(function (data) {
        users = data.members;
        //console.log(users);
    });


    //console.log(channels);
});

function addRedirect(user, userTo) {
    db.run("INSERT INTO user_redirect VALUES (" + user + "," + userTo + ")");
    //stmt.finalize();
}

function verifyMention(data) {
    text = data.text;
    if (text.indexOf("@") > -1) {
        content = text.substr(text.indexOf(' ') + 1, text.length);
        user_to = text.substr(text.indexOf("@") + 1, text.indexOf(">") - 2);
        channel = channels.getByProps({id: data.channel});
        post_user = data.user;
        //if user is in db user_redirect user column then ...
        vacation_user = vacation_users.getByProps({user: user_to});
        if (vacation_user.length > 0) {
            //console.log();
            //post @userTo User.name is in vacation maybe @UserTo.name can respond to you
            //params = {
            //    link_name: vacation_user[0].user_to,
            //    as_user: true
            //};
            bot.postMessageToChannel(channel[0].name, 'Sorry ' + users.getByProps({id: vacation_user[0].user})[0].name + " is on vacation. Maybe @"
                + users.getByProps({id: vacation_user[0].user_to})[0].name + ": can respond to you");
        }
    }
}

function apiTravel(data) {
    // First check if its a private channel
    channel = channels.getByProps({id: data.channel});
    if (channel.length > 0) {
        var textArr = text.split(" ");
        console.log(textArr);

        if (textArr[1] == 'travel') {
            console.log('HEY');
            console.log('user' + textArr[2]);
            console.log('user_to' + textArr[3]);
        }
    }
}

bot.on('message', function (data) {
    // all ingoing events https://api.slack.com/rtm
    //console.log(data.type);
    if (data.type == 'message') {
        console.log(data);
        // Check if a mention has been made if so, if the user is on vacation
        verifyMention(data);
        apiTravel(data);

    }

});

