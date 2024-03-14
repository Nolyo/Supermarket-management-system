import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import discord from '../../../assets/discord.svg';

type NavbarType = {
  show: 'general' | 'products';
  setShow: Dispatch<SetStateAction<'general' | 'products'>>;
  reloadData: () => void;
};

export default function Navbar(props: NavbarType) {
  const { show, setShow, reloadData } = props;
  const { t } = useTranslation();

  return (
    <div className="navbar">
      <div>
        <button
          onClick={() => setShow('general')}
          className={show === 'general' ? 'active' : ''}
          type="button"
        >
          {t('generalData.title')}
        </button>
        <button
          onClick={() => setShow('products')}
          className={show === 'products' ? 'active' : ''}
          type="button"
        >
          {t('products.title')}
        </button>
        <button onClick={() => reloadData()} type="button">
          {t('products.refresh')}
        </button>
      </div>
      <Link
        title="Join our community"
        to="https://discord.gg/Fq6kykV4Je"
        target="_blank"
      >
        <div style={{ marginRight: '15px' }}>
          <img src={discord} alt="Logo discord" width={45} />
        </div>
      </Link>
    </div>
  );
}
