import { isBrowser } from 'react-device-detect';
import WebHomePage from '@domains/home/WebHomePage';
import { useEffect, useState } from 'react';

export default function HomePage() {
  console.log('Home');
  const [browser, setBrowser] = useState(false);
  useEffect(() => {
    setBrowser(isBrowser);
  }, []);
  return browser ? <WebHomePage /> : <div></div>;
}
