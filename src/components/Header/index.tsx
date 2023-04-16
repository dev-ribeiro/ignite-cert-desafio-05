import Link from 'next/link';
import Image from 'next/image';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={styles.container}>
      <Link href="/">
        <a>
          <Image
            src="/assets/logo.png"
            width={236.82}
            height={25.63}
            alt="logo"
          />
        </a>
      </Link>
    </header>
  );
}
