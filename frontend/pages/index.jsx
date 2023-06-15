import Button from '../components/ui/Button';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <main className={styles.main}>
        <h1>WELCOME TO NFT VOTING</h1>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'center',
            height: '10rem',
          }}
        >
          <Link href='/start'>
            <Button>START NEW VOTE</Button>
          </Link>

          <Link href='/existing'>
            <Button>SEE EXISTING VOTES</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
