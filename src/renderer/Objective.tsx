import { useState } from 'react';
import Navbar from './components/Navbar';

export default function Objective() {
  const [show, setShow] = useState<'general' | 'products'>('products');

  return (
    <>
      <Navbar show={show} setShow={setShow} />
      <div className="quantity">
        <h1 className="center">Set your quantity</h1>
        <div className="flex">Soon</div>
      </div>
    </>
  );
}
