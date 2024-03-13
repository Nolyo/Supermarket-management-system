import { useEffect, useState } from 'react';

import Products from './Products';
import GeneralData from './GeneralData';
import SaveFileType, {
  AssociatedItem,
  DisplayedProductData,
  RackData,
} from '../main/type';
import './App.css';
import items from '../../.erb/scripts/items.json';
import shoppingCart from '../../assets/cart-shopping-solid.svg';
import circleInfo from '../../assets/circle-info-solid.svg';

function associateProductsAndItems(
  products: DisplayedProductData,
  type = 'rack',
  associated: AssociatedItem = {},
) {
  /* eslint-disable */
  for (const id in products) {
    const item = items.find((item) => item.id === id);
    //Si associated existe deja on ajoute la clé storeCount ou rackCount selon le type
    if (associated[id]) {
      if (type === 'store') {
        associated[id].storeCount = products[id];
      } else {
        associated[id].rackCount = products[id];
      }
    } else {
      let obj;
      if (type === 'store') {
        obj = {
          storeCount: products[id],
          item,
        };
      } else {
        obj = {
          rackCount: products[id],
          item,
        };
      }
      associated[id] = obj;
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
  const next = countItemInStore(saveFile, associated);

  return next;
}

function sortObjectsBySum(objects) {
  return Object.entries(objects)
    .map(([id, item]) => ({
      id,
      sum: (item.storeCount || 0) + (item.rackCount || 0),
    }))
    .sort((a, b) => a.sum - b.sum)
    .map(({ id }) => objects[id]);
}

function Home() {
  const [raw, setRow] = useState<SaveFileType | null>(null);
  const [associated, setAssociated] = useState<AssociatedItem>({});
  const [show, setShow] = useState<'general' | 'products'>('products');
  useEffect(() => {
    if (window.electron) {
      // calling IPC exposed from preload script
      window.electron.ipcRenderer.on('get-save-file', async (arg) => {
        const bdata = await JSON.parse(arg as string);
        setRow(bdata);
      });
      window.electron.ipcRenderer.sendMessage('get-save-file');
    }
  }, []);

  useEffect(() => {
    if (raw) {
      const data = countItemInRack(raw);
      // eslint-disable-next-line no-console
      console.log('Associated items and count:', data);
      setAssociated(sortObjectsBySum(data));
    }
  }, [raw]);

  if (!raw) {
    return false;
  }

  return (
    <div>
      <div className="navbar">
        <button
          type="button"
          onClick={() => setShow('general')}
          className={show === 'general' ? 'active' : ''}
        >
          <img width={48} src={circleInfo} alt="text" />
        </button>
        <button
          className={show === 'products' ? 'active' : ''}
          type="button"
          onClick={() => setShow('products')}
        >
          <img width={48} src={shoppingCart} alt="text" />
        </button>
      </div>
      {show === 'products' && <Products data={raw} associated={associated} />}
      {show === 'general' && <GeneralData data={raw} />}
    </div>
  );
}

export default Home;
