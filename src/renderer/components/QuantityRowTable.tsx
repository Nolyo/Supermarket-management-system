import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AssociatedItem, lngType } from '../../main/type';

type props = {
  asso: AssociatedItem;
};

export default function QuantityRowTable(props: props) {
  const { asso } = props;
  const { item } = asso;
  const { i18n } = useTranslation();
  const [userLng] = useState<lngType>(i18n.language as lngType);
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
