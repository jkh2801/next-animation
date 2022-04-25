import { Dispatch, SetStateAction } from 'react';

export type SetStateType<S> = Dispatch<SetStateAction<S>>;

export type KeyValueStringType = {
  [key: string]: string;
};
