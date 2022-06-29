import styles from './RoundButton.module.scss';
import cn from 'classnames';
import { FC } from 'react';

type PropTypes = {
  text: string;
  clickEvent: any;
  width?: string | number;
  height?: string | number;
  styleType?: string;
  color?: string;
  marginRight?: string | number;
  marginLeft?: string | number;
  borderRadius?: string | number;
  type?: 'submit' | 'reset';
};

export const RoundButton: FC<PropTypes> = ({ text, clickEvent, width, height, styleType, color, marginLeft, marginRight, borderRadius, type }) => {
  return (
    <button
      type={type || 'button'}
      className={cn('flexCenter fs-16', styles.btn, styleType && styles[styleType], color && styles[color])}
      style={{ width: width, height: height, marginLeft: marginLeft, marginRight: marginRight, borderRadius: borderRadius }}
      onClick={() => clickEvent()}
    >
      {text}
    </button>
  );
};
