import { ReactNode } from 'react';

type CardType = {
  title: string;
  content: ReactNode;
};
export default function Card(props: CardType) {
  const { title, content } = props;

  return (
    <div className="card">
      <div className="card-title">
        <span>{title}</span>
      </div>
      <div>{content}</div>
    </div>
  );
}
