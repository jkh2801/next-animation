import { AppNotFound } from '@components/notFound';
import { WebBalancingPage } from '@domains/balancing/WebBalancingPage';
import { useEffect, useState } from 'react';
import { isBrowser } from 'react-device-detect';

export default function BalancingPage() {
  const [browser, setBrowser] = useState(false);
  useEffect(() => {
    setBrowser(isBrowser);
  }, []);

  return browser ? <WebBalancingPage /> : <AppNotFound />;
}
