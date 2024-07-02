import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Image,
  Tag,
  Text,
} from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import { useNavigate } from "react-router-dom";
interface DonationCampaignCardProps {
  title: string;
  status: string;
  username: string;
  id: number;
  date: string;
  image: string;
  accountability: number;
}

export function DonationCampaignCard(props: DonationCampaignCardProps) {
  const { title, status, username, id, date, image, accountability } = props;
  const navigate = useNavigate();
  console.log(accountability);
  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
    >
      <Box
        maxW="sm"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="lg"
        position="relative" // Adicionado para posicionar o botão absolutamente
      >
        <Image
          width={"100%"}
          height={"200px"}
          objectFit="cover"
          src={image && image !== "" ? image : 'https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg'}
          alt="Placeholder image"
        />
      </Box>

      <Flex
        flexDirection="column"
        justifyContent={"space-between"}
        p="6"
        height={"calc(100% - 200px)"}
      >
        <Box>
          <Tag mb="2">{status}</Tag>
          <Heading as="h2" size="lg" mb="2">
            {title}
          </Heading>
          <Text fontSize="14px" color="gray.500" mb="4">
            {moment(date).format("DD/MM/yyyy")}
          </Text>
        </Box>
        <Flex justifyContent={"space-between"}>
          <Button
            colorScheme="facebook"
            mr="2"
            onClick={() => {
              navigate(`/donationCampaign/log/${id}`);
            }}
          >
            {status === "Finalizado" ? "Visualizar" : "Acompanhar"}
          </Button>
          {status === "Pendente" || status === "Em andamento" ? (
            <Button
              colorScheme="facebook"
              mr="2"
              onClick={() => {
                navigate(`/donationCampaign/edit/${id}`);
              }}
            >
              Editar
            </Button>
          ) : status === "Finalizado" && accountability !== 1 ? (
            <Button
              colorScheme="facebook"
              mr="2"
              onClick={() => {
                navigate(`/donationCampaign/accountability/${id}`);
              }}
            >
              Prestar conta
            </Button>
          ) : (
            <></>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}
