import { isBrowser } from 'react-device-detect';
import { useEffect, useState } from 'react';
import WebReceiptPage from '@domains/recepit/WebReceiptPage';

export default function RecepitPage() {
  const [browser, setBrowser] = useState(false);
  useEffect(() => {
    setBrowser(isBrowser);
  }, []);
  return browser ? <WebReceiptPage /> : <div></div>;
}
