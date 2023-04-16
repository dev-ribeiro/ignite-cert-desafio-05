import { ReactNode } from 'react';
import styles from './styles.module.scss';

interface Props {
  children: ReactNode;
}

export function PostLayout({ children }: Props): JSX.Element {
  return <div className={styles.container}>{children}</div>;
}
