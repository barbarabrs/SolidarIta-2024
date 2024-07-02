import { parseCookies } from "nookies";
import { createContext, ReactNode, useEffect, useState } from "react";
import api from "../services/api";
import { Product } from "./ProductListContext";
import { UserInterfaceData } from "./ProfileContext";

export interface DonationCampaign {
  name: string;
  image: string;
  description: string;
  goal: string;
  status: string;
  id: number;
  username?: string;
  date: string;
  owner_id: string;
  owner: string;
  pix: string;
  accountability: number;
  accountability_message: string;
  donationCampaign: number;
  raised: string;
}

export interface DonationCampaignCreate {
  name: string;
  image: string;
  description: string;
  goal: string;
  owner_id: number;
}

interface DonationCampaignContextData {
  products: Product[];
  setProducts: (value: Product[]) => void;
  partners: UserInterfaceData[];
  setPartners: (value: UserInterfaceData[]) => void;
  donationCampaigns: DonationCampaign[] | null;
  setDonationCampaigns: (value: DonationCampaign[] | null) => void;
  setIsLoading: (value: boolean) => void;
  isLoading: boolean;
  refresh: boolean;
  setRefresh: (value: boolean) => void;
  setPartnerPage: (value: boolean) => void;
}

interface DonationCampaignProviderProps {
  children: ReactNode;
}

export const DonationCampaignContext = createContext({} as DonationCampaignContextData);

export function DonationCampaignProvider({ children }: DonationCampaignProviderProps) {
  const cookies = parseCookies();
  const [donationCampaigns, setDonationCampaigns] = useState<DonationCampaign[] | null>(null);
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
      .post("/donation", { id })
      .then((response) => {
        console.log(response.data);
        // console.log(response.data);
        setDonationCampaigns(response.data);
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
    <DonationCampaignContext.Provider
      value={{
        partners,
        setPartners,
        products,
        setProducts,
        donationCampaigns,
        setDonationCampaigns,
        setIsLoading,
        isLoading,
        refresh,
        setRefresh,
        setPartnerPage,
      }}
    >
      {children}
    </DonationCampaignContext.Provider>
  );
}
