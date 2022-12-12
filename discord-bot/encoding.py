import wave
import os
from shutil import rmtree
from sys import argv

# with open("voices\\358022808095424516\\0b057585ec17.gAudio", 'rb') as pcmfile:
#     data_pcm = pcmfile.read()
#     with wave.open("sample.wav", 'wb') as wavfile:
#         wavfile.setparams((2, 2, 48000, 0, 'NONE', 'NONE'))
#         wavfile.writeframes(data_pcm)

def encode(path: str) -> None:
    folder = path
    file_names = [name for name in os.listdir(folder) if name != 'username.gnome']

    if len(file_names) == 0: return

    for file in file_names:
        pure_name = file.split(".")[0]

        try:
            os.mkdir(folder+pure_name)
        except FileExistsError:
            continue

        open(folder+pure_name+"\\"+pure_name+".wav", 'x').close()
        os.rename(folder+file, folder+"\\"+pure_name+"\\"+file)

        with open(folder+pure_name+"\\"+file, 'rb') as pcmfile:
            data_pcm = pcmfile.read()
            with wave.open(folder+pure_name+"\\"+pure_name+".wav", 'wb') as wavfile:
                wavfile.setparams((2, 2, 48000, 0, 'NONE', 'NONE'))
                wavfile.writeframes(data_pcm)

def decode(path: str) -> None:
    folders = [name for name in os.listdir(path) if len(name.split('.')) == 1]

    for folder in folders:
        os.rename(path+folder+"\\"+folder+".gAudio", path+folder+".gAudio")
        rmtree(path+folder+"\\")

folders = ["voices\\"+name+"\\" for name in os.listdir("voices\\")]

for folder in folders:
    print(open(folder+'\\username.gnome').read()+": ")
    print(str(file_names := [name for name in os.listdir(folder) if name != 'username.gnome'])+" : "+str(len(file_names)) + "\n")

    if "-d" in argv:
        decode(folder)
    else:
        encode(folder)