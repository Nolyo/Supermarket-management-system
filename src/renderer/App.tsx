import { useCallback, useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import SaveFileType, { AssociatedItem } from '../main/type';

import {
  associatePriceToItem,
  countItemInRack,
  countItemInStore,
  countItemOnFloor,
  setLog,
  sortObjectsBySum,
} from './utils';

import Bye from './pages/Bye';
import Objective from './pages/Quantity';
import Navbar from './components/Navbar';
import Products from './Products';
import GeneralData from './pages/GeneralData';
import './App.css';

export default function App() {
  const [row, setRow] = useState<SaveFileType | null>(null);
  const [associated, setAssociated] = useState<AssociatedItem>({});
  const [error, setError] = useState<string | null>(null);

  const reloadData = useCallback(() => {
    setLog('Starting client request for reading save file');
    if (window.electron) {
      window.electron.ipcRenderer.on('get-save-file', async (arg) => {
        const bdata: SaveFileType = await JSON.parse(arg as string);
        if (bdata?.Progression === undefined) {
          setError('Error loading saveFile.es3');
        }
        setRow(bdata);
        setLog('File received in client');
      });
      window.electron.ipcRenderer.sendMessage('get-save-file');
    }
  }, []);

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  useEffect(() => {
    if (row) {
      const inRack = countItemInRack(row);
      const onFloorAndRack = countItemOnFloor(row, inRack);
      const data = countItemInStore(row, onFloorAndRack);
      const a = associatePriceToItem(row, data);
      setAssociated(sortObjectsBySum(a));
      // eslint-disable-next-line no-console
      console.log('Associated items and count:', a);
    }
  }, [row]);

  if (error) {
    return <div className="flex error">{error}</div>;
  }

  if (!row) {
    return false;
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={<Products associated={associated} data={row} />}
        />
        <Route
          path="/products"
          element={<Products associated={associated} data={row} />}
        />
        <Route path="/general" element={<GeneralData data={row} />} />
        <Route path="/quantity" element={<Objective />} />
        <Route path="/bye" element={<Bye />} />
      </Routes>
    </Router>
  );
}
