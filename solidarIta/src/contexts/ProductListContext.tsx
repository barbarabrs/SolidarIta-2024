import { parseCookies } from "nookies";
import { createContext, ReactNode, useEffect, useState } from "react";
import api from "../services/api";

export interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string;
  date: string;
  username: string;
  user_image: string;
}

export interface ProductsList {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string;
  date: string;
  amount: number;
  paid: number;
  username: string,
  grocerylist: number
}

interface ProductListContextData {
  products: Product[] | null;
  setProducts: (value: Product[] | null) => void;
  setIsLoading: (value: boolean) => void;
  isLoading: boolean;
  refresh: boolean;
  setRefresh: (value: boolean) => void;
}

interface ProductListProviderProps {
  children: ReactNode;
}

export const ProductListContext = createContext({} as ProductListContextData);

export function ProductListProvider({ children }: ProductListProviderProps) {
  const cookies = parseCookies();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(false);
    // console.log(cookies["id"]);
    const id = cookies["id"];

    api
      .post("/products", { id })
      .then((response) => {
        console.log(response.data);
        setProducts(response.data);
        setIsLoading(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [refresh]);


  return (
    <ProductListContext.Provider
      value={{
        products,
        setProducts,
        setIsLoading,
        isLoading,
        refresh,
        setRefresh,
      }}
    >
      {children}
    </ProductListContext.Provider>
  );
}
