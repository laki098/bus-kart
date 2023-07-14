import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'sr',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          description: {
            part1: 'Name and Familyname',
            part2: 'Enter Name and Familyname',
            part3: 'Place of departure',
            part4: 'Enter place of departure',
            part5: 'Place of arrival',
            part6: 'Enter place of arrival',
            part7: 'Date of departure',
            part8: 'Enter date of departure',
            part9: 'Date of arrival',
            part10: 'Enter date of arrival',
            part11: 'Time of departure',
            part12: 'Enter time of depature',
            part13: 'Time of arrival',
            part14: 'Enter time of arrival',
            part15: 'E-mail',
            part16: 'Enter E-mail',
            part17: 'Phone',
            part18: 'Enter phone',
            part19: 'Choose a drink',
            part20: 'Reservation ticket',
            part21: 'Coffe',
            part22: 'Tea',
            part23: 'Chose a ticket',
            part24: 'Single',
            part25: 'Return',
            part26: 'Free',
            part27: 'Students',
            part28: 'Weekend',
            part29: 'Weekly',




            part30: 'Find bus line',
            part31: 'Start bus station',
            part32: 'End bus station',
            part33: 'Date',
            part34: 'Timetable',
            part35: 'Reservation',
            part36: 'Number of seats',
            part37: 'Add line',

            part40: 'Name',
            part41: 'Enter name',
            part42: 'Familyname',
            part43: 'Enter familyname',
            part44: 'Username',
            part45: 'Enter ussername',
            part46: 'Password',
            part47: 'Enter password',
            part48: 'Phone number',
            part49: 'Enter phone number',
            part50: 'E-mail',
            part51: 'Enter e-mail',
            part52: 'Register',
            


            part60: 'Price of ticket:',
            part61: ' dinars',
            part62: 'No. selectet seat:',
            part63: 'Total price:',
            part64: 'Currently reserved seat:',
            part65: 'None',
            part66: 'Selected',
            part67: 'Busy',
            part68: 'Selected seat',
            part69: 'Reservation seat',
            part70: 'Date of return',
            part71: 'Timetable of return line',
            part72: 'Select a ticket type',


            part110: 'Contact',
            part111: 'Address',
            part112: 'Phone',
            part113: 'Put Name and Familyname',
            part114: 'Put Phone',
            part115: 'Message',
            part116: 'Send mail',

            part120: 'Reset password',
            part121: 'Confirm',
            part122: 'New password',
            part123: 'Repeat password',
            part124: 'Login',
            part125: 'Forget pasword',
            part126: 'License plate',
            part127: 'Add bus',
            part128: 'Add',
            part129: 'Save',
            part130: 'New line',
            part131: 'Operater',
            part132: 'Select a operater',

            part133: 'Change',
            part134: 'Delite',
            part135: 'No line',


          }
        }
      },
      sr: {
        translation: {
          description: {
            part1: 'Ime i prezime',
            part2: 'Unestite ime i prezime',
            part3: 'Mesto polaska',
            part4: 'Unesite mesto polaska',
			      part5: 'Mesto dolaska',
            part6: 'Unesite mesto dolaska',
            part7: 'Datum polaska',
            part8: 'Unesite datum polaska',
            part9: 'Datum dolaska',
            part10: 'Unesite datum dolaska',
            part11: 'Vreme polaska',
            part12: 'Unesite vreme polaska',
            part13: 'Vreme dolaska',
            part14: 'Unesite vreme dolaska',
            part15: 'E-mail',
            part16: 'Unesite e-mail',
            part17: 'Telefon',
            part18: 'Unesite telefon',
            part19: 'Izaberite osveženje',
            part20: 'Rezerviši kartu',
            part21: 'Kafa',
            part22: 'Čaj',
            part23: 'Izaberite kartu',
            part24: 'Jednosmerna',
            part25: 'Povratna',
            part26: 'Besplatna',
            part27: 'Studentska',
            part28: 'Vikend',
            part29: 'Nedeljna',


            part30: 'Pronađite liniju',
            part31: 'Početna stanica',
            part32: 'Dolazna stanica',
            part33: 'Datum polaska',
            part34: 'Red vožnje',
            part35: 'Rezerviši',
            part36: 'Broj mesta',
            part37: 'Dodavanje linije',


            part40: 'Ime',
            part41: 'Unesite ime',
            part42: 'Prezime',
            part43: 'Unesite prezime',
            part44: 'Korisničko ime',
            part45: 'Uneite korisničko ime',
            part46: 'Lozinka',
            part47: 'Unesite lozinku',
            part48: 'Broj telefona',
            part49: 'Unesite broj telefona',
            part50: 'E-mail',
            part51: 'Unesite e-mail',
            part52: 'Registrujte se',
            

            part60: 'Cena karte:',
            part61: 'dinara',
            part62: 'Br. izabranih sedišta:',
            part63: 'Ukupna cena:',
            part64: 'Trenutno rezervisano mesto:',
            part65: 'Nijedno',
            part66: 'Izabrano',
            part67: 'Zauzeto',
            part68: 'Izaberite sedište',
            part69: 'Rezervišite mesto',
            part70: 'Datum povratka',
            part71: 'Red vožnje povratne linije',
            part72: 'Odaberite vrstu karte',


            part110: 'Kontakt',
            part111: 'Adresa',
            part112: 'Telefon',
            part113: 'Unesite ime i prezime',
            part114: 'Unesite telefon',
            part115: 'Poruka',
            part116: 'Pošalji mail',

            part120: 'Resetujte lozinku',
            part121: 'Potvrdite',
            part122: 'Nova lozinka',
            part123: 'Ponovi lozinku',
            part124: 'Logovanje',
            part125: 'Zaboravljena šifra',
            part126: 'Registarska tablica',
            part127: 'Dodajte autobus',
            part128: 'Dodaj',
            part129: 'Sačuvaj',
            part130: 'Nova linija',
            part131: 'Prevoznik',
            part132: 'Izaberite prevoznika',

            part133: 'Zameni',
            part134: 'Obriši',
            part135: 'Nema linije',

          }
        }
      },   

    }
  });

export default i18n;