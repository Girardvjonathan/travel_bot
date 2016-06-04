/**
 * Created by john on 6/4/16.
 */
var Bot = require('slackbots');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('redirect.db');
var check;


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

function dbRead() {
    db.all("SELECT * from user_redirect", function (err, rows) {
        vacation_users = rows;
        //console.log(vacation_users);
    });
}

var bot = new Bot(settings);
bot.on('start', function () {
    db.run("CREATE TABLE if not exists user_redirect (user TEXT, user_to TEXT)");
    dbRead();
    //addRedirect();
    bot.getChannels().then(function (data) {
        channels = data.channels;
        //console.log(channels);
    });
    bot.getUsers().then(function (data) {
        users = data.members;
        //console.log(users);
    });
});

function addRedirect(user, userTo) {
    db.run("INSERT INTO user_redirect VALUES ('" + user + "','" + userTo + "')");
}

function verifyMention(data) {
    text = data.text;
    if (text.indexOf("@") > -1) {
        //content = text.substring(text.indexOf(' ') + 1, text.length);
        user_to = text.substring(text.indexOf("@") + 1, text.indexOf(">"));
        channel = channels.getByProps({id: data.channel});
        post_user = data.user;
        //if user is in db user_redirect user column then ...
        console.log('user_to' + user_to);
        vacation_user = vacation_users.getByProps({user: user_to});
        console.log("vacation_users" + vacation_user.name);
        if (vacation_user.length > 0) {
            //post @userTo User.name is in vacation maybe @UserTo.name can respond to you
            message = 'Sorry ' + users.getByProps({id: vacation_user[0].user})[0].name + " is on vacation.";

            if (vacation_user[0].user_to != "nobody") {
                message += " Maybe <@"
                    + users.getByProps({id: vacation_user[0].user_to})[0].id + "> can respond to you."
            }
            bot.postMessageToChannel(channel[0].name, message);
        }
    }
}

function isPrivate(channel) {
    return channels.getByProps({id: channel}).length == 0;
}

function apiTravel(data) {
    // First check if its a private channel
    text = data.text;
    var user_to;
    if (isPrivate(data.channel)) {
        var textArr = text.split(" ");
        try {
            if (textArr[1] == 'undefined') {
                user_to = 'nobody'
            } else {
                if (textArr[1].indexOf('@') > -1) {
                    textArr[1] = textArr[1].substring(textArr[1].indexOf('@') + 1, textArr[1].length - 1);
                    user_to = users.getByProps({id: textArr[1]})[0];
                } else {
                    user_to = users.getByProps({name: textArr[1]})[0];
                }
                //console.log("name" + user_to.name);
            }
            bot.postMessageToUser(users.getByProps({id: data.user})[0].name, "You are travelling and <@" + user_to.id + "> is responding for you.");
            //db.run("INSERT INTO user_redirect VALUES (" + data.user + "," + user_to.id + ")");
            addRedirect(data.user, user_to.id);
            dbRead();
        }
        catch
            (err) {
        }
    }
}

bot.on('message', function (data) {
    // all ingoing events https://api.slack.com/rtm
    //console.log(data.type);

    if (data.type == 'message') {
        //console.log(data);

        // Check if a mention has been made if so, if the user is on vacation
        //console.log(data);
        verifyMention(data);
        //channel = channels.getByProps({id: data.channel});
        //bot.postMessageToChannel(channel[0].name, "<@U104MN0H1> message");
        apiTravel(data);
    }
});

