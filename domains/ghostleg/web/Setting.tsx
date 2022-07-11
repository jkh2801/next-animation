import styles from './Setting.module.scss';
import cn from 'classnames';
import LeftArrowIcon from '@assets/leftArrowIcon.svg';
import RightArrowIcon from '@assets/rightArrowIcon.svg';
import { RoundButton } from '@components/button';
import { SetStateType } from '@customTypes/CommonTypes';
import { FC } from 'react';

type PropTypes = {
  option: { line: number };
  setLine: (num: number) => void;
  setStatus: SetStateType<string>;
};

export const SettingNum: FC<PropTypes> = ({ option, setLine, setStatus }) => {
  const MIN = 1;

  const handleSetStart = () => {
    if (option.line >= MIN) setStatus('settingInput');
  };
  return (
    <div className={cn('flexCenter', styles.settingNum)}>
      <div className={cn('flexColumn gap-20')}>
        <span className="flexCenter fs-40 fw-700">사다리타기</span>
        <div className={cn('flexCenter gap-20', styles.numBox)}>
          <div className={styles.btnBox}>
            {option.line > 3 && (
              <button className="flexCenter" onClick={() => setLine(option.line - 1)}>
                <LeftArrowIcon />
              </button>
            )}
          </div>
          <div className={styles.inputBox}>
            <input type="number" value={option.line} className="number fs-30 fw-700" min={MIN} onChange={e => setLine(Number(e.target.value))} />
          </div>
          <div className={styles.btnBox}>
            <button className="flexCenter" onClick={() => setLine(option.line + 1)}>
              <RightArrowIcon />
            </button>
          </div>
        </div>
        <div className="flexCenter">
          <RoundButton text="START" clickEvent={handleSetStart} styleType="typeA" width={150} />
        </div>
      </div>
    </div>
  );
};
