import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SaveFileType from '../main/type';
import Card from './components/Card';
import discord from '../../assets/discord.svg';
import github from '../../assets/github.svg';
import french from '../../assets/french.svg';
import english from '../../assets/english.svg';
import formatDollar from './utils';

type GeneralDataProps = {
  data: SaveFileType | null;
};
export default function GeneralData(props: GeneralDataProps) {
  const { data } = props;
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(data);
  }, [data]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="align">
      <h1>{t('general-data.title')}</h1>
      <div className="flex">
        <div className="cursor" onClick={() => changeLanguage('en')}>
          <img src={english} alt="Logo github" width={45} />
        </div>
        <div className="cursor" onClick={() => changeLanguage('fr')}>
          <img src={french} alt="Logo github" width={45} />
        </div>
      </div>
      <div className="flex">
        <Card
          title={t('general-data.storage')}
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
          title={t('general-data.employees')}
          content={
            data?.Employees.value.CashiersData ? (
              <p>
                {t('general-data.cashiers', {
                  count: data?.Employees.value.CashiersData.length,
                })}
              </p>
            ) : (
              <p>{t('general-data.no-cashiers')}</p>
            )
          }
        />
        <Card
          title={t('general-data.licenses')}
          content={
            data?.Progression.value.UnlockedLicenses ? (
              <p>
                {t('general-data.licence', {
                  count: data?.Progression.value.UnlockedLicenses.length,
                })}
              </p>
            ) : (
              <p>{t('general-data.no-licence')}</p>
            )
          }
        />
      </div>
      <div className="flex">
        <Card
          title={t('general-data.invoices')}
          content={
            data?.Expenses.value.Bills && data?.Expenses.value.Rents ? (
              <p>
                {t('general-data.billsAndRent', {
                  bills: data?.Expenses.value.Bills.length,
                  rents: data?.Expenses.value.Rents.length,
                })}
                {/* You have{' '}
                <span className="bold italic blue">
                  {data?.Expenses.value.Bills.length} bills
                </span>{' '}
                and
                <span className="bold italic blue">
                  {data?.Expenses.value.Rents.length} rent
                </span>{' '}
                to pay */}
              </p>
            ) : (
              <p>You have no bills to pay ❌</p>
            )
          }
        />
        <Card
          title={t('general-data.money')}
          content={<p>{formatDollar(data?.Progression.value.Money || 0)}</p>}
        />
      </div>
      <div className="center mt-5">
        <p>{t('description')}</p>
        <p>{t('stay-connect')}</p>
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
