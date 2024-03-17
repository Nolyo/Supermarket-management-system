import SaveFileType, { AssociatedItem } from '../../main/type';

import Products from '../Products';
import GeneralData from './GeneralData';
import '../App.css';

type HomeProps = {
  data: SaveFileType;
  associated: AssociatedItem;
};

function Home(props: HomeProps) {
  const { associated, data } = props;
  return (
    <div>
      <Products data={data} associated={associated} />
      <GeneralData data={data} />
    </div>
  );
}

export default Home;
