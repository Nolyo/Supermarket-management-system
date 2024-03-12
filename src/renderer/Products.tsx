import React, { useEffect, useState } from 'react';
import { AssociatedItem } from '../main/type';

type GeneralDataProps = {
  associated: AssociatedItem;
};
export default function Products(props: GeneralDataProps) {
  const { associated } = props;
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState<AssociatedItem>({});

  useEffect(() => {
    const filteredA = Object.keys(associated).reduce((acc, key) => {
      const item = associated[parseInt(key, 10)];
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
      <div
        className="flex"
        style={{ justifyContent: 'space-between', margin: 0 }}
      >
        <h1>Products</h1>
        <div className="blue">
          <button type="button" onClick={handleRefresh}>
            Refresh
          </button>
        </div>
        <div>
          <input
            className="search-input"
            type="search"
            value={search}
            placeholder="Search a product"
            onChange={handleSearch}
          />
        </div>
      </div>
      <table className="table">
        <thead>
          <tr className="table-row">
            <th>Img</th>
            <th>Product</th>
            <th>Store</th>
            <th>Stockage</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(filtered).map((key) => {
            const item = filtered[parseInt(key, 10)];
            return (
              <tr className="table-row" key={key}>
                <td>
                  <img src={item.item.img} alt="" />
                </td>
                <td>
                  {item.item.brand} {item.item.name}
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
