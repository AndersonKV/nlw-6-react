import { ReactNode } from 'react';
import copyImg from '../assets/images/copy.svg';

import './styles.scss';

type QuestionProps = {
  id?: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  isHighLighted?: boolean;
  isAnswered?: boolean;
  children?: ReactNode;
};

export function Question({ content, author, children }: QuestionProps) {
  return (
    <div className="question">
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>{children}</div>
      </footer>
    </div>
  );
}
