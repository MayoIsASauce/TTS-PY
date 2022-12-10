const Discord = require('discord.js');
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

client.login('MTA1MDY3MjgzOTg3Mjc1MzY2Ng.GZFRLz.EFD3QchuID_pGfvZsiwlYQRgF6RsdH_SsLfJQM');