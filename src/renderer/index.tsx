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
          helloWorld: 'Hello world <3',
          ty: 'Thank you @loup13 for translation. Dev by @nolyoShifumi',
          description:
            'This product is made to help you manage your stock in the Supermarket simulator game.',
          stayConnect:
            'Join our discord to be kept informed of updates and developments',
          generalData: {
            title: 'General Data',
            storage: 'Storage',
            employees: 'Employees',
            licenses: 'Licenses',
            invoices: 'Invoices',
            money: 'Money',
            cashiers: 'You have {{count}} cashier(s)',
            restocker: ' and {{count}} restocker(s)',
            noCashiers: 'You have no cashiers ❌',
            noRestockers: 'You have no restocker ❌',
            licence: 'You have {{count}} license(s) unlocked',
            noLicence: 'You have no licence unlocked ❌',
            billsAndRent:
              'You have {{bills}} bill(s) and {{rents}} rent(s) to pay',
          },
          products: {
            title: 'Products',
            price_changed: 'Price changed of day',
            old_price: 'Old price',
            new_price: 'New price',
            refresh: 'Reload',
            'search-product': 'Search a product',
            img: 'Img',
            product: 'Product',
            store: 'Store',
            stockage: 'Stockage',
            total: 'Total',
            marketPrice: 'Buy Price',
            yourPrice: 'Your Price',
            averageCost: 'Average Cost',
            winRate: 'Profit',
            moreInfo: 'More Infos',
          },
        },
      },
      fr: {
        translation: {
          helloWorld: 'Bonjour le monde <3',
          ty: 'Merci @loup13 pour la traduction, Dev par @nolyoShifumi ',
          description:
            'Ce produit est conçu pour vous aider à gérer votre stock dans le jeu de simulation de supermarché.',
          stayConnect:
            'Rejoignez notre serveur Discord pour rester informé des mises à jour et des développements.',
          generalData: {
            title: 'Infos générales',
            storage: 'Stockage',
            employees: 'Employés',
            licenses: 'Licences',
            invoices: 'Factures',
            money: 'Argent',
            cashiers: 'Vous avez {{count}} caissier(s)',
            noCashiers: "Vous n'avez pas de caissier ❌",
            licence: 'Vous avez {{count}} licence(s) débloquée(s)',
            noLicense: "Vous n'avez aucune licence débloquée ❌",
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
            marketPrice: "Prix D'achat",
            yourPrice: 'Votre prix',
            averageCost: 'Prix moyen',
            winRate: 'Profit',
            moreInfo: 'More Infos',
          },
        },
      },
      es: {
        translation: {
          helloWorld: 'Hola mundo <3',
          ty: 'Gracias @loup13 por la traducción. Desarrollado por @nolyoShifumi',
          description:
            'Este producto está hecho para ayudarte a gestionar tu stock en el juego de simulación de supermercados.',
          stayConnect:
            'Únete a nuestro discord para estar informado de las actualizaciones y desarrollos',
          generalData: {
            title: 'Datos Generales',
            storage: 'Almacenamiento',
            employees: 'Empleados',
            licenses: 'Licencias',
            invoices: 'Facturas',
            money: 'Dinero',
            cashiers: 'Tienes {{count}} cajero(s)',
            restocker: ' y {{count}} reponedor(es)',
            noCashiers: 'No tienes cajeros ❌',
            noRestockers: 'No tienes reponedores ❌',
            licence: 'Tienes {{count}} licencia(s) desbloqueada(s)',
            noLicence: 'No tienes ninguna licencia desbloqueada ❌',
            billsAndRent:
              'Tienes {{bills}} factura(s) y {{rents}} alquiler(es) por pagar',
          },
          products: {
            title: 'Productos',
            price_changed: 'Precio cambiado del día',
            old_price: 'Precio antiguo',
            new_price: 'Precio nuevo',
            refresh: 'Recargar',
            'search-product': 'Buscar un producto',
            img: 'Img',
            product: 'Producto',
            store: 'Tienda',
            stockage: 'Almacenamiento',
            total: 'Total',
            marketPrice: 'Precio de compra',
            yourPrice: 'Tu precio',
            averageCost: 'Costo promedio',
            winRate: 'Ganancia',
            moreInfo: 'Más información',
          },
        },
      },
      de: {
        translation: {
          helloWorld: 'Hallo Welt <3',
          ty: 'Danke @loup13 für die Übersetzung. Entwickelt von @nolyoShifumi',
          description:
            'Dieses Produkt wurde entwickelt, um Ihnen bei der Verwaltung Ihres Lagerbestands im Supermarkt-Simulationsspiel zu helfen.',
          stayConnect:
            'Tritt unserem Discord bei, um über Updates und Entwicklungen informiert zu werden',
          generalData: {
            title: 'Allgemeine Daten',
            storage: 'Lagerung',
            employees: 'Mitarbeiter',
            licenses: 'Lizenzen',
            invoices: 'Rechnungen',
            money: 'Geld',
            cashiers: 'Sie haben {{count}} Kassierer',
            restocker: ' und {{count}} Auffüller',
            noCashiers: 'Sie haben keine Kassierer ❌',
            noRestockers: 'Sie haben keine Auffüller ❌',
            licence: 'Sie haben {{count}} freigeschaltete Lizenz(en)',
            noLicence: 'Sie haben keine freigeschaltete Lizenz ❌',
            billsAndRent:
              'Sie haben {{bills}} Rechnung(en) und {{rents}} Miete(n) zu zahlen',
          },
          products: {
            title: 'Produkte',
            price_changed: 'Preisänderung des Tages',
            old_price: 'Alter Preis',
            new_price: 'Neuer Preis',
            refresh: 'Neu laden',
            'search-product': 'Suche ein Produkt',
            img: 'Bild',
            product: 'Produkt',
            store: 'Geschäft',
            stockage: 'Lagerung',
            total: 'Gesamt',
            marketPrice: 'Kaufpreis',
            yourPrice: 'Ihr Preis',
            averageCost: 'Durchschnittskosten',
            winRate: 'Gewinn',
            moreInfo: 'Mehr Infos',
          },
        },
      },
    },
    fallbackLng: ['en', 'fr', 'es', 'de'],

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
