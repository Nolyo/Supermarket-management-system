import { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import items from '../../../.erb/scripts/items.json';
import quantityUser from '../../../.erb/scripts/quantity_by_user.json';
import { AssociatedItems, lngType } from '../../main/type';
import QuantityRowTable from '../components/QuantityRowTable';

type PropsType = {
  associated: AssociatedItems;
};

export default function Quantity(props: PropsType) {
  const { associated } = props;
  const [userLng, setUserLng] = useState<lngType>('en');
  const { i18n } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [countStore, setCountStore] = useState<boolean>(false);

  const list = [
    { action: 'half-slot', name: 'Half Slot' },
    { action: 'slot', name: 'Full Slot' },
    { action: 'shelf', name: 'Full Shelfe' },
    { action: 'rack', name: 'Full Rack Slot' },
  ];

  useEffect(() => {
    const lng = i18n.language;
    if (!['en', 'fr', 'es', 'de', 'nl', 'it'].includes(lng)) {
      i18n.changeLanguage('en');
      setUserLng('en');
    } else {
      setUserLng(lng as lngType);
    }
  }, [i18n]);

  useEffect(() => {
    if (window.electron) {
      window.electron.ipcRenderer.on('quantity', async (arg) => {
        if (!arg) {
          setError('Error while save quantity');
        } else {
          setSuccess('Quantity saved');
        }
      });
    }
  }, []);

  useEffect(() => {
    if (success) {
      window.setTimeout(() => setSuccess(null), 5000);
    }
    if (error) {
      window.setTimeout(() => setError(null), 5000);
    }
  }, [success, error]);

  // Click on Half or Fullbox
  function handleSetAllItems(value: number | string) {
    window.document
      .querySelectorAll('.set-quantity')
      .forEach((input, index) => {
        if (typeof value === 'number') {
          (input as HTMLInputElement).value = value.toString();
        } else {
          const currentItem = items[index];
          let size = 18;
          if (currentItem.size === '1') {
            size = 6;
          }
          if (currentItem.size === '2') {
            size = 2;
          }
          if (currentItem.size === '3') {
            size = 1;
          }
          if (currentItem.size === '4') {
            size = 1;
          }
          if (currentItem.size === '5') {
            size = 2;
          }
          if (value === 'half-slot') {
            size = Math.ceil(size / 2);
          } else if (value === 'shelf') {
            size = Math.ceil(size * 2);
          } else if (value === 'rack') {
            size = Math.ceil(size * 8);
          }
          (input as HTMLInputElement).value = size.toString();
        }
      });
  }

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
    window.electron.ipcRenderer.sendMessage('quantity', itemsQuantities);
  }

  // ClicK on Set Button
  function setCustom() {
    const input = window.document.querySelector('.all-quantity');
    handleSetAllItems(parseInt((input as HTMLInputElement).value, 10) || 0);
  }

  const Tbody = () => {
    return items.map((item) => {
      const asso = associated.find((ass) => ass.item.id === item.id);
      return (
        <QuantityRowTable
          key={item.id}
          item={item}
          userLng={userLng}
          asso={asso}
          countStore={countStore}
        />
      );
    });
  };

  return (
    <div className="quantity">
      <h1 className="center">Set your quantity</h1>
      <form onSubmit={handleSubmit}>
        <div className="line">
          <div>
            {list.map((nb) => {
              return (
                <button
                  key={nb.action}
                  onClick={() => handleSetAllItems(nb.action)}
                  type="button"
                >
                  {nb.name}
                </button>
              );
            })}
            <input
              onChange={setCustom}
              type="number"
              className="all-quantity"
              placeholder="Quantity"
            />
            <button type="submit" className="btn-primary">
              Save
            </button>
          </div>
          <div>
            {error && error}
            {success && <div className="success">{success}</div>}
            <label htmlFor="countStore">
              Count Store
              <input
                type="checkbox"
                checked={countStore}
                onChange={() => setCountStore(!countStore)}
              />
            </label>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Nom</th>
              <th>Par boite</th>
              <th>Desired quantity</th>
              <th>Stock</th>
              <th>To buy quantity</th>
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
