import { AppNotFound } from '@components/notFound';
import { WebTestrisPage } from '@domains/tetris/WebTetrisPage';
import { useEffect, useState } from 'react';
import { isBrowser } from 'react-device-detect';

export default function TetrisPage() {
  const [browser, setBrowser] = useState(false);
  useEffect(() => {
    setBrowser(isBrowser);
  }, []);

  return browser ? <WebTestrisPage /> : <AppNotFound />;
}
