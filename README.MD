# syov - Set Yourself on Vacation - Slack Bot

## A simple bot to notify on @mention that someone is on vacation for the platform Slack
### Features
* Set yourself on vacation mode
* Redirect messages to a fallback person on mention (@YourName)
* On mention of the person on vacation, the bot will send an alert with fallback person, end date of vacation and vacation place
* Get notify on login that you are still on vacation [TODO]
### Inspiration
This bot was built for the event SlackathonMTL.
It helps remote teams to be aware who is on vacation, improve workflow and be inspired with world photos.

## Guide
### General
Talk to the bot on private discussion to activate or deactivate vacation mode
### Documentation
```help```

```vacation help```

### To go on vacation
```vacation @JohnSnow -d 2016-06-05 -w iceland```
-- In this case, John Snow is the fallback so when people mention you @YourName
it will display the message with a travel photo:
```Sorry, @YourName is on vacation until 2016-06-05 in Iceland.```
```YourName is on vacation maybe @JohnSnow can respond to you```

### To end vacation
```vacation over```
The bot will reply :
```You are no longer on vacation. Welcome back!```

### To see who is on vacation
On every channel that the bot is part off, you can type
```?vacation``` or ```Who is on vacation``` (not case sensitive)

## Notes

### Current Issues
* SQL injection
* Infinite loop when two people in vacation, set the other has fallback
* More tests if the list is empty
* Cannot edit one field without overriding the other fields
* On ?vacation command when no one is on vacation

### TODO

### Resources
* <https://slack.com/>
* <http://www.slackathonmtl.com/en/>
