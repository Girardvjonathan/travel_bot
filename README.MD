# syov - Vacation Slack Bot

## A simple bot to notify on @mention that someone is on vacation
### Features
* Set Yourself on vacation mode
* Notify off fallback person on mention (@Yourname)
* Get notify on login that you are still on vacation [TODO]
* Specify travelling country, place or activity which send a photo and message in general

## Guide
### General
Talk to the bot on private discussion to activate or deactivate travel mode
### To get help and documentation
```help```

```travel help```

```travel --help```

### To set someone has fallback
```travel @JohnSnow``` -- In this case John snow is the fallback so when people mention you @You
it will display a message with the message:

```YourName is on vacation maybe @JohnSnow can respond to you```
### Current Issue
* Sql injection
* Infinite loop when two person in vacation set the other has fallback
