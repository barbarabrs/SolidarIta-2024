import { parseCookies } from "nookies";
import { createContext, ReactNode, useEffect, useState } from "react";
import api from "../services/api";
import { Product } from "./ProductListContext";
import { UserInterfaceData } from "./ProfileContext";

export interface GroceryList {
  name: string;
  image: string;
  description: string;
  partner_id: number;
  goal: string;
  status: string;
  id: number;
  username?: string;
  date: string;
  scheduling: string;
  owner_id: string;
  owner: string;
  pix: string;
  accountability: number;
  accountability_message: string;
  partner: string;
  grocerylist: number;
}

export interface GroceryListCreate {
  name: string;
  image: string;
  description: string;
  products: { [key: number]: number }; // referente a tabela grocery_list_products
  partner_id: number;
  goal: string;
  owner_id: number;
}

interface GroceryListContextData {
  products: Product[];
  setProducts: (value: Product[]) => void;
  partners: UserInterfaceData[];
  setPartners: (value: UserInterfaceData[]) => void;
  groceryLists: GroceryList[] | null;
  setGroceryLists: (value: GroceryList[] | null) => void;
  setIsLoading: (value: boolean) => void;
  isLoading: boolean;
  refresh: boolean;
  setRefresh: (value: boolean) => void;
  setPartnerPage: (value: boolean) => void;
}

interface GroceryListProviderProps {
  children: ReactNode;
}

export const GroceryListContext = createContext({} as GroceryListContextData);

export function GroceryListProvider({ children }: GroceryListProviderProps) {
  const cookies = parseCookies();
  const [groceryLists, setGroceryLists] = useState<GroceryList[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [partnerPage, setPartnerPage] = useState<boolean>(false);
  const [partners, setPartners] = useState<UserInterfaceData[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setIsLoading(false);
    // console.log(cookies["id"]);
    const id = cookies["id"];

    api
      .post("/groceryList", { id, from: "institution" })
      .then((response) => {
        console.log(response.data);
        // console.log(response.data);
        setGroceryLists(response.data);
        setIsLoading(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [refresh]);

  useEffect(() => {
    // if (partnerPage === true) {
    setIsLoading(false);

    api
      .post("/user/list", { user_type: "3" })
      .then((response) => {
        // console.log(response.data);
        setPartners(response.data);
        setIsLoading(true);
        setPartnerPage(false);
      })
      .catch((error) => {
        console.log(error);
      });
    // }
  }, [refresh]);

  return (
    <GroceryListContext.Provider
      value={{
        partners,
        setPartners,
        products,
        setProducts,
        groceryLists,
        setGroceryLists,
        setIsLoading,
        isLoading,
        refresh,
        setRefresh,
        setPartnerPage,
      }}
    >
      {children}
    </GroceryListContext.Provider>
  );
}
