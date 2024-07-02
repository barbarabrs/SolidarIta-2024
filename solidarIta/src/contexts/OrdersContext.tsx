import { parseCookies } from "nookies";
import { createContext, ReactNode, useEffect, useState } from "react";
import api from "../services/api";

export interface UserInterfaceData {
  username: string;
  image: string;
  status: string;
  email: string;
  birthday: string;
  socialReason: string;
  cnpj_legal: string;
  pix: string;
  password: string;
  id: number;
  phone: number;
}
interface OrdersContextData {
  userData: UserInterfaceData | null;
  setUserData: (value: UserInterfaceData | null) => void;
  setIsLoading: (value: boolean) => void;
  isLoading: boolean;
  refresh: boolean;
  setRefresh: (value: boolean) => void;
}

interface OrdersProviderProps {
  children: ReactNode;
}

export const OrdersContext = createContext({} as OrdersContextData);

export function OrdersProvider({ children }: OrdersProviderProps) {
  const cookies = parseCookies();
  const [userData, setUserData] = useState<UserInterfaceData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  // useEffect(() => {
  //   setIsLoading(false);
  //   console.log(cookies["id"]);
  //   const id = cookies["id"];

  //   api
  //     .post("/User", { id })
  //     .then((response) => {
  //       console.log(response.data);
  //       setUserData(response.data);
  //       setIsLoading(true);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, [refresh]);

  // useEffect(() => {
  //   console.log(userData);
  // }, [userData]);

  return (
    <OrdersContext.Provider
      value={{
        userData,
        setUserData,
        setIsLoading,
        isLoading,
        refresh,
        setRefresh,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}
