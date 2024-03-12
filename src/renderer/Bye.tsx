import { Link } from 'react-router-dom';
import './App.css';

function Bye() {
  return (
    <div>
      <Link to="/">
        <button type="button">
          <span role="img" aria-label="folded hands">
            🙏
          </span>
          Hello
        </button>
      </Link>
    </div>
  );
}

export default Bye;
