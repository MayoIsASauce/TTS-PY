from typing import List
import os

def genFolders(users: List[str], path) -> None:
    for user in users:
        os.makedirs(path+f'\\{user}')