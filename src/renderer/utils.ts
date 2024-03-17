import SaveFileType, {
  AssociatedItem,
  DisplayedProductData,
  Item,
  RackData,
} from '../main/type';
import items from '../../.erb/scripts/items.json';

export default function formatDollar(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export function setLog(arg: string) {
  window.electron.ipcRenderer.sendMessage('log', arg);
}

// Order et count products

export function associatePriceToItem(
  saveFile: SaveFileType,
  datas: AssociatedItem,
) {
  Object.keys(datas).map((data) => {
    const currentId = parseInt(data, 10);
    const allPrices = saveFile.Price.value;
    const associatedItem = datas[currentId];
    const defaultPrice = { Price: 0 };

    const marketPrice =
      allPrices?.Prices?.find((p) => p.ProductID === currentId) || defaultPrice;

    const userPrice =
      allPrices?.PricesSetByPlayer?.find((p) => p.ProductID === currentId) ||
      defaultPrice;

    // const averageCost =
    //   allPrices?.AverageCosts?.find((p) => p.ProductID === currentId) ||
    //   defaultPrice;

    associatedItem.marketPrice = marketPrice.Price;
    associatedItem.userPrice = userPrice.Price;
    // associatedItem.averageCost = averageCost.Price;

    return data;
  });

  return datas;
}

export function associateProductsAndItems(
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
        let value = associated[parseInt(id)].rackCount || 0;
        value += products[id];
        associated[parseInt(id)].rackCount = value;
      }
    } else {
      let obj: { rackCount: number; item: Item; storeCount: number } = {
        item,
        rackCount: 0,
        storeCount: 0,
      };
      if (type === 'store') {
        obj.storeCount += products[id];
      } else {
        obj.rackCount += products[id];
      }
      associated[parseInt(id, 10)] = obj;
    }
  }
  /* eslint-enable */
  return associated;
}

export function countItemInStore(
  saveFile: SaveFileType,
  associated: AssociatedItem,
) {
  const raw = saveFile.Progression.value.DisplayedProductData;
  if (!raw) return associated;
  const allAssociated = associateProductsAndItems(raw, 'store', associated);

  return allAssociated;
}

export function countItemInRack(saveFile: SaveFileType) {
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

export function countItemOnFloor(
  saveFile: SaveFileType,
  associated: AssociatedItem,
) {
  const floorBoxs = saveFile.Progression.value.BoxDatas;
  const raw: { [key: number]: number } = {};

  if (!floorBoxs) return associated;

  floorBoxs.forEach((floor) => {
    if (raw[floor.ProductID]) {
      raw[floor.ProductID] += floor.ProductCount;
    } else {
      raw[floor.ProductID] = floor.ProductCount;
    }
  });

  const allAssociated = associateProductsAndItems(raw, 'rack', associated);

  return allAssociated;
}

export function sortObjectsBySum(objects: AssociatedItem) {
  return Object.entries(objects)
    .map(([id, item]) => ({
      id,
      sum: (item.storeCount || 0) + (item.rackCount || 0),
    }))
    .sort((a, b) => a.sum - b.sum)
    .map(({ id }) => objects[parseInt(id, 10)]);
}
