import { createRoot } from 'react-dom/client';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import App from './App';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources: {
      en: {
        translation: {
          'hello-world': 'Hello world <3',
          ty: 'Thank you @loup13 for translation. Dev by @nolyoShifumi',
          description:
            'This product is made to help you manage your stock in the Supermarket simulator game.',
          'stay-connect':
            'Join our discord to be kept informed of updates and developments',
          'general-data': {
            title: 'General Data',
            storage: 'Storage',
            employees: 'Employees',
            licenses: 'Licenses',
            invoices: 'Invoices',
            money: 'Money',
            cashiers: 'You have {{count}} cashier(s)',
            'no-cashiers': 'You have no cashiers ❌',
            licence: 'You have {{count}} license(s) unlocked',
            'no-licence': 'You have no licence unlocked ❌',
            billsAndRent:
              'You have {{bills}} bill(s) and {{rents}} rent(s) to pay',
          },
          products: {
            title: 'Products',
            price_changed: 'Price changed of day',
            old_price: 'Old price',
            new_price: 'New price',
            refresh: 'Refresh',
            'search-product': 'Search a product',
            img: 'Img',
            product: 'Product',
            store: 'Store',
            stockage: 'Stockage',
            total: 'Total',
            marketPrice: 'Market Price',
            youPrice: 'Your Price',
            moreInfo: 'More Infos',
          },
        },
      },
      fr: {
        translation: {
          'hello-world': 'Bonjour le monde <3',
          ty: 'Merci @loup13 pour la traduction, Dev par @nolyoShifumi ',
          description:
            'Ce produit est conçu pour vous aider à gérer votre stock dans le jeu de simulation de supermarché.',
          'stay-connect':
            'Rejoignez notre serveur Discord pour rester informé des mises à jour et des développements.',
          'general-data': {
            title: 'Données générales',
            storage: 'Stockage',
            employees: 'Employés',
            licenses: 'Licences',
            invoices: 'Factures',
            money: 'Argent',
            cashiers: 'Vous avez {{count}} caissier(s)',
            'no-cashiers': "Vous n'avez pas de caissier ❌",
            licence: 'Vous avez {{count}} licence(s) débloquée(s)',
            'no-licence': "Vous n'avez aucune licence débloquée ❌",
            billsAndRent:
              'Vous avez {{bills}} factures et {{rents}} loyer à payer',
          },
          products: {
            title: 'Produits',
            price_changed: 'Changement de prix du jour',
            old_price: 'Ancien prix',
            new_price: 'Nouveau prix',
            refresh: 'Actualiser',
            'search-product': 'Rechercher un produit',
            img: 'Image',
            product: 'Produit',
            store: 'Magasin',
            stockage: 'Stockage',
            total: 'Total',
            marketPrice: 'Prix Moyen',
            youPrice: 'Votre prix',
            moreInfo: 'More Infos',
          },
        },
      },
    },
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  });

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
