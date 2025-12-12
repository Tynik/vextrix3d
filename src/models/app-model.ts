import { createContext, useContext } from 'react';
import { assert } from '@react-hive/honey-utils';

import type { User } from '~/api';
import type { Nullable } from '~/types';

export interface AppContextValue {
  hasSession: boolean;
  isAuthenticating: boolean;
  user: Nullable<User>;
  setUser: (user: User) => void;
}

export const AppContext = createContext<AppContextValue | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  assert(context, 'AppContext cannot be accessed');

  return context;
};
