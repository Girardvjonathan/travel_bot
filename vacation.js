/**
 * Created on 2016-06-04.
 * Collaborators : Jonathan Girard, Kim Sang Ly, Yannick Jacques.
 */
var Bot = require('slackbots');
var getphoto = require('./getphoto.js');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('vacation.db');
var check;
var channels;
var users;
var users_in_vacation;

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
    db.all("SELECT * from user_vacation", function (err, rows) {
        users_in_vacation = rows;
        //console.log(users_in_vacation);
    });
}

var bot = new Bot(settings);
bot.on('start', function () {
    db.run("CREATE TABLE if not exists user_vacation (user TEXT PRIMARY KEY ASC, user_to TEXT, dest TEXT, date TEXT)");
    dbRead();
    //addVacation();
    bot.getChannels().then(function (data) {
        channels = data.channels;
        //console.log(channels);
    });
    bot.getUsers().then(function (data) {
        users = data.members;
        //console.log(users);
    });
});

function addVacation(user, userTo, dest, date) {
    db.run("INSERT OR REPLACE INTO user_vacation VALUES ('" + user + "','" + userTo + "','" + dest + "','" + date + "')");
}

function removeVacation(user) {
    db.run("DELETE FROM user_vacation WHERE user='" + user + "'")
}

function verifyMention(data) {
    text = data.text;
    if (text.indexOf("@") > -1) {
        //content = text.substring(text.indexOf(' ') + 1, text.length);
        user_to = text.substring(text.indexOf("@") + 1, text.indexOf(">"));
        channel = channels.getByProps({id: data.channel});
        post_user = data.user;
        //if user is in db user_vacation user column then ...
        //console.log('user_to' + user_to);
        vacation_user = users_in_vacation.getByProps({user: user_to});
        //console.log("users_in_vacation" + vacation_user[0].name);
        if (vacation_user.length > 0) {
            //post @userTo User.name is in vacation maybe @UserTo.name can respond to you
            var messageParams = {};
            message = 'Sorry, ' + users.getByProps({id: vacation_user[0].user})[0].name + " is on vacation";
            if(vacation_user[0].date !== 'Invalid Date') {
                var endDate = new Date(vacation_user[0].date);
                message += ' until ' + endDate.getFullYear() + "-" + (endDate.getMonth() + 1) + "-" + endDate.getDate();
            }
            if(vacation_user[0].dest !== 'null' || vacation_user[0].dest !== 'undefined') {
                var destination = vacation_user[0].dest.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                    return letter.toUpperCase();
                });
                message += ' in ' + destination;

                getphoto.search(destination + ' landscape', function(result) {
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
                    message += '.';

                    if (vacation_user[0].user_to != 'null') {
                        message += " Maybe <@"
                            + users.getByProps({id: vacation_user[0].user_to})[0].id + "> can respond to you."
                    }
                    bot.postMessageToChannel(channel[0].name, message, messageParams);
                });
            }
            else {
                message += '.';

                if (vacation_user[0].user_to != 'null') {
                    message += " Maybe <@"
                        + users.getByProps({id: vacation_user[0].user_to})[0].id + "> can respond to you."
                }
                bot.postMessageToChannel(channel[0].name, message, messageParams);
            }
        }
    }
}

function isPrivate(channel) {
    return channels.getByProps({id: channel}).length == 0;
}

function apiVacation(data) {
    // First check if its a private channel
    text = data.text;
    var user_to;
    var confirmationMessage;
    var textArr = text.split(" ");
    //console.log(textArr);
    try {
        var dest = findValue(textArr, "-w");
        var date = findValue(textArr, "-d");
        if (textArr[1]) {
            if (textArr[1] == 'over') {
                removeVacation(data.user);
                confirmationMessage = "You are no longer on vacation. Welcome back!";
                bot.postMessageToChannel('general', users.getByProps({id: data.user})[0].name+" is no longer on vacation. Welcome back!");
            }
            else if (textArr[1].indexOf('@') > -1) {
                textArr[1] = textArr[1].substring(textArr[1].indexOf('@') + 1, textArr[1].length - 1);
                user_to = users.getByProps({id: textArr[1]})[0].id;
                confirmationMessage = "You are on vacation and <@" + user_to +
                    "> is responding for you. Have fun!";
                addVacation(data.user, user_to, dest, new Date(date).toString());
            } else {
                user_to = null;
                confirmationMessage = "You are on vacation. Have fun!";
                addVacation(data.user, user_to, dest, new Date(date).toString());
            }
        }
        else {
            user_to = null;
            confirmationMessage = "You are on vacation. Have fun!";
            addVacation(data.user, user_to, dest, new Date(date).toString());
        }
        bot.postMessageToUser(users.getByProps({id: data.user})[0].name, confirmationMessage);
        dbRead();
    }
    catch
        (err) {
    }
}


