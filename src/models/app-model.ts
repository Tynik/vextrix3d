import { createContext, useContext } from 'react';
import { assert } from '@react-hive/honey-utils';

import type { Nullable } from '~/types';
import type { User } from '~/netlify/types';

export interface AppContextValue {
  user: Nullable<User>;
  isAdmin: boolean;
  isUserLoading: boolean;
  setUser: (user: User) => void;
}

export const AppContext = createContext<AppContextValue | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  assert(context, 'AppContext cannot be accessed');

  return context;
};
