import { createContext, useContext } from 'react';
import { assert } from '@react-hive/honey-utils';
import type { Auth } from 'firebase/auth';

import type { User } from '~/api';
import type { Nullable } from '~/types';

export interface AppContextValue {
  firebaseAuth: Auth;
  user: Nullable<User>;
  isUserLoading: boolean;
  setUser: (user: User) => void;
}

export const AppContext = createContext<AppContextValue | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  assert(context, 'AppContext cannot be accessed');

  return context;
};
