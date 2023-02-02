
from sqlite3 import Timestamp


class Linije:

    __mestoPolaska: str
    __mestoDolaska: str
    __vremePolaska: Timestamp
    __vremeDolaska:Timestamp
    __prevoznik:str


    def init(self, mestoPolaska:str, mestoDolaska:str, vremePolaska:Timestamp, vremeDolaska:Timestamp, prevoznik:str):
        self.__mestoPolaska = mestoPolaska
        self.__mestoDolaska = mestoDolaska
        self.__vremePolaska = vremePolaska
        self.__vremeDolaska = vremeDolaska
        self.__prevoznik = prevoznik


    def get_mestoPolaska(self):
        return self.__mestoPolaska
        
    def get_mestoDolaska(self):
        return self.__mestoDolaska
    
    def get_vremePolaska(self):
        return self.__vremePolaska

    def get_vremeDolaska(self):
        return self.__vremeDolaska
    
    def get_prevoznik(self):
        return self.__prevoznik

    def set_mestoPolaska(self, new_mestoPolaska):
        self.__mestoPolaska = new_mestoPolaska
    
    def set_mestoDolaska(self, new_mestoDolaska):
        self.__mestoDolaska = new_mestoDolaska

    def set_vremePolaska(self, new_vremePolaska):
        self.__vremePolaska = new_vremePolaska

    def set_vremeDolaska(self, new_vremeDolaska):
        self.__vremeDolaska = new_vremeDolaska

    def set_prevoznik(self, new_prevoznik):
        self.__prevoznik = new_prevoznik
    
    
