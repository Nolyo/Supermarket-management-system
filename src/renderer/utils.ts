import SaveFileType, {
  AssociatedItem,
  AssociatedItems,
  DisplayedProductData,
  QuantityUserFile,
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
  datas: AssociatedItems,
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

// products = { 'id': count }[];
export function associateProductsAndItems(
  products: DisplayedProductData,
  type = 'rack',
  associated: AssociatedItems = [],
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
      let obj: AssociatedItem = {
        item,
        rackCount: 0,
        storeCount: 0,
        boxToBuy: 0,
        quantityByUser: '0',
        stockage: 0,
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
  associated: AssociatedItems,
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
  associated: AssociatedItems,
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

export function sortObjectsBySum(objects: AssociatedItems) {
  return Object.entries(objects)
    .map(([id, item]) => ({
      id,
      sum: (item.storeCount || 0) + (item.rackCount || 0),
    }))
    .sort((a, b) => a.sum - b.sum)
    .map(({ id }) => objects[parseInt(id, 10)]);
}

// Restocking
function calculateQuantity(associatedItem: AssociatedItem): number {
  // Extraire le nombre après le 'x' dans item.quantity
  const quantity = parseInt(associatedItem.item.quantity.replace('x', ''), 10);

  // Calculer le produit de quantityByUser et quantity
  const totalQuantity = parseInt(associatedItem.quantityByUser, 10) * quantity;

  const toBuy = Math.floor(
    (totalQuantity - associatedItem.stockage) / quantity,
  );

  return toBuy;
}

function addBoxToBuyToAssociatedItem(
  associatedItems: AssociatedItems,
  quantityUserFile: QuantityUserFile[],
  countStore: boolean,
): AssociatedItems {
  const assoItemsWithUserData = items.map((item) => {
    let asso = associatedItems.find((ass) => ass.item.id === item.id);
    const quantityUser = quantityUserFile?.find((q) => q.id === item.id);
    if (!asso) {
      asso = {
        item,
        rackCount: 0,
        storeCount: 0,
        boxToBuy: 0,
        quantityByUser: '0',
        stockage: 0,
      };
    }
    asso.quantityByUser = quantityUser?.quantity || '0';
    let total = asso?.rackCount || 0;
    if (countStore) {
      total += asso?.storeCount || 0;
    }
    asso.stockage = total;
    const toBuy = calculateQuantity(asso);
    asso.boxToBuy = toBuy > 0 ? toBuy : 0;

    return asso;
  });

  return assoItemsWithUserData as AssociatedItems;
}

export function makeAssociatedItems(
  saveFile: SaveFileType,
  quantityUserFile: QuantityUserFile[],
  countStore: boolean,
) {
  const inRack = countItemInRack(saveFile);
  const onFloorAndRack = countItemOnFloor(saveFile, inRack);
  const data = countItemInStore(saveFile, onFloorAndRack);
  const notSorted = associatePriceToItem(saveFile, data);
  const sorted = sortObjectsBySum(notSorted);
  const withBoxToBuy = addBoxToBuyToAssociatedItem(
    sorted,
    quantityUserFile,
    countStore,
  );

  // eslint-disable-next-line no-console
  // console.log('Associated items and count:', sorted);

  return withBoxToBuy;
}
