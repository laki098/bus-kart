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
/*            
            part30: 'Find bus line',
            part31: 'Start bus station',
            part32: 'End bus station',
            part33: 'Date',
            part34: 'Timetable',
*/
/*
            part110: 'Contact',
            part111: 'Address',
            part112: 'Phone',
            part113: 'Put Name and Familyname',
            part114: 'Put Phone',
            part115: 'Message',
            part116: 'Send mail',

            part120: 'Reset password',
            part121: 'Confirm',
*/
            
          }
        }
      },
      sr: {
        translation: {
          description: {
/*            
            part30: 'Pronađite liniju',
            part31: 'Početna stanica',
            part32: 'Dolazna stanica',
            part33: 'Datum polaska',
            part34: 'Red vožnje',
*/
/*
            part110: 'Kontakt',
            part111: 'Adresa',
            part112: 'Telefon',
            part113: 'Unesite ime i prezime',
            part114: 'Unesite telefon',
            part115: 'Poruka',
            part116: 'Pošalji mail',

            part120: 'Resetujte lozinku',
            part121: 'Potvrdite',
*/
           
          }
        }
      },   

    }
  });

export default i18n;