import { SetStateType } from '@customTypes/CommonTypes';
import cn from 'classnames';
import { FC } from 'react';
import styles from './Result.module.scss';
import RightArrowIcon2 from '@assets/rightArrowIcon2.svg';
import { RoundButton } from '@components/button';

type PropTypes = {
  setStatus: SetStateType<string>;
  result: { start: string; end: string }[];
};

export const Result: FC<PropTypes> = ({ setStatus, result }) => {
  return (
    <div className={cn('flexCenter', styles.result)}>
      <div className={cn('flexColumn flexCenter gap-10', styles.box)}>
        {result.map((info, idx) => (
          <div key={idx} className={cn('flexBetweenCenter', styles.content)}>
            <span>{info.start}</span>
            <RightArrowIcon2 />
            <span>{info.end}</span>
          </div>
        ))}
      </div>
      <div className={cn('flexCenter gap-20', styles.btnBox)}>
        <RoundButton text="처음으로" clickEvent={() => setStatus('settingNum')} styleType="typeA" width={150} height={40} />
      </div>
    </div>
  );
};
