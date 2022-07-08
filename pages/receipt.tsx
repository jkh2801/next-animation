import { isBrowser } from 'react-device-detect';
import { useEffect, useState } from 'react';
import WebReceiptPage from '@domains/receipt/WebReceiptPage';
import { AppNotFound } from '@components/notFound';

export default function RecepitPage() {
  const [browser, setBrowser] = useState(false);
  useEffect(() => {
    setBrowser(isBrowser);
  }, []);
  return browser ? <WebReceiptPage /> : <AppNotFound />;
}
