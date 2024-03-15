import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import discord from '../../../assets/discord.svg';

type NavbarType = {
  show: 'general' | 'products';
  setShow: Dispatch<SetStateAction<'general' | 'products'>>;
};

export default function Navbar(props: NavbarType) {
  const { show, setShow } = props;
  const [active, setActive] = useState<'general' | 'products' | 'quantity'>(
    'general',
  );
  const { t } = useTranslation();
  const route = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    if (pathname === 'quantity') {
      setActive('quantity');
    } else if (show === 'general') {
      setActive('general');
    } else {
      setActive('products');
    }
  }, [pathname, show]);

  function handleClick(type: 'general' | 'products') {
    setShow(type);
    route('/');
  }

  return (
    <div className="navbar">
      <div>
        <button
          onClick={() => handleClick('general')}
          className={active === 'general' ? 'active' : ''}
          type="button"
        >
          {t('generalData.title')}
        </button>
        <button
          onClick={() => handleClick('products')}
          className={active === 'products' ? 'active' : ''}
          type="button"
        >
          {t('products.title')}
        </button>

        <button
          onClick={() => route('/quantity')}
          className={active === 'quantity' ? 'active' : ''}
          type="button"
        >
          {t('Quantity')}
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
