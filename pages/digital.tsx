import { isBrowser } from 'react-device-detect';
import { useEffect, useState } from 'react';
import WebDigitalPage from '@domains/digital/WebDigitalPage';

export default function DigitalPage() {
  const [browser, setBrowser] = useState(false);
  useEffect(() => {
    setBrowser(isBrowser);
  }, []);
  return browser ? <WebDigitalPage /> : <div></div>;
}
