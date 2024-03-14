import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SaveFileType, { AssociatedItem } from '../main/type';

import PriceChanged from './components/PriceChanged';
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
  const [moreInfo, setMoreInfo] = useState<boolean>(false);

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

  function handleMoreInfo() {
    setMoreInfo(!moreInfo);
  }

  return (
    <div className="align">
      <div>
        <h2>{t('products.price_changed')}</h2>
        <PriceChanged data={data} userLng={userLng} />
      </div>
      <div
        className="flex"
        style={{ justifyContent: 'space-between', margin: 0 }}
      >
        <h1>{t('products.product')}</h1>
        <div className="flex">
          <label htmlFor="moreInfo">
            <input
              type="checkbox"
              checked={moreInfo}
              id="moreInfo"
              onChange={handleMoreInfo}
            />
            More info
          </label>
          <input
            id="searchInput"
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
            {moreInfo && (
              <>
                <th>{t('products.yourPrice')}</th>
                <th>{t('products.marketPrice')}</th>
                <th>{t('products.winRate')}</th>
                {/* <th>{t('products.averageCost')}</th> */}
              </>
            )}
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
                    alt="logo product"
                  />
                </td>
                <td>
                  {userLng === 'en' ? item.item.en_name : item.item.name}{' '}
                  {item.item.brand}
                </td>
                <td>{item.storeCount || 0}</td>
                <td>{item.rackCount || 0}</td>
                <td>{(item.rackCount || 0) + (item.storeCount || 0)}</td>
                {moreInfo && (
                  <>
                    <td>{formatDollar(item.userPrice || 0)}</td>
                    <td>{formatDollar(item.marketPrice || 0)}</td>
                    <td>
                      {formatDollar(
                        (item.userPrice || 0) - (item.marketPrice || 0),
                      )}
                    </td>
                    {/* <td>{formatDollar(item.averageCost || 0)}</td> */}
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
