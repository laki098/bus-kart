import binascii
import hashlib
import os


class Korisnik:

    __korisnickoIme: str
    __lozinka: str
    __ime: str
    __prezime: str
    __brojTelefona: str
    __email: str
    __role: str

    @staticmethod
    def hash_lozinka(lozinka):
        """Hash a lozinka for storing."""
        salt = hashlib.sha256(os.urandom(60)).hexdigest().encode('ascii')
        pwdhash = hashlib.pbkdf2_hmac('sha512', lozinka.encode('utf-8'),
                                      salt, 100000)
        pwdhash = binascii.hexlify(pwdhash)
        return (salt + pwdhash).decode('ascii')

    @staticmethod
    def verify_lozinka(stored_lozinka, provided_lozinka):
        """Verify a stored lozinka against one provided by korisnik"""
        salt = stored_lozinka[:64]
        stored_lozinka = stored_lozinka[64:]
        pwdhash = hashlib.pbkdf2_hmac('sha512',
                                      provided_lozinka.encode('utf-8'),
                                      salt.encode('ascii'),
                                      100000)
        pwdhash = binascii.hexlify(pwdhash).decode('ascii')
        return pwdhash == stored_lozinka

    def init(self, korisnickoIme: str, lozinka: str, ime: str, prezime: str, brojTelefona: str, email: str, role: str):
        self.__korisnickoIme = korisnickoIme
        self.__lozinka = lozinka
        self.__ime = ime
        self.__prezime = prezime
        self.__brojTelefona = brojTelefona
        self.__email = email
        self.__role = role

    def get_korisnickoIme(self):
        return self.__korisnickoIme

    def get_lozinka(self):
        return self.__lozinka

    def get_ime(self):
        return self.__ime

    def get_prezime(self):
        return self.__prezime

    def get_brojTelefona(self):
        return self.__brojTelefona

    def get_email(self):
        return self.__email

    def get_role(self):
        return self.__role

    def set_korisnickoIme(self, new_korisnickoIme):
        self.__korisnickoIme = new_korisnickoIme

    def set_lozinka(self, new_lozinka):
        self.__lozinka = new_lozinka

    def set_ime(self, new_ime):
        self.__ime = new_ime

    def set_prezime(self, new_prezime):
        self.__prezime = new_prezime

    def set_brojTelefona(self, new_brojTelefona):
        self.__brojTelefona = new_brojTelefona

    def set_email(self, new_email):
        self.__email = new_email

    def set_role(self, new_role):
        self.__role = new_role

    def __str__(self) -> str:

        res = f"korisnickoIme: {self.__korisnickoIme} \n"
        res += f"lozinka: {self.__lozinka} \n"
        res += f"ime: {self.__ime} \n"
        res += f"prezime: {self.__prezime} \n"

        res += f"brojTelefona: {self.__brojTelefona} \n "
        res += f"email: {self.__email}\n "
        res += f"role: {self.__role} "
        return res

    def to_dict(self):
        return {
            "korisnickoIme": self.__korisnickoIme,
            "lozinka": self.__lozinka,
            "ime": self.__ime,
            "prezime": self.__prezime,
            "brojTelefona": self.__brojTelefona,
            "email": self.__email,
            "role": self.__role,

        }
