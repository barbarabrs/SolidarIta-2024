import { Box, Divider, Heading, SimpleGrid } from "@chakra-ui/react";
import { parseCookies } from "nookies";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  itemAnimation,
  MotionBox,
} from "../../components/Styles/motion-animate/animate";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../services/api";
import { CampaignCard } from "./campaignCard";
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
  status: string;
}

export const Feed = ({ user_type }: { user_type?: number }) => {
  const { type } = useContext(AuthContext);
  const { id } = useParams();
  const cookies = parseCookies();
  const [campaignItems, setCampaignItems] = useState<CampaignItemProps[]>([]);

  useEffect(() => {
    const user_id = cookies["id"];
    const type_user = cookies["type"];
    if (user_type && id) {
      api
        .post("/campaigns", {
          id: parseInt(id),
          type: user_type,
        })
        .then((response) => {
          setCampaignItems(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (parseInt(type) === 4) {
      api
        .post("/campaigns")
        .then((response) => {
          setCampaignItems(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      api
        .post("/campaigns", {
          activated: true,
          user_id: parseInt(user_id),
          user_type: parseInt(type_user),
        })
        .then((response) => {
          console.log(response.data);
          setCampaignItems(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [user_type]);

  return (
    <>
      <MotionBox variants={itemAnimation} margin="0 auto" padding={"2rem"}>
        <Box>
          <Heading fontSize={"1.5em"} mb={3}>
            {parseInt(type) === 4 ? (
              <> Lista de campanhas</>
            ) : (
              <> Olá , Que tal fazer uma boa ação hoje?</>
            )}
          </Heading>
        </Box>
        <Divider borderColor="100" mb="1rem" />

        <Box mx={"auto"} pt={5} px={{ base: 2, sm: 12, md: 17 }} >
          <SimpleGrid columns={1} spacing={{ base: 5 }} minChildWidth="300px">
            {campaignItems.map((link, index) => (
              <CampaignCard
                key={index}
                title={link.name}
                description={link.description}
                owner={link.owner}
                partner={link.partner}
                campaign_type={link.type}
                id={link.id}
                image={link.image}
                owner_image={link.owner_image}
                partner_image={link.partner_image}
                status={link.status}
              />
            ))}
          </SimpleGrid>
        </Box>
      </MotionBox>
    </>
  );
};
