# syov - Vacation Slack Bot

## A simple bot to notify on @mention that someone is on vacation
### Features
* Set Yourself on vacation mode
* Notify off fallback person on mention (@Yourname)
* Get notify on login that you are still on vacation [TODO]
* Specify travelling country, place or activity and the bot will send a travel notification with a message and photo

## Guide
### General
Talk to the bot on private discussion to activate or deactivate travel mode
### To get help and documentation
```help```

```vacation help```

### To go on vacation
```vacation @JohnSnow``` -- In this case John snow is the fallback so when people mention you @You
it will display a message with the message:

```YourName is on vacation maybe @JohnSnow can respond to you```
### To

### To see who is on vacation
On every channel that the bot is part off, you can type
```?vacation``` or ```Who is on vacation``` (not case sensitive)


### Current Issues
* SQL injection
* Infinite loop when two people in vacation set the other has fallback
* More test if list is empty
* Cannot edit one field without overriding the other fields
* ?vacation quand personne dans la db

### TODO
