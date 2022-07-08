import { HomeButton } from '@components/button';
import cn from 'classnames';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './Markdown.module.scss';
import remarkGfm from 'remark-gfm';

export const WebMarkdownPage = () => {
  const [text, setText] = useState('');
  return (
    <div className="body flexCenter hidden" style={{ background: '#faefe5' }}>
      <HomeButton />
      <div className={cn('flexAroundCenter', styles.container)}>
        <div className={styles.box}>
          <div className={cn('flexCenter number fs-30 fw-500', styles.title)}>Editor</div>
          <div className={cn(styles.textBox, styles.editor)}>
            <textarea value={text} onChange={e => setText(e.target.value)}></textarea>
          </div>
        </div>
        <div className={styles.box}>
          <div className={cn('flexCenter number fs-30 fw-500', styles.title)}>Previewer</div>
          <div className={cn('auto', styles.textBox, styles.previewer)}>
            <ReactMarkdown children={text} remarkPlugins={[remarkGfm]} />
          </div>
        </div>
      </div>
    </div>
  );
};
