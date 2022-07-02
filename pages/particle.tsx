import { isBrowser } from 'react-device-detect';
import { useEffect, useState } from 'react';
import { WebParticlePage } from '@domains/particle/WebParticlePage';

export default function ParticlePage() {
  const [browser, setBrowser] = useState(false);
  useEffect(() => {
    setBrowser(isBrowser);
  }, []);
  return browser ? <WebParticlePage /> : <div></div>;
}
