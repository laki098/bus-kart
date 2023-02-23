class Autobusi:
    __idautobusi: int
    __tablica:str
    __brojMesta:int

    def __init__(self, idautobusi:int,tablica: str, brojMesta:int):
        self.__idautobusi = idautobusi
        self.__tablica = tablica
        self.__brojMesta = brojMesta

    def get_idautobusi(self):
        return self.__idautobusi
    
    def get_tablica(self):
        return self.__tablica
    
    def get_brojMesta(self):
        return self.__brojMesta
    
    def set_idautobusi(self, new_idautobusi):
        self.__idautobusi = new_idautobusi

    def set_tablica(self, new_tablica):
        self.__tablica = new_tablica

    def set_brojMesta(self, new_brojMesta):
        self.__brojMesta = new_brojMesta
