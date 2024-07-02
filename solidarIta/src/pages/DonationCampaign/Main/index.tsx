import {
  Box,
  Button,
  Divider,
  Flex,
  SimpleGrid,
  Skeleton,
  Spacer,
  Stack,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import {
  itemAnimation,
  MotionBox,
} from "../../../components/Styles/motion-animate/animate";
import {
  DonationCampaign,
  DonationCampaignContext,
} from "../../../contexts/DonationCampaignContext";
import { DonationCampaignCard } from "../Utils/DonationCampaignCard";

const MainDonationCampaign: React.FC = (): React.ReactElement => {
  const { isLoading, donationCampaigns, setRefresh } = useContext(
    DonationCampaignContext
  );

  const [donationCampaign, setdonationCampaign] = useState<DonationCampaign[]>(
    donationCampaigns ?? []
  );
  // const [basedonationCampaigns, setBasedonationCampaigns] = useState<donationCampaigns[]>([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (donationCampaigns !== null) {
      setdonationCampaign(donationCampaigns);
    }
  }, [donationCampaigns]);

  useEffect(() => {
    setRefresh(true);
  }, []);

  //   useEffect(() => {
  //     setOffset((page - 1) * numberPerPage)
  //   }, [page]);

  //   useEffect(() => {
  //     setBasedonationCampaigns(BlackdonationCampaignss);
  //   }, [BlackdonationCampaignss]);

  //   function handleSearch(event: FormEvent) {
  //     event.preventDefault();
  //     setPage(1);
  //     setFilterEmail(search);
  //   }

  interface StatsItemProps {
    name: string;
    type: string;
    role: string;
    route: string;
  }

  return (
    <>
      <Flex flexDirection="column" w="100%" marginTop={10}>
        <Flex mb="20px" alignItems="center">
          <Spacer />
          <Box>
            <Button
              size="lg"
              leftIcon={<IoIosAdd />}
              className="color_main"
              variant="solid"
              onClick={() => {
                navigate("/donationCampaign/create");
              }}
            >
              Criar nova campanha de doação
            </Button>
          </Box>
        </Flex>
        <Spacer />

        {isLoading ? (
          <MotionBox variants={itemAnimation}>
            <Divider borderColor="100" />

            <Box mx={"auto"} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
              <SimpleGrid
                columns={1}
                spacing={{ base: 5 }}
                minChildWidth="300px"
              >
                {donationCampaign.map((item, index) => (
                  <DonationCampaignCard
                    title={item.name}
                    status={item.status}
                    username={item.username ?? ""}
                    id={item.id}
                    date={item.date}
                    image={item.image}
                    accountability={item.accountability}
                  />
                ))}
              </SimpleGrid>
            </Box>
          </MotionBox>
        ) : (
          <Stack mt="50px">
            <Skeleton height="57px" />
            <Skeleton height="57px" />
            <Skeleton height="57px" />
            <Skeleton height="57px" />
            <Skeleton height="57px" />
            <Skeleton height="57px" />
            <Skeleton height="57px" />
            <Skeleton height="57px" />
            <Skeleton height="57px" />
          </Stack>
        )}
      </Flex>
    </>
  );
};

export default MainDonationCampaign;
