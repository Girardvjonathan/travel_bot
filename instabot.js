

var Bot = require('slackbots')

var settings = {
  token: 'xoxb-48208002487-TnZqostisHVuCgFoWyDP3nvS',
  name: 'travel_bot'
};

var bot = new Bot(settings)



bot.on('message',function(data){

  console.log('=======================================')
  console.log(data)
  if(data.type === 'message'){
    //if(data.text === 'ok'){
      console.log(data.user.name);
      bot.postMessageToUser(data.user,"OK MEC!!!")
    //}
  }

  console.log('=======================================')
})
