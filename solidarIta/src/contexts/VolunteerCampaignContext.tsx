import { parseCookies } from "nookies";
import { createContext, ReactNode, useEffect, useState } from "react";
import api from "../services/api";
import { Product } from "./ProductListContext";
import { UserInterfaceData } from "./ProfileContext";

export interface VolunteerCampaign {
  name: string;
  image: string;
  description: string;
  goal: string;
  status: string;
  id: number;
  username?: string;
  date: string;
  schedule: string;
  place: string;
  owner_id: string;
  owner: string;
  pix: string;
  accountability: number;
  accountability_message: string;
  volunteercampaign: number;
}

export interface VolunteerCampaignCreate {
  name: string;
  image: string;
  description: string;
  products: { [key: number]: number }; // referente a tabela grocery_list_products
  partner_id: number;
  goal: string;
  owner_id: number;
}

interface VolunteerCampaignContextData {
  products: Product[];
  setProducts: (value: Product[]) => void;
  partners: UserInterfaceData[];
  setPartners: (value: UserInterfaceData[]) => void;
  volunteerCampaigns: VolunteerCampaign[] | null;
  setVolunteerCampaigns: (value: VolunteerCampaign[] | null) => void;
  setIsLoading: (value: boolean) => void;
  isLoading: boolean;
  refresh: boolean;
  setRefresh: (value: boolean) => void;
  setPartnerPage: (value: boolean) => void;
}

interface VolunteerCampaignProviderProps {
  children: ReactNode;
}

export const VolunteerCampaignContext = createContext({} as VolunteerCampaignContextData);

export function VolunteerCampaignProvider({ children }: VolunteerCampaignProviderProps) {
  const cookies = parseCookies();
  const [volunteerCampaigns, setVolunteerCampaigns] = useState<VolunteerCampaign[] | null>(null);
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
      .post("/volunteer", { id, from: "institution" })
      .then((response) => {
        console.log(response.data);
        // console.log(response.data);
        setVolunteerCampaigns(response.data);
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
    <VolunteerCampaignContext.Provider
      value={{
        partners,
        setPartners,
        products,
        setProducts,
        volunteerCampaigns,
        setVolunteerCampaigns,
        setIsLoading,
        isLoading,
        refresh,
        setRefresh,
        setPartnerPage,
      }}
    >
      {children}
    </VolunteerCampaignContext.Provider>
  );
}
