import { useTranslation } from 'react-i18next';
import SaveFileType, { Item, lngType } from '../../main/type';
import Card from './Card';
import items from '../../../.erb/scripts/items.json';
import upArrowRed from '../../../assets/up-arrow-red.svg';
import downArrowGreen from '../../../assets/down-arrow-green.svg';
import formatDollar from '../utils';

type PriceChangedType = {
  data: SaveFileType;
  userLng: lngType;
};
export default function PriceChanged(props: PriceChangedType) {
  const { data, userLng } = props;
  const { t } = useTranslation();
  const priceChangeds = data.Price.value.DailyPriceChanges || [];
  const priceChangedElement = priceChangeds.map((price) => {
    const item: Item | undefined = items.find(
      (it) => parseInt(it.id, 10) === price.ProductID,
    );
    const oldPrice = data.Price.value.PreviousPrices?.find(
      (old) => old.ProductID === parseInt(item?.id || '0', 10),
    );
    const newPrice = data.Price.value.Prices?.find(
      (old) => old.ProductID === parseInt(item?.id || '0', 10),
    );
    const userPrice = data.Price.value.PricesSetByPlayer?.find(
      (p) => p.ProductID === parseInt(item?.id || '0', 10),
    );

    if (!item || !oldPrice || !newPrice || !userPrice) {
      return false;
    }

    return (
      <Card
        key={item.id}
        title={
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              alignItems: 'center',
              padding: '5px 0',
              fontSize: '0.8em',
              gap: '5px',
            }}
          >
            <div>
              {oldPrice?.Price > newPrice?.Price ? (
                <img width={20} src={downArrowGreen} alt="price down" />
              ) : (
                <img width={20} src={upArrowRed} alt="price up" />
              )}
            </div>
            <span>
              {item.name[userLng]}
              {item.brand}
            </span>
          </div>
        }
        content={
          <div className="flex">
            <img width={60} src={item.img} alt="price up" />
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
  });

  return <div className="flex">{priceChangedElement}</div>;
}
