# Confessions-Bot

This bot is actually a custom Discord bot made for a server called PYL: [Discord server invite](https://discord.gg/TNDfCcB5Ke)

To use this bot, download the source code, create a bot application on Discord, and follow these steps;

<h4 align="center">Create a Discord bot application</h4>

Go [here](https://discord.com/developers/applications/) to create a new discord bot. You can find many tutorials online on how to create and invite a bot. Follow any one of them and invite it to your server.

<h4 align="center">Create an Airtable account and Base</h4>

Go [here](https://www.airtable.com/) and create a new airtable account. You now must create a base. Keep clicking on continue on everything (with reading it ofcourse lol), and once you reach the Base creation tab, input whatever name you want.

Now, follow these steps perfectly.
Click on `+ Add your own` and type `Confessions`. Click on continue.
Enter any random values for Row 1, 2 and 3. Click on continue.
Now, click on `+ Add your own`, and type `MsgID`. Don't change the content of the dropdown box. Click on continue.
Click on `Create your workflow later` and click on continue.
Click on `Grid Only (for now)` and click on continue.
Once the table has loaded, cancel all prompts and double click on the first row `Name`. Change its name to `UsrID`.
Hold shift, and select all the fields. Right click on them and delete all the records.
Click on `+ Add or import` towards the top of the table.
Click on `Create empty table`.
Name it `Blocks`.
Right click on the third and fourth row and delete them.
Double click on the second row, and rename it to 

<h4 align="center">Create a config.JSON</h4>

```json
{
    "token": "DISCORD BOT TOKEN",
    "guildId": "SERVER ID",
    "clientId": "BOT CLIENT / APPLICATION ID",
    "confessId": "CONFESSION CHANNEL ID",
    "airtable_API": "AIRTABLE API KEY",
    "errChannelId": "ERROR CHANNEL ID",
    "errGuildId": "ERROR GUILD ID"
}
```
