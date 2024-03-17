import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SaveFileType from '../../main/type';
import Card from '../components/Card';
import discord from '../../../assets/discord.svg';
import github from '../../../assets/github.svg';
import french from '../../../assets/french.svg';
import english from '../../../assets/english.svg';
import spanish from '../../../assets/es.svg';
import german from '../../../assets/de.svg';
import nl from '../../../assets/nl.svg';
import it from '../../../assets/it.svg';
import formatDollar from '../utils';

type GeneralDataProps = {
  data: SaveFileType | null;
};
export default function GeneralData(props: GeneralDataProps) {
  const { data } = props;
  const { t, i18n } = useTranslation();

  useEffect(() => {
    console.log(i18n.language);
  }, [i18n]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="align">
      <h1>{t('generalData.title')}</h1>
      <div className="flex">
        <button
          type="button"
          className="button"
          onClick={() => changeLanguage('en')}
        >
          <img src={english} alt="Logo github" width={80} />
        </button>
        <button
          type="button"
          className="button"
          onClick={() => changeLanguage('fr')}
        >
          <img src={french} alt="Logo github" width={80} />
        </button>
        <button
          type="button"
          className="button"
          onClick={() => changeLanguage('es')}
        >
          <img src={spanish} alt="Logo github" width={80} />
        </button>
        <button
          type="button"
          className="button"
          onClick={() => changeLanguage('de')}
        >
          <img src={german} alt="Logo github" width={80} />
        </button>
        <button
          type="button"
          className="button"
          onClick={() => changeLanguage('nl')}
        >
          <img src={nl} alt="Nl trad" width={80} />
        </button>
        <button
          type="button"
          className="button"
          onClick={() => changeLanguage('it')}
        >
          <img src={it} alt="It trad" width={80} />
        </button>
      </div>
      <div className="flex">
        <Card
          title={t('generalData.storage')}
          content={
            <>
              {data?.Storage.value.Purchased && (
                <p>✅ Lvl {data?.Storage.value.StorageLevel}</p>
              )}
              {!data?.Storage.value.Purchased && <p>❌</p>}
            </>
          }
        />
        <Card
          title={t('generalData.employees')}
          content={
            <p>
              {t('generalData.cashiers', {
                count: data?.Employees.value.CashiersData?.length,
              })}
              {t('generalData.restocker', {
                count: data?.Employees.value.RestockersData?.length,
              })}
            </p>
          }
        />
        <Card
          title={t('generalData.licenses')}
          content={
            <p>
              {t('generalData.licence', {
                count: data?.Progression.value.UnlockedLicenses?.length,
              })}
            </p>
          }
        />
      </div>
      <div className="flex">
        <Card
          title={t('generalData.invoices')}
          content={
            data?.Expenses.value.Bills && data?.Expenses.value.Rents ? (
              <p>
                {t('generalData.billsAndRent', {
                  bills: data?.Expenses.value.Bills.length,
                  rents: data?.Expenses.value.Rents.length,
                })}
              </p>
            ) : (
              <p>You have no bills to pay ❌</p>
            )
          }
        />
        <Card
          title={t('generalData.money')}
          content={<p>{formatDollar(data?.Progression.value.Money || 0)}</p>}
        />
      </div>
      <div className="center mt-5">
        <p>{t('description')}</p>
        <p>{t('stayConnect')}</p>
        <p>{t('ty')}</p>
        <div className="flex">
          <Link
            title="Join our community"
            to="https://discord.gg/Fq6kykV4Je"
            target="_blank"
          >
            <img src={discord} alt="Logo discord" width={45} />
          </Link>
          <Link
            to="https://github.com/Nolyo/Supermarket-management-system"
            target="_blank"
            title="This project is open source, click here to see the code"
          >
            <img src={github} alt="Logo github" width={45} />
          </Link>
        </div>
      </div>
    </div>
  );
}
