import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserType = Record<string, any> | null;

interface IUserContext {
  user: UserType;
  updateUser: (user: UserType) => void;
}

export const UserContext = createContext<IUserContext>({
  user: null,
  updateUser: () => {},
});

interface ProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<ProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserType>(null);

  useEffect(() => {
    const fetchUserFromStorage = async () => {
      try {
        const stored = await AsyncStorage.getItem('currentUser');
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (err) {
        console.warn('User load failed:', err);
      }
    };
    fetchUserFromStorage();
  }, []);

  const updateUser = (newUser: UserType) => {
    setUser(newUser);
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
