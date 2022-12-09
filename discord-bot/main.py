from datetime import datetime
from resources.tools import folderBatch, gnomeReader
import os, discord, pytz

intents = discord.Intents.all()

client = discord.Client(intents=intents)

@client.event
async def on_ready():
    print(f'logged in: {client.user}')

@client.event
async def on_message(message: discord.message.Message):
    if message.author == client.user:
        return
    
    if message.content == "!init":
        server: discord.Guild = message.guild
        member_ids = []
        for member in server.members:
            if not member.bot:
                member_ids.append(member.id)
        
        folderBatch.genFolders(member_ids, os.path.dirname(os.path.abspath(__file__)).split(".")[0]+"\\voices")

        await message.channel.send(f'{datetime.now(tz=pytz.UTC)}.UTC | attempted to create folders')
    
client.run(gnomeReader.fetchToken("resources\\tkn.gnome"))