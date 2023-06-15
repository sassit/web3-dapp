import { ConnectButton } from '@rainbow-me/rainbowkit';
import styles from '../../styles/Navbar.module.css';
import Link from 'next/link';
export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link href='/'>
        <h1>NFTREASURE</h1>
      </Link>
      <ConnectButton></ConnectButton>
    </nav>
  );
}
