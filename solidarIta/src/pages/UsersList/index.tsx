import { Box, Divider, Heading, SimpleGrid } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  itemAnimation,
  MotionBox,
} from "../../components/Styles/motion-animate/animate";
import { UserInterfaceData } from "../../contexts/ProfileContext";
import api from "../../services/api";
import { UsersCard } from "./UsersCard";

export const UsersList = ({ type }: { type: number }) => {
  const [userss, setUserss] = useState<UserInterfaceData[]>([]);

  const title = () => {
    switch (type) {
      case 1:
        return "Doadores";
      case 2:
        return "Instituições";
      case 3:
        return "Parceiros";
      default:
        break;
    }
  };

  useEffect(() => {
    api
      .post("/user/list", { user_type: type })
      .then((response) => {
        console.log(response.data);
        setUserss(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [type]);

  return (
    <>
      <MotionBox variants={itemAnimation} margin="0 auto" padding={"2rem"}>
        <Box>
          <Heading fontSize={"2.5em"} mb={3}>
            {title()}
          </Heading>
        </Box>
        <Divider borderColor="100" mb="1rem" />

        <Box mx="auto" pt={5} px={{ base: 2, sm: 12, md: 17 }}>
          <SimpleGrid columns={1} spacing={{ base: 5 }} minChildWidth="300px" >
            {userss.map((item, index) => (
              <UsersCard
                key={index}
                username={item.username}
                social_reason={item.social_reason}
                id={item.id}
                image={item.image}
                status={item.status}
                social_media={item.social_media}
                type={type}
              />
            ))}
          </SimpleGrid>
        </Box>
      </MotionBox>
    </>
  );
};
