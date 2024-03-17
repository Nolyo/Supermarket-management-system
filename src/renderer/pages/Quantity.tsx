import { FormEvent } from 'react';
import items from '../../../.erb/scripts/items.json';
import { AssociatedItem } from '../../main/type';

export default function Quantity() {
  const list = [1, 2, 5, 10, 'half', 'full'];

  // function handleChange(item: AssociatedItem, value: string) {
  //   console.log(item, parseInt(value, 10));
  // }

  function handleSetAllItems(value: number | string) {
    window.document.querySelectorAll('.set-quantity').forEach((input) => {
      if (typeof value === 'number') {
        (input as HTMLInputElement).value = value.toString();
      } else {
        console.log(value);
      }
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const inputs = document.querySelectorAll('.set-quantity');
    const itemsQuantities = [];
    inputs.forEach((input, index) => {
      console.log(items[index].name.fr, (input as HTMLInputElement).value);
    });
  }

  return (
    <div className="quantity">
      <h1 className="center">Set your quantity</h1>
      <form onSubmit={handleSubmit}>
        <div className="line">
          <div>
            {list.map((nb) => {
              return (
                <button
                  key={nb}
                  onClick={() => handleSetAllItems(nb)}
                  type="button"
                >
                  {nb} {nb === 1 ? 'box' : 'boxes'}
                </button>
              );
            })}
            <input
              type="number"
              className="all-quantity"
              placeholder="Quantity"
            />
            <button className="btn-primary" type="button">
              Set
            </button>
          </div>
          <button type="submit" className="btn-primary">
            Save
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Nom</th>
              <th>Par boite</th>
              <th>Desired quantity</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <img width={60} src={item.img} alt={item.name.fr} />
                </td>
                <td>
                  {item.name.fr} {item.brand}
                </td>
                <td>{item.quantity}</td>
                <td>
                  <input
                    onChange={(e) => handleChange(item, e.target.value)}
                    type="number"
                    className="set-quantity"
                    min={0}
                    max={50}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </form>
    </div>
  );
}
