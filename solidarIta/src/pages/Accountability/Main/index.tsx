import { Box, Divider, Heading, SimpleGrid } from "@chakra-ui/react";
import { parseCookies } from "nookies";
import React, { useEffect, useState } from "react";
import {
  itemAnimation,
  MotionBox,
} from "../../../components/Styles/motion-animate/animate";
import api from "../../../services/api";
import { CampaignAccountabilityCard } from "../Card";
interface CampaignItemProps {
  id: string;
  name: string;
  description: string;
  owner: string;
  partner?: string;
  type: string;
  image: string;
  owner_image: string;
  partner_image: string;
  accountability: number;
}

export const MainAccountabilityCampain = () => {
  const [campaignItems, setCampaignItems] = useState<CampaignItemProps[]>([]);
  const cookies = parseCookies();

  useEffect(() => {
    api
      .post("/campaigns/finished", {})
      .then((response) => {
        console.log(response.data);
        setCampaignItems(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <MotionBox variants={itemAnimation} margin="0 auto">
        <Box>
          <Heading fontSize={"2.0em"} mb={3}>
            Prestação de contas das campanhas finalizadas
          </Heading>
        </Box>
        <Divider borderColor="100" mb="1rem" />

        <Box mx={"auto"} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
          <SimpleGrid columns={1} spacing={{ base: 5 }} minChildWidth="300px">
            {campaignItems.map((link, index) => (
              <CampaignAccountabilityCard
                key={index}
                title={link.name}
                description={link.description}
                owner={link.owner}
                partner={link.partner}
                type={link.type}
                id={link.id}
                image={link.image}
                owner_image={link.owner_image}
                partner_image={link.partner_image}
                accountability={link.accountability}
              />
            ))}
          </SimpleGrid>
        </Box>
      </MotionBox>
    </>
  );
};
function id(link: CampaignItemProps, id: any) {
  throw new Error("Function not implemented.");
}
