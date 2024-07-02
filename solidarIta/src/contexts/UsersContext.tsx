import { createContext, ReactNode, useEffect, useState } from 'react';
import api from '../services/api';


interface UsersData {
  username: string;
  email: string;
  roles: {
    roles: string[] 
  } | null;
}

interface Users {
  username: string;
  email: string;
  roles:  string[];
}

interface UsersContextData {
  //valores a serem enviados 
  users: Users[];
  refresh: boolean;
  setRefresh: (value: boolean) => void;
  isLoading: boolean;
}

interface UsersProviderProps {
  children: ReactNode;
}

export const UsersContext = createContext({} as UsersContextData);


export function UsersProvider({ children }: UsersProviderProps) {
  const [users, setUsers] = useState<Users[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    setIsLoading(false)
    api
      .get('/users')
      .then((response) => {
        const aux = response.data.map((item: UsersData) => {
          let auxRoles = {};

          if (item.roles === null) {
            auxRoles = ['']
          } else {
            auxRoles = item.roles.roles
          }
          return { username: item.username, email: item.email, roles: auxRoles }
        })

        setUsers(aux)

    setIsLoading(true)
  })

}, [refresh]);

return (
  <UsersContext.Provider value={{ users, refresh, setRefresh, isLoading }} >
    {children}
  </UsersContext.Provider>
)
}