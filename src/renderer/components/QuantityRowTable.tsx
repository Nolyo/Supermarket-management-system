import { useEffect, useState } from 'react';
import { AssociatedItem, Item, lngType } from '../../main/type';

type props = {
  userLng: lngType;
  item: Item;
  asso: AssociatedItem | undefined;
  countStore: boolean;
  quantityUserRaw: { id: string; quantity: string }[] | null;
};

export default function QuantityRowTable(props: props) {
  const { userLng, item, asso, countStore, quantityUserRaw } = props;
  const [quantityByUser, setQuantityByUser] = useState<string>('0');
  const [stockage, setStockage] = useState(0);

  useEffect(() => {
    const a = quantityUserRaw?.find((q) => q.id === item.id);
    setQuantityByUser(a?.quantity || '0');
  }, [item.id, quantityUserRaw]);

  useEffect(() => {
    let total = asso?.rackCount || 0;
    if (countStore) {
      total += asso?.storeCount || 0;
    }
    setStockage(total);
  }, [asso, countStore]);

  function calculateQuantity() {
    // Extraire le nombre après le 'x' dans item.quantity
    const quantity = parseInt(item.quantity.replace('x', ''), 10);

    // Calculer le produit de quantityByUser et quantity
    const totalQuantity = parseInt(quantityByUser, 10) * quantity;

    let toBuy = Math.floor((totalQuantity - stockage) / quantity);

    if (toBuy < 0) {
      toBuy = 0;
    }

    return (
      <span>
        {toBuy} {toBuy > 1 ? 'boxes' : 'box'}
      </span>
    );
  }

  return (
    <tr>
      <td>
        <img width={60} src={item.img} alt={item.name.fr} />
      </td>
      <td>
        {(item.name as { [key: string]: string })[userLng]} {item.brand}
      </td>
      <td>{item.quantity}</td>
      <td>
        <input
          type="number"
          className="set-quantity"
          value={quantityByUser}
          onChange={(e) => setQuantityByUser(e.target.value)}
          min={0}
        />
      </td>
      <td>{stockage}</td>
      <td>{calculateQuantity()}</td>
    </tr>
  );
}
