import { useEffect, useState } from 'react';

import Products from './Products';
import GeneralData from './GeneralData';
import SaveFileType, {
  AssociatedItem,
  DisplayedProductData,
  Item,
  RackData,
} from '../main/type';
import items from '../../.erb/scripts/items.json';
import { associatePriceToItem } from './utils';
import './App.css';
import Navbar from './components/Navbar';

function associateProductsAndItems(
  products: DisplayedProductData,
  type = 'rack',
  associated: AssociatedItem = {},
) {
  /* eslint-disable */
  for (const id in products) {
    const item = items.find((item) => item.id === id);
    if (!item) continue;
    //Si associated existe deja on ajoute la clé storeCount ou rackCount selon le type
    if (associated[parseInt(id)]) {
      if (type === 'store') {
        associated[parseInt(id)].storeCount = products[id];
      } else {
        associated[parseInt(id)].rackCount = products[id];
      }
    } else {
      let obj: { rackCount?: number; item: Item; storeCount?: number } = {
        item,
        rackCount: 0,
        storeCount: 0,
      };
      if (type === 'store') {
        obj.storeCount = products[id];
      } else {
        obj.rackCount = products[id];
      }
      associated[parseInt(id, 10)] = obj;
    }
  }
  /* eslint-enable */
  return associated;
}

function countItemInStore(saveFile: SaveFileType, associated: AssociatedItem) {
  const raw = saveFile.Progression.value.DisplayedProductData;
  if (!raw) return associated;
  const allAssociated = associateProductsAndItems(raw, 'store', associated);

  return allAssociated;
}

function countItemInRack(saveFile: SaveFileType) {
  const rack = saveFile.Progression.value.RackDatas;
  const products: { [key: number]: number } = {};
  rack?.forEach((floor: RackData) => {
    floor.RackSlots.forEach((slot) => {
      slot.RackedBoxDatas.forEach((box) => {
        if (products[box.ProductID]) {
          products[box.ProductID] += box.ProductCount;
        } else {
          products[box.ProductID] = box.ProductCount;
        }
      });
    });
  });
  // Associer les produits et les items
  const associated = associateProductsAndItems(products);

  return associated;
}

function countItemOnFloor(saveFile: SaveFileType, associated: AssociatedItem) {
  const floorBoxs = saveFile.Progression.value.BoxDatas;
  const raw: { [key: number]: number } = {};

  if (!floorBoxs) return associated;

  floorBoxs.forEach((floor) => {
    raw[floor.ProductID] = floor.ProductCount;
  });

  const allAssociated = associateProductsAndItems(raw, 'rack', associated);

  return allAssociated;
}

function sortObjectsBySum(objects: AssociatedItem) {
  return Object.entries(objects)
    .map(([id, item]) => ({
      id,
      sum: (item.storeCount || 0) + (item.rackCount || 0),
    }))
    .sort((a, b) => a.sum - b.sum)
    .map(({ id }) => objects[parseInt(id, 10)]);
}

function Home() {
  const [raw, setRow] = useState<SaveFileType | null>(null);
  const [associated, setAssociated] = useState<AssociatedItem>({});
  const [show, setShow] = useState<'general' | 'products'>('products');

  const reloadData = () => {
    if (window.electron) {
      // calling IPC exposed from preload script
      window.electron.ipcRenderer.on('get-save-file', async (arg) => {
        const bdata = await JSON.parse(arg as string);
        setRow(bdata);
      });
      window.electron.ipcRenderer.sendMessage('get-save-file');
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  useEffect(() => {
    if (raw) {
      const inRack = countItemInRack(raw);
      const onFloorAndRack = countItemOnFloor(raw, inRack);
      const data = countItemInStore(raw, onFloorAndRack);
      associatePriceToItem(raw, data);
      setAssociated(sortObjectsBySum(inRack));
      // eslint-disable-next-line no-console
      console.log('Associated items and count:', inRack);
    }
  }, [raw]);

  if (!raw) {
    return false;
  }

  return (
    <>
      <Navbar setShow={setShow} show={show} />
      {show === 'products' && <Products data={raw} associated={associated} />}
      {show === 'general' && <GeneralData data={raw} />}
    </>
  );
}

export default Home;
