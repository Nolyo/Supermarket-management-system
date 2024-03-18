import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import discord from '../../../assets/discord.svg';

export default function Navbar() {
  const [active, setActive] = useState<'general' | 'products' | 'quantity'>(
    'general',
  );
  const { t } = useTranslation();
  const route = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    if (pathname === '/quantity') {
      setActive('quantity');
    } else if (pathname === '/general') {
      setActive('general');
    } else {
      setActive('products');
    }
  }, [pathname]);

  return (
    <div className="navbar">
      <div>
        <button
          onClick={() => route('/general')}
          className={active === 'general' ? 'active' : ''}
          type="button"
        >
          {t('navbar.generalData')}
        </button>

        <button
          onClick={() => route('/products')}
          className={active === 'products' ? 'active' : ''}
          type="button"
        >
          {t('navbar.products')}
        </button>

        <button
          onClick={() => route('/quantity')}
          // onClick={() => alert('Soon')}
          className={active === 'quantity' ? 'active' : ''}
          type="button"
        >
          {t('navbar.quantity')}
        </button>

        <button
          onClick={() => window.electron.ipcRenderer.sendMessage('reload')}
          // onClick={() => alert('Soon')}
          type="button"
        >
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
