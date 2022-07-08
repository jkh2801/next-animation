import { AppNotFound } from '@components/notFound';
import { WebDraggablePage } from '@domains/draggable/WebDraggablePage';
import { useEffect, useState } from 'react';
import { isBrowser } from 'react-device-detect';

export default function DraggablePage() {
  const [browser, setBrowser] = useState(false);
  useEffect(() => {
    setBrowser(isBrowser);
  }, []);

  return browser ? <WebDraggablePage /> : <AppNotFound />;
}
