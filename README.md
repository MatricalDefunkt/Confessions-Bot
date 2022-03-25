# Confessions-Bot

This bot is actually a custom Discord bot made for a server called PYL: [Discord server invite](https://discord.gg/TNDfCcB5Ke)

To use this bot, download the source code, create a bot application on Discord, and follow these steps;

<h3 align="center">Create A Discord Bot Application</h3>

Go [here](https://discord.com/developers/applications/) to create a new discord bot. You can find many tutorials online on how to create and invite a bot. Follow any one of them and invite it to your server.

<h3 align="center">Create an Airtable Account And Base</h3>

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
Double click on the second row, and rename it to `Blocked?` and set the type to `Single Select` with two options: 1) `true`, 2) `false`
Rename the first field to `BlkID`

That's it!

<h3 align="center">Obtain Airtable Data</h3>

Now, to use your bot, you also need your Airtable API keys, and Airtable Base ID. To get the base ID, look at the link of the base you just made, it should look something like this!

![image](https://user-images.githubusercontent.com/97472770/160137966-1013aef2-c870-461a-aa1d-08268cbc08bd.png)

Now, the green highlighted bit is your Base ID.

Next, head to your account by clicking [here](https://airtable.com/account). Scroll a bit, and you will see `API`, under which there will be a button `Generate API key`. Click it. This text is your Airtable API key

<h3 align="center">Setting It Up</h3>

Now, you can use notepad and file explorer, but I'd recommend a code editor, personally, VS Code.

In your file explorer, create a new folder, call it anything you'd like. Import all your downloaded files here.

Next, go [here](https://nodejs.org/en/download/) to download NodeJS. It's essential.

If you're using VS Code, right click in an empty space in the file explorer, and click on `Open with Code`. Once it's open, your screen should look like this:

![image](https://user-images.githubusercontent.com/97472770/160140869-b47f4eb4-8940-45bf-833e-cf670616ee42.png)

Now, go to `View` (Top-Left). Click on it, and click on `Terminal`.

Now, in the terminal, paste the following command

```shell
npm i discord.js
npm i airtable
npm i discord-api-types
npm i discordjs/rest
npm i discordjs/builders
```

<h3 align="center">Create a config.JSON</h3>

We're in the final yard now!

Now right click in the empty space in the file explorer, as shown.

![image](https://user-images.githubusercontent.com/97472770/160142236-6b6ba27a-ffcb-4429-a132-43694340fca8.png)


Click on `New File` and name it `config.json`
Paste this in the file:
```json
{
    "token": "DISCORD BOT TOKEN",
    "guildId": "SERVER ID",
    "clientId": "BOT CLIENT / APPLICATION ID",
    "confessId": "CONFESSION CHANNEL ID",
    "airtable_API": "AIRTABLE API KEY",
    "errChannelId": "ERROR CHANNEL ID",
    "errGuildId": "ERROR GUILD ID",
    "airtableBase": "AIRTABLE BASE ID",
    "staffRoleId": "STAFF ROLE ID"
}
```

Now, paste all of the data we had obtained earlier in the appropriate fields.

Once you've made sure everything is in place, type
```shell
node deployl.js
```

<h3 align="center">Running the Bot</h3>

Lastly, (this is where you run the bot), type `node .` into the shell. If everything is okay, you should see `Ready!` there. 

You can now run all the commands and try them out for yourself!
Good luck!
