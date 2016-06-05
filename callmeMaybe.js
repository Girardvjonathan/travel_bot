/**
 * Created by john on 6/4/16.
 */
var Bot = require('slackbots');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('vacation.db');
var check;
var channels;
var users;
var user_in_vacation;

var settings = {
    token: 'xoxb-48208002487-TnZqostisHVuCgFoWyDP3nvS',
    name: 'syov'
};


var bot = new Bot(settings);
function abc(){
  bot.postMessageToChannel('general',"Call me maybe <@U104MN0H1>")
}
bot.on('start', function () {

    iFrequency =500;
    var myInterval = 0;
    if(myInterval > 0) clearInterval(myInterval);  // stop
    myInterval = setInterval( abc, iFrequency );
    console.log("hey");


});

bot.on('message', function (data) {
    //console.log('gey');
   //bot.postMessageToChannel('general',"Call me maybe <@U104MN0H1>");

});


