import { ReactNode } from 'react';

type CardType = {
  title: string | ReactNode;
  content: ReactNode;
};
export default function Card(props: CardType) {
  const { title, content } = props;

  return (
    <div className="card">
      <div className="card-title">{title}</div>
      <div>{content}</div>
    </div>
  );
}
