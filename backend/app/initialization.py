import os
from db.DB import DB
from models.korisnik import Korisnik


def create_folder():
    static_folder = 'static'
    images_folder = '/images/'
    full_path = static_folder + images_folder

    if not os.path.exists(full_path):
        return os.makedirs(static_folder + images_folder)


def init_db():
    DB.create_table("""CREATE TABLE IF NOT EXISTS `korisnik` (
                        `id` int NOT NULL AUTO_INCREMENT,
                        `korisnickoIme` varchar(255) NOT NULL,
                        `lozinka` varchar(255) NOT NULL,
                        `ime` VARCHAR(255) NOT NULL,
                        `prezime` VARCHAR(255) NOT NULL,
                        `brojTelefona` VARCHAR(255) NOT NULL,
                        `email` VARCHAR(255) NOT NULL,
                        `role` VARCHAR(255) NOT NULL,
                        PRIMARY KEY (`id`),
                        UNIQUE KEY `korisnickoIme_UNIQUE` (`korisnickoIme`)
                    ) ENGINE=InnoDB""")

    korisnickoIme = "admin"
    lozinka = Korisnik.hash_lozinka("admin")
    ime = "admin"
    prezime = "admin"
    email = "admin@admin.com"
    brojTelefona = 124142
    role = "admin"

    DB.insert_into_query(
        "INSERT IGNORE INTO korisnik (korisnickoIme, lozinka, ime, prezime, brojTelefona, email, role) VALUES (%s, %s, %s, %s, %s, %s, %s)", (korisnickoIme, lozinka, ime, prezime, brojTelefona, email, role))

    DB.create_table("""CREATE TABLE IF NOT EXISTS `employee` (
                        `id` int NOT NULL AUTO_INCREMENT,
                        `first_name` varchar(255) NOT NULL,
                        `last_name` varchar(255) DEFAULT NULL,
                        `order` int NOT NULL,
                        `linked_in` varchar(255) DEFAULT NULL,
                        `xing` varchar(255) DEFAULT NULL,
                        `role` varchar(255) NOT NULL,
                        `email` varchar(255) DEFAULT NULL,
                        `photo_url` varchar(255) DEFAULT NULL,
                        PRIMARY KEY (`id`)
                    ) ENGINE=InnoDB""")

    DB.create_table(""" CREATE TABLE IF NOT EXISTS `linije` (
        `idlinije` INT NOT NULL AUTO_INCREMENT,
        `mestoPolaska` VARCHAR(255) NOT NULL,
        `mestoDolaska` VARCHAR(255) NOT NULL,
        `vremePolaska` TIME NOT NULL,
        `vremeDolaska` TIME NOT NULL,
        `prevoznik` VARCHAR(255) NULL,
        `datumPolaska` DATE NOT NULL,
        `datumDolaska` DATE NOT NULL,
        PRIMARY KEY (`idlinije`)
        )ENGINE=InnoDB""")

    DB.create_table(""" CREATE TABLE IF NOT EXISTS `autobusi` (
            `idautobusi` INT NOT NULL AUTO_INCREMENT,
            `tablica` VARCHAR(255) NOT NULL,
            `brojMesta` INT NOT NULL,
            PRIMARY KEY (`idautobusi`),
            UNIQUE INDEX `tablica_UNIQUE` (`tablica` ASC) VISIBLE
            )ENGINE=InnoDB""")


def init():
    # create_folder()
    init_db()
