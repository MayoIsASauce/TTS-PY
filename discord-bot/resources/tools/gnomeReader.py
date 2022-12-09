def fetchToken(filename) -> str:
    token: str = ""
    with open(filename, 'r') as file:
        token = file.readline()
        file.close()
    
    return token