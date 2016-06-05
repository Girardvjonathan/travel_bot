/**
 * Created by john on 6/4/16.
 */
var Bot = require('slackbots');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('redirect.db');
var check;
var channels;
var users;
var user_in_vacation;

var settings = {
    token: 'xoxb-48208002487-TnZqostisHVuCgFoWyDP3nvS',
    name: 'syov'
};


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
        user_in_vacation = rows;
        //console.log(user_in_vacation);
    });
}

var bot = new Bot(settings);
bot.on('start', function () {
    db.run("CREATE TABLE if not exists user_redirect (user TEXT PRIMARY KEY ASC, user_to TEXT)");
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
    db.run("INSERT OR REPLACE INTO user_redirect(user, user_to) " +
        "VALUES ('" + user + "', '" + userTo + "')");
}

function removeRedirect(user) {
    db.run("DELETE FROM user_redirect WHERE user='" + user + "'")
}

function verifyMention(data) {
    text = data.text;
    if (text.indexOf("@") > -1) {
        //content = text.substring(text.indexOf(' ') + 1, text.length);
        user_to = text.substring(text.indexOf("@") + 1, text.indexOf(">"));
        channel = channels.getByProps({id: data.channel});
        post_user = data.user;
        //if user is in db user_redirect user column then ...
        //console.log('user_to' + user_to);
        vacation_user = user_in_vacation.getByProps({user: user_to});
        //console.log("user_in_vacation" + vacation_user[0].name);
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
    var confirmationMessage;
        var textArr = text.split(" ");
        try {
            if(textArr[1])
            {
                if (textArr[1] == 'over') {
                    removeRedirect(data.user);
                    confirmationMessage = "You are no longer on vacation. Welcome back!";
                }
                else if (textArr[1].indexOf('@') > -1) {
                    textArr[1] = textArr[1].substring(textArr[1].indexOf('@') + 1, textArr[1].length - 1);
                    user_to = users.getByProps({id: textArr[1]})[0].id;
                    confirmationMessage = "You are on vacation and <@" + user_to.id +
                        "> is responding for you. Have fun!";
                    addRedirect(data.user, user_to);
                }
            }
            else {
                user_to = null;
                confirmationMessage = "You are on vacation. Have fun!";
                addRedirect(data.user, user_to);
            }
            bot.postMessageToUser(users.getByProps({id: data.user})[0].name, confirmationMessage);
            dbRead();
        }
        catch
            (err) {
        }
}

function getEmployeeOnVacation(data) {
    var message = "No user on vacation ";
    var channel = channels.getByProps({id: data.channel})[0];
    console.log(user_in_vacation);
    if (user_in_vacation.length > 0) {
        message = "Theses users are on vacation: ";
        user_in_vacation.forEach(function (entry) {
            if (entry != 'undefined') {
                user = users.getByProps({id: entry.user})[0].name;
                message += " " + user + ",";
            }
        });
    }
    //    TODO si date marquer until date
    bot.postMessageToChannel(channel.name, message.substring(0, message.length - 1));

}

function helpInfo(data) {
    message = "*Help and documentation* \nTo go in *vacation* mode write :\n>vacation \n>[optional @NameOfAnswerer " +
        "in your absence you can set someone to be notify when somebody mention you]\nExemple: \n>vacation @JohnSnow" +
        "\nTo *quit vacation* mode write : \n>vacation over" +
        "\n To see who is on vacation: \n>who is on vacation \n>?vacation";
    bot.postMessageToUser(users.getByProps({id: data.user})[0].name, message);
}

bot.on('message', function (data) {
    // all ingoing events https://api.slack.com/rtm
    //console.log(data.type);

    if (data.type == 'message') {
        //console.log(data);

        // Check if a mention has been made if so, if the user is on vacation
        //console.log(data);
        verifyMention(data);
        var textArr = data.text.split(" ");
        if (textArr[0].toLowerCase() === 'help' ||
            (textArr[0].toLowerCase() === 'vacation' && textArr[1].toLowerCase() === 'help')) {
            if (isPrivate(data.channel)) {
                helpInfo(data);
            }
        }
        if (textArr[0].toLowerCase() === 'vacation') {
            if (isPrivate(data.channel)) {
                apiTravel(data);
            }
        }
        if (textArr[0].toLowerCase() === '?vacation' ||
            (textArr[0].toLowerCase() === 'who' && textArr[1].toLowerCase() === 'is' &&
            textArr[2].toLowerCase() === 'on'
            && textArr[3].toLowerCase() === 'vacation')) {
            getEmployeeOnVacation(data);
        }
    }
});