function findValue(args, param) {
    var id = args.indexOf(param);
    //console.log("ID = " + id + " L = " + args.length);
    if (id > -1 && args.length >= id + 1) {
        //console.log("ARGGGGG = " + args[id + 1]);
        if(param === "-d") {
            var dateArr = args[id + 1].split("-");
            if(dateArr.length === 3) {
                return dateArr[0] + "-" + parseInt(dateArr[1]) + "-" + parseInt(dateArr[2]);
            }
        }
        else if(param === "-w") {
            var destination = "";

            for(var i=(id + 1); args.length>i && args[i].indexOf("-")<0 ; i++) {
                destination += args[i] + " ";
            }
            console.log(destination);
            return destination;
        }
        else {
            return args[id + 1];
        }
    }
    else {
        return null;
    }
}

function formatDate(date) {
    date = date.replace("/", "-");
    var comp = date.split('-');

    if (comp.length == 3 && comp[0].length == 4 && comp[1].length == 2 && comp[2].length == 2) {
        return true
    }
    else {
        return false
    }
}

function getEmployeeOnVacation(data) {
    var message = "No user on vacation ";
    var channel = channels.getByProps({id: data.channel});
    if (users_in_vacation.length > 0) {
        message = "Theses users are on vacation: ";
        users_in_vacation.forEach(function (entry) {
            if (entry != 'undefined') {
                user = users.getByProps({id: entry.user})[0].name;
                //console.log(user);
                message += " " + user;
                if(entry.date !== 'Invalid Date') {
                    var endDate = new Date(entry.date);
                    message += ' until ' + endDate.getFullYear() + "-" + (endDate.getMonth() + 1) + "-" + endDate.getDate();
                }
                message += ",";
            }
        });
    }
    //    TODO si date marquer until date
    //            console.log(channel);
    if (channel.length > 0) {
        bot.postMessageToChannel(channel[0].name, message.substring(0, message.length - 1));
    } else {
        bot.postMessageToUser(users.getByProps({id: data.user})[0].name, message.substring(0, message.length - 1));
    }
}

function helpInfo(data) {
    message = "*Help and documentation* \nTo go in *vacation* mode write :\n>vacation \n>[optional @NameOfAnswerer " +
        "in your absence you can set someone to be notify when somebody mention you]\nExemple: vacation @JohnSnow" +
        "\n\n>[optional -w Destination you can specify the destination you are going to and Syov will send a beautifull picture of it]\nExemple: vacation -w Iceland" +
        "\n\n>[optional -d yyyy-mm-dd you can specify the returning date of your vacation and syov will show it to anyone who will be mentioning you in a conversation]\nExemple: vacation -d 2016-08-06\n"+
        "\nTo *quit vacation* mode write : \n>vacation over" +
        "\n To see who is on vacation: \n>who is on vacation \n>?vacation";
    bot.postMessageToUser(users.getByProps({id: data.user})[0].name, message);
}

bot.on('message', function (data) {
    // all ingoing events https://api.slack.com/rtm
    //console.log(data.type);

    //console.log(data);

    // Check if a mention has been made if so, if the user is on vacation
    //console.log(data);
    if(data.type == "presence_change") {
        if(data.presence == 'active') {
            user = users_in_vacation.getByProps({user: data.user});
            if(user.length>0) {
                bot.postMessageToUser(users.getByProps({id: user[0].user})[0].name, "You are still on vacation. If they are over, you can end them with " +
                    "\n>vacation over");
            }
        }
    }
    if (data.type == 'message') {
        verifyMention(data);
        var textArr = data.text.split(" ");
        //console.log(textArr);
        if (textArr[0].toLowerCase() === 'help' ||
            (textArr[0].toLowerCase() === 'vacation' && textArr[1] && textArr[1].toLowerCase() === 'help')) {
            if (isPrivate(data.channel)) {
                helpInfo(data);
            }
        }
        if (textArr[0].toLowerCase() === 'vacation') {
            if (isPrivate(data.channel)) {
                apiVacation(data);
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
