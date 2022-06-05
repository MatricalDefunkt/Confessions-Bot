# Confessions-Bot

This bot is actually a custom Discord bot made for a server called PYL: [Discord server invite](https://discord.gg/TNDfCcB5Ke)

To use this bot, download the source code, create a bot application on Discord, and follow these steps;

<h3 align="center">Create A Discord Bot Application</h3>

Go [here](https://discord.com/developers/applications/) to create a new discord bot. You can find many tutorials online on how to create and invite a bot. Follow any one of them and invite it to your server. Please note that it needs the `appication.commands` scope to function.

<h3 align="center">Setting It Up</h3>

Now, you can use a console and file explorer, but I'd recommend a code editor, personally, VS Code.

In the file explorer, create a new folder, wherever you'd like, calling it anything you'd like. Move all your downloaded files here.

Next, go [here](https://nodejs.org/en/download/) to download NodeJS. It's essential. Install it.

If you're using VS Code, right click on the folder, and click on `Open with Code`. Once it's open, your screen should look like this:

![ConfessionsBotTutorial1](https://user-images.githubusercontent.com/97472770/172023667-d1cbc80d-67cb-4848-b71f-294cc691ab7d.png)

Now, go to `View` (Top-Left). Click on it, and click on `Terminal`, or if you are using the file explorer, open a new instance of a console (command prompt, powershell etc.) and navigate to this folder.

Now, in the console/terminal, paste the following command, and press enter

```shell
npm install
```

<h3 align="center">Create a config.JSON</h3>

We're in the final yard now!

<h5>FOR CODE-EDITOR USERS:</h5>

Now right click in the empty space in the explorer, as shown.

![ConfessionsBotTutorial2](https://user-images.githubusercontent.com/97472770/172023774-5a3d0ce8-068b-4c6e-8449-86fb7b3e23b9.png)

Click on `New File` and name it `config.json`.
Paste this in the file:
```json
{
    "token": "DISCORD BOT TOKEN",
    "guildId": "SERVER ID",
    "clientId": "BOT CLIENT / APPLICATION ID",
    "confessId": "CONFESSION CHANNEL ID",
    "errChannelId": "ERROR CHANNEL ID",
    "errGuildId": "ERROR GUILD ID",
    "staffRoleId": "STAFF ROLE ID",
    "logChannelId": "LOG CHANNEL ID"
}
```

Now, paste all of the data we had obtained earlier in the appropriate fields.

<h5>FOR FILE-EXPLORER USERS:</h5>

Create a new file, naming it `config.txt`.
Open the file using notepad and paste the following code into it:
```json
{
    "token": "DISCORD BOT TOKEN",
    "guildId": "SERVER ID",
    "clientId": "BOT CLIENT / APPLICATION ID",
    "confessId": "CONFESSION CHANNEL ID",
    "errChannelId": "ERROR CHANNEL ID",
    "errGuildId": "ERROR GUILD ID",
    "staffRoleId": "STAFF ROLE ID",
    "logChannelId": "LOG CHANNEL ID"
}
```
Once done, exit out, and rename the file to `config.json`. Your OS will most probably point out that you are doing something dangerous, but please ignore it, as, in this case, it is not a dangerous action.

<h3 align="center">Creating the Database and Registering Commands</h3>

Once you've made sure everything is in place, paste these three lines into the console.
```shell
node deployl.js
node ./database/database
```

Your explorer should look something like this:

![ConfessionsBotTutorial3 1](https://user-images.githubusercontent.com/97472770/172024086-07b6d794-5325-4809-a599-9d8b42098fbd.png)
![ConfessionsBotTutorial3 2](https://user-images.githubusercontent.com/97472770/172024088-95f80814-35cc-46e1-b977-f776542af60d.png)

<h3 align="center">Running the Bot</h3>

Lastly, (this is where you run the bot), type `node .` into the shell. If everything is okay, you should see `Ready!` there. 

You can now run all the commands and try them out for yourself!
Good luck!
