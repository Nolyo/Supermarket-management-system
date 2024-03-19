import { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import items from '../../../.erb/scripts/items.json';
import { AssociatedItems, OrderBy, lngType } from '../../main/type';
import QuantityRowTable from '../components/QuantityRowTable';
import HeadQuantity from '../components/HeadQuantity';

type PropsType = {
  associated: AssociatedItems;
  countStore: boolean;
  orderBy: OrderBy;
  userLng: lngType;
  setCountStore: (arg0: boolean) => void;
  setOrderBy: (arg0: OrderBy) => void;
};

export default function Quantity(props: PropsType) {
  const {
    associated,
    countStore,
    setCountStore,
    orderBy,
    setOrderBy,
    userLng,
  } = props;
  const { t } = useTranslation();
  const [showHelp, setShowHelp] = useState<boolean>(false);

  // Click on Save or press enter in form
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const inputs = document.querySelectorAll('.set-quantity');
    const itemsQuantities: { id: string; quantity: string }[] = [];

    inputs.forEach((input, index) => {
      itemsQuantities.push({
        id: items[index].id,
        quantity: (input as HTMLInputElement).value,
      });
    });
    window.electron.ipcRenderer.sendMessage('set-quantity', itemsQuantities);
  }

  const Tbody = () => {
    return associated.map((asso) => {
      if (!asso.userPrice) return null;
      return (
        <QuantityRowTable key={asso.item.id} userLng={userLng} asso={asso} />
      );
    });
  };

  return (
    <div className="quantity">
      <h1 className="center">{t('quantity.title')}</h1>
      <div className="flex">
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="btn-help"
          type="button"
        >
          {t('quantity.helpTitle')}
        </button>
      </div>
      {showHelp && (
        <div
          className="flex"
          // eslint-disable-next-line
          dangerouslySetInnerHTML={{ __html: t('quantity.help') }}
        />
      )}
      <form onSubmit={handleSubmit}>
        <HeadQuantity
          countStore={countStore}
          setCountStore={setCountStore}
          orderBy={orderBy}
          setOrderBy={setOrderBy}
        />
        <table className="table">
          <thead>
            <tr>
              <th>{t('products.img')}</th>
              <th>{t('products.product')}</th>
              <th>{t('quantity.perBox')}</th>
              <th>{t('quantity.desiredQuantity')}</th>
              <th>{t('products.stockage')}</th>
              <th>{t('quantity.toBuy')}</th>
            </tr>
          </thead>
          <tbody>
            <Tbody />
          </tbody>
        </table>
      </form>
    </div>
  );
}
