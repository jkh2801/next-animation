import { WebMarkdownPage } from '@domains/markdown/WebMarkdownPage';
import { useEffect, useState } from 'react';
import { isBrowser } from 'react-device-detect';

export default function MarkdownPage() {
  const [browser, setBrowser] = useState(false);
  useEffect(() => {
    setBrowser(isBrowser);
  }, []);
  return browser ? <WebMarkdownPage /> : <div></div>;
}
