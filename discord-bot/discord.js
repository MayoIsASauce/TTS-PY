const Discord = require('discord.js');
const fs = require("fs");
const client = new Discord.Client();
const uuid = require('uuid');

var connection = null
var recording = false;
var audio = null;

var users = new Map();
var main_interval = null;

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function iterToArr(iter) {
    let buff_arr = [];
    for (const i of iter) {
        buff_arr.push(i);
    }
    return buff_arr;
}

function pruneBots(mapped) {
    let queue = [];
    for (const id of mapped.keys()) {
        if (mapped.get(id).user.bot) queue.push(id);
    }

    queue.forEach(id => {
        mapped.delete(id);
    });
    
    console.log(`pruneBots found (${queue.length}) bots`);
    return mapped;
}

client.once('ready', () => {
    console.log("logged in");
});

client.on("guildMemberSpeaking", (member, r) => {
    // if (member.user.bot || member.user.id != "384435105336131584") return;
    // setTimeout(() => {
    //     member.voice.setMute(true);
    // }, 1000);
    
    // setTimeout(() => {
    //     member.voice.setMute(false);
    // }, 4000);
});


client.on('message', async (msg) => {
    if (msg.content.startsWith('!')) {
        switch (msg.content) {
            case "!run":
                // if the channel has active users and we arent recording and we arent connected
                if (msg.member.voice.channel && !recording && connection == null) {
                    connection = await msg.member.voice.channel.join(); // connect to the vc
                    msg.channel.send("Warmup finished, Toggle recording with: !record");
                } else {
                    if (connection != null) {
                        msg.channel.send("Already running");
                    } else if (recording) {
                        msg.channel.send("Warning: already active and recording");
                    } else {
                        msg.channel.send("Error: Could not locate your vc");
                    }
                }
                return;
            case "!leave":
                console.log(`received leave request and ${connection != null}`);
                // if we are connected and not recording
                if (connection != null && !recording) {
                    connection.disconnect(); // leave the vc
                    connection = null; // release the connection
                    await msg.channel.send("left vc");
                } else {
                    if (recording) { msg.channel.send("Stop recording first: !record"); }
                    console.log("unable to leave vc");
                }
                return;
            case "!record":
                if (!recording) // start recording
                {
                    // if we are connected
                    if (connection != null) {
                        console.log("Beginning record cycle");
                        main_interval = setInterval(async () => { // create a new async interval to record every 5 minutes
                            users = pruneBots(connection.channel.members); // get the users in the vc
                            let user_keys = iterToArr(users.keys()); // create an array of user ids
                            let user = users.get(user_keys[Math.floor(Math.random()*user_keys.length)]); // pick a random user

                            if (user.user.bot) return; // if they're a bot return NOTE: shouldnt needed but left as a safety

                            console.log(`Recording from ${user.user.username}#${user.user.discriminator}`);
                            // create the audio pipeline
                            audio = connection.receiver.createStream(user, { mode: 'pcm', end: "manual" });
                            // begin sending audio to destination device
                            audio.pipe(fs.createWriteStream("voices/"+user.user.id+"/"+uuid.v4().split("-").at(-1)+".gAudio"));
                            
                            await sleep(30000);
                            
                            console.log(`Done recording from ${user.user.username}#${user.user.discriminator}\n`);
                            // end the audio pipeline
                            audio.destroy();
                            // release resources
                            audio = null;
                        },300000 + 30000); // interval + sleep

                        connection.play('resources/mp3s/start.mp3');
                        recording = true;
                        msg.channel.send("Now listening on interval...");
                    } else {
                        msg.channel.send("First use !run so i can join the vc");
                    }
                }
                else // end recording
                {
                    // stop the recording interval
                    console.log("ending the recording cycle");

                    if (audio != null) { audio.destroy(); } // if the pipeline is open <- i want to delete this file
                    if (main_interval != null) { clearInterval(main_interval); } // end the recording interval

                    // recording has ended
                    recording = false;

                    connection.play('resources/mp3s/end.mp3');
                    msg.channel.send("Ended recording: interval closed");
                }
                return;
            case "!debug":
                console.log(`main_interval = ${main_interval}`);
                console.log(`connection = ${connection}`);
                await msg.channel.send("");
                return;
            default:
                return;
        }
    }
});

client.login(fs.readFileSync('resources\\tkn.gnome', 'utf8'));
