import React, { useEffect, useState } from 'react';
import SaveFileType, { AssociatedItem, Item } from '../main/type';
import Card from './components/Card';
import items from '../../.erb/scripts/items.json';
import upArrowRed from '../../assets/up-arrow-red.svg';
import downArrowGreen from '../../assets/down-arrow-green.svg';
import { useTranslation } from 'react-i18next';
import formatDollar from './utils';

type GeneralDataProps = {
  data: SaveFileType;
  associated: AssociatedItem;
};
export default function Products(props: GeneralDataProps) {
  const { associated, data } = props;
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState<AssociatedItem>({});
  const [userLng, setUserLng] = useState('en');
  const priceChangeds = data.Price.value.DailyPriceChanges;
  /* eslint-disable */
  const priceChangedElement = Object.keys(priceChangeds).map((i) => {
    const price = priceChangeds?.[parseInt(i, 10)];

    const item: Item | undefined = items.find((it) => it.id == price.ProductID);
    const oldPrice = data.Price.value.PreviousPrices?.find(
      (old) => old.ProductID == parseInt(item?.id || '0'),
    );
    const newPrice = data.Price.value.Prices?.find(
      (old) => old.ProductID == parseInt(item?.id || '0'),
    );
    if (!item || !oldPrice || !newPrice) {
      return false;
    }

    return (
      <Card
        title={
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              alignItems: 'center',
              padding: '5px 0',
              fontSize: '0.8em',
            }}
          >
            <div>
              {oldPrice?.Price > newPrice?.Price ? (
                <img width={20} src={downArrowGreen} alt="price down" />
              ) : (
                <img width={20} src={upArrowRed} alt="price up" />
              )}
            </div>
            <span>{userLng === 'en' ? item.en_name : item.name}</span>
          </div>
        }
        content={
          <div className="flex">
            <ul>
              <li>
                {t('products.old_price')}: {formatDollar(oldPrice?.Price)}
              </li>
              <li>
                {t('products.new_price')}: {formatDollar(newPrice?.Price)}
              </li>
            </ul>
          </div>
        }
      />
    );
    /* eslint-enable */
  });

  useEffect(() => {
    const lng = i18n.language;
    setUserLng(lng);
  }, [i18n]);

  useEffect(() => {
    const filteredA = Object.keys(associated).reduce((acc, key) => {
      const item = associated[parseInt(key, 10)];
      if (!item.item) {
        return acc;
      }
      if (
        item.item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.item.brand.toLowerCase().includes(search.toLowerCase())
      ) {
        acc[key] = item;
      }
      return acc;
    }, {} as AssociatedItem);
    setFiltered(filteredA);
  }, [search, associated]);

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  function handleRefresh() {
    if (window.electron) {
      window.electron.ipcRenderer.sendMessage('reload');
    }
  }

  return (
    <div className="align">
      <div>
        <h2>{t('products.price_changed')}</h2>
        <div className="flex">{priceChangedElement}</div>
      </div>
      <div
        className="flex"
        style={{ justifyContent: 'space-between', margin: 0 }}
      >
        <h1>{t('products.product')}</h1>
        <div className="blue">
          <button type="button" onClick={handleRefresh}>
            {t('products.refresh')}
          </button>
        </div>
        <div>
          <input
            className="search-input"
            type="search"
            value={search}
            placeholder={t('products.search-product')}
            onChange={handleSearch}
          />
        </div>
      </div>
      <table className="table">
        <thead>
          <tr className="table-row">
            <th>{t('products.img')}</th>
            <th>{t('products.product')}</th>
            <th>{t('products.store')}</th>
            <th>{t('products.stockage')}</th>
            <th>{t('products.total')}</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(filtered).map((key) => {
            const item = filtered[parseInt(key, 10)];
            return (
              <tr className="table-row" key={key}>
                <td>
                  <img
                    width={80}
                    height={80}
                    style={{
                      objectFit: 'contain',
                    }}
                    src={item.item.img}
                    alt=""
                  />
                </td>
                <td>
                  {userLng === 'en' ? item.item.en_name : item.item.name}{' '}
                  {item.item.brand}
                </td>
                <td>{item.storeCount || 0}</td>
                <td>{item.rackCount || 0}</td>
                <td>{(item.rackCount || 0) + (item.storeCount || 0)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
