import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Bye from './Bye';
import './App.css';
import Objective from './Objective';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quantity" element={<Objective />} />
        <Route path="/bye" element={<Bye />} />
      </Routes>
    </Router>
  );
}
