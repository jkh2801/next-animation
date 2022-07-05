import { isBrowser } from 'react-device-detect';
import { useEffect, useState } from 'react';
import WebLoadingEx1Page from '@domains/loadingex1/WebLoadingEx1Page';

export default function LoadingEx1Page() {
  const [browser, setBrowser] = useState(false);
  useEffect(() => {
    setBrowser(isBrowser);
  }, []);
  return browser ? <WebLoadingEx1Page /> : <div></div>;
}
