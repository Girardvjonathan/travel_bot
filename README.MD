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

### To go on vacation
```vacation @JohnSnow``` -- In this case John snow is the fallback so when people mention you @You
it will display a message with the message:

```YourName is on vacation maybe @JohnSnow can respond to you```
### To

### To see who is on vacation
On every channel that the bot is part off, you can type
```?vacation``` or ```Who is on vacation``` (not case sensitive)


### Current Issue
* Sql injection
* Infinite loop when two person in vacation set the other has fallback
* More test if list are empty

### TODO
* notify of return from vacation [done]
* update help fonction for date [done]
* Integrate Photo on vacation with place [done]