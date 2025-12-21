import { createContext, useContext } from 'react';
import { assert } from '@react-hive/honey-utils';
import type { Auth } from 'firebase/auth';

import type { Nullable } from '~/types';
import type { User } from '~/netlify/types';

export interface AppContextValue {
  auth: Auth;
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
