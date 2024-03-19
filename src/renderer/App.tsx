import { useCallback, useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import SaveFileType, {
  AssociatedItems,
  OrderBy,
  QuantityUserFile,
  lngType,
} from '../main/type';

import { makeAssociatedItems, setLog } from './utils';

import Bye from './pages/Bye';
import Objective from './pages/Quantity';
import Navbar from './components/Navbar';
import Products from './Products';
import GeneralData from './pages/GeneralData';
import './App.css';

export default function App() {
  const { i18n } = useTranslation();

  const [saveFile, setSaveFile] = useState<SaveFileType | null>(null);
  const [quantityUserFile, setQuantityFile] = useState<QuantityUserFile[]>([]);
  const [associated, setAssociated] = useState<AssociatedItems>([]);
  const [error, setError] = useState<string | null>(null);
  const [countStore, setCountStore] = useState<boolean>(false);
  const [orderBy, setOrderBy] = useState<OrderBy>('default');
  const [userLng, setUserLng] = useState<lngType>('en');

  const reloadData = useCallback(() => {
    setLog('Starting client request for reading save file');
    if (window.electron) {
      window.electron.ipcRenderer.sendMessage('get-save-file');
      window.electron.ipcRenderer.sendMessage('get-quantity');
    }
  }, []);

  useEffect(() => {
    if (window.electron) {
      window.electron.ipcRenderer.on('get-save-file', async (arg) => {
        const bdata: SaveFileType = await JSON.parse(arg as string);
        if (bdata?.Progression === undefined) {
          setError('Error loading saveFile.es3');
        }
        setSaveFile(bdata);
        setLog('File received in client');
      });
      window.electron.ipcRenderer.on('get-quantity', async (arg) => {
        const data: { id: string; quantity: string }[] = JSON.parse(
          arg as string,
        );
        setQuantityFile(data);
      });
      reloadData();
    } else {
      reloadData();
    }
  }, [reloadData]);

  /**
   * When saveFile is load or reload
   * Construct object associated
   */
  useEffect(() => {
    if (saveFile) {
      const sorted = makeAssociatedItems(
        saveFile,
        quantityUserFile,
        countStore,
      );
      setAssociated(sorted);
    }
  }, [saveFile, quantityUserFile, countStore]);

  useEffect(() => {
    setAssociated((currentAssociated) => {
      const toSort = [...currentAssociated]; // create a copy to avoid mutating state directly
      if (orderBy === 'box') {
        toSort.sort((a, b) => {
          if (a.boxToBuy > b.boxToBuy) return -1;
          if (a.boxToBuy < b.boxToBuy) return 1;
          return 0;
        });
      } else if (orderBy === 'name') {
        toSort.sort((a, b) => {
          if (a.item.name[userLng] > b.item.name[userLng]) return 1;
          if (a.item.name[userLng] < b.item.name[userLng]) return -1;
          return 0;
        });
      } else {
        reloadData();
      }
      return toSort;
    });
  }, [orderBy, userLng, reloadData]);

  useEffect(() => {
    const lng = i18n.language;
    if (!['en', 'fr', 'es', 'de', 'nl', 'it'].includes(lng)) {
      i18n.changeLanguage('en');
      setUserLng('en');
    } else {
      setUserLng(lng as lngType);
    }
  }, [i18n]);

  if (error) {
    return <div className="flex error">{error}</div>;
  }

  if (!saveFile || !associated) {
    return false;
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={<Products associated={associated} data={saveFile} />}
          // element={<Objective associated={associated} />}
        />
        <Route
          path="/products"
          element={<Products associated={associated} data={saveFile} />}
        />
        <Route path="/general" element={<GeneralData data={saveFile} />} />
        <Route
          path="/quantity"
          element={
            <Objective
              associated={associated}
              setCountStore={setCountStore}
              countStore={countStore}
              orderBy={orderBy}
              setOrderBy={setOrderBy}
            />
          }
        />
        <Route path="/bye" element={<Bye />} />
      </Routes>
    </Router>
  );
}
