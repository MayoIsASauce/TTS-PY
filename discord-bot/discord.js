const Discord = require('discord.js');
const fs = require("fs");
const client = new Discord.Client();
let conn = null

client.once('ready', () => {
    console.log("logged in");
});

async function play(voiceChannel) {
    conn = await voiceChannel.join();
    conn.play('ew.mp3');
}

client.once('message', (msg) => {
    if (msg.content.startsWith('!')) {
        switch (msg.content) {
            case "!run":
                play(client.channels.cache.get("692241259485462528"));
                break;
            case "!leave":
                console.log($`received leave request and ${conn != null}`);
                if (conn != null) {
                    conn.destroy();
                    msg.channel.send("left vc");
                } else { console.log("unable to leave vc");  }
                
                break;
            default:
                break;
        }
    }
});

client.login(fs.readFileSync('resources\\tkn.gnome', 'utf8'));