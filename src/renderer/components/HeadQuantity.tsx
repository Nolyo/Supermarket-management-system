import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import items from '../../../.erb/scripts/items.json';
import { OrderBy } from '../../main/type';

type Props = {
  countStore: boolean;
  setCountStore: (arg0: boolean) => void;
  setOrderBy: (arg0: OrderBy) => void;
  orderBy: OrderBy;
};
export default function HeadQuantity(props: Props) {
  const { countStore, setCountStore, setOrderBy, orderBy } = props;
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { t } = useTranslation();
  const list = [
    { action: 'half-slot', name: 'quantity.halfSlot' },
    { action: 'slot', name: 'quantity.fullSlot' },
    { action: 'shelf', name: 'quantity.fullShelf' },
    { action: 'rack', name: 'quantity.fullRack' },
  ];

  useEffect(() => {
    if (window.electron) {
      window.electron.ipcRenderer.on('set-quantity', async (arg) => {
        if (!arg) {
          setError('Error while save quantity');
        } else {
          setSuccess('Quantity saved');
          window.electron.ipcRenderer.sendMessage('get-quantity');
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

  function setCustom() {
    const input = window.document.querySelector('.all-quantity');
    handleSetAllItems(parseInt((input as HTMLInputElement).value, 10) || 0);
  }

  return (
    <div className="line">
      <div>
        {list.map((btn) => {
          return (
            <button
              key={btn.action}
              onClick={() => handleSetAllItems(btn.action)}
              type="button"
            >
              {t(btn.name)}
            </button>
          );
        })}
        <input
          onChange={setCustom}
          type="number"
          className="all-quantity"
          placeholder={t('quantity.quantity')}
        />
        <button type="submit" className="btn-primary">
          {t('quantity.save')}
        </button>
        <label htmlFor="countStore">
          {t('quantity.countStore')}
          <input
            id="countStore"
            type="checkbox"
            checked={countStore}
            onChange={() => setCountStore(!countStore)}
          />
        </label>
      </div>
      <div>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <select
          name="orderBy"
          id="orderBy"
          value={orderBy}
          onChange={(e) => setOrderBy(e.target.value as OrderBy)}
        >
          <option aria-label="Default" value="default">
            Default
          </option>
          <option aria-label="Box to buy" value="box">
            Box To buy
          </option>
          <option aria-label="Name" value="name">
            Name
          </option>
        </select>
      </div>
    </div>
  );
}
