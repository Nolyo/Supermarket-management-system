import SaveFileType, { AssociatedItem } from '../main/type';

export default function formatDollar(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

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
}
