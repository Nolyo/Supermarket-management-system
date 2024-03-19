import { useState } from 'react';
import { AssociatedItem, lngType } from '../../main/type';

type props = {
  userLng: lngType;
  asso: AssociatedItem;
};

export default function QuantityRowTable(props: props) {
  const { userLng, asso } = props;
  const { item } = asso;
  const [quantityByUser, setQuantityByUser] = useState<string>(
    asso.quantityByUser.toString(),
  );

  return (
    <tr>
      <td>
        <img width={60} src={item.img} alt={item.name.fr} />
      </td>
      <td>
        {item.name[userLng]} {item.brand}
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
      <td>{asso?.stockage}</td>
      <td>{asso?.boxToBuy}</td>
    </tr>
  );
}
