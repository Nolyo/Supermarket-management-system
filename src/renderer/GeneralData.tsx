import { useEffect } from 'react';
import SaveFileType from '../main/type';
import Card from './components/Card';

type GeneralDataProps = {
  data: SaveFileType | null;
};
export default function GeneralData(props: GeneralDataProps) {
  const { data } = props;

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(data);
  }, [data]);

  return (
    <div className="align">
      <h1>General data</h1>
      <div className="flex">
        <Card
          title="Storage"
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
          title="Employees"
          content={
            data?.Employees.value.CashiersData ? (
              <p>
                {' '}
                You have {data?.Employees.value.CashiersData.length} cashiers
              </p>
            ) : (
              <p>You have no cashiers ❌</p>
            )
          }
        />
        <Card
          title="Licenses"
          content={
            data?.Progression.value.UnlockedLicenses ? (
              <p>
                {' '}
                You have {data?.Progression.value.UnlockedLicenses.length}{' '}
                licenses unlocked
              </p>
            ) : (
              <p>You have no cashiers ❌</p>
            )
          }
        />
      </div>
      <div className="flex">
        <Card
          title="Invoice"
          content={
            data?.Expenses.value.Bills && data?.Expenses.value.Rents ? (
              <p>
                You have{' '}
                <span className="bold italic blue">
                  {data?.Expenses.value.Bills.length} bills
                </span>{' '}
                and
                <span className="bold italic blue">
                  {data?.Expenses.value.Rents.length} rent
                </span>{' '}
                to pay
              </p>
            ) : (
              <p>You have no bills to pay ❌</p>
            )
          }
        />
        <Card title="Money" content={<p>{data?.Progression.value.Money}</p>} />
      </div>
    </div>
  );
}
