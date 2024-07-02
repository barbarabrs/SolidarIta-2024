import {
  Box,
  Button, Divider,
  Flex,
  Heading,
  Image,
  Tag,
  Text
} from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import { useNavigate } from "react-router-dom";
interface OrdersCardProps {
  title: string;
  status: string;
  username: string;
  id: number;
  date: string;
  image: string;
}

export function OrdersCard(props: OrdersCardProps) {
  const { title, status, username, id, date,image } = props;
  const navigate = useNavigate();

  const buttonText = (status: string) => {
    switch (status) {
      case "Pendente":
        return "Visualizar e Aprovar";
      case "Em andamento":
        return "Acompanhar";
      case "Esperando entrega":
        return "Acompanhar";
      case "Finalizado":
        return "Visualizar";
      default:
        return "Visualizar";
    }
  };

  const link = (status: string, id: number) => {
    switch (status) {
      case "Pendente":
        return `/orders/pending/${id}`;
      case "Em andamento":
        return `/orders/inProgress/${id}`;
      case "Esperando entrega":
        return `/orders/awaitingDelivery/${id}`;
      case "Finalizado":
        return `/orders/finished/${id}`;
      case "cancelado":
        return `/orders/canceled/${id}`;
      default:
        return `/orders`;
    }
  };

  return (
    <Box
      w="320px"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
    >
      <Image
        width={"100%"}
        height={"200px"}
        objectFit="cover"
        src={image !== "" ? image : 'https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg'}
        alt="Placeholder image"
      />
      <Flex
        flexDirection="column"
        justifyContent={"space-between"}
        p="6"
        height={"calc(100% - 200px)"}
      >
        <Box>
          {status === "Pendente" ? <Tag mb="2">{status}</Tag> : <></>}
          <Heading as="h2" size="lg" mb="2">
            {title}
          </Heading>
          <Text fontSize="14px" color="gray.500">
            {moment(date).format("DD/MM/yyyy")}
          </Text>
          <Text textAlign={"center"} fontSize="12px" color="gray.500">
            Instituição
          </Text>
          <Flex justifyContent={"center"}>
            <Divider width={"40%"} borderWidth={"2px"} />
          </Flex>

          <Text fontSize="17px" color="gray.600" mb="4" textAlign={"center"}>
            {username}
          </Text>
        </Box>
        <Flex justifyContent={"space-between"}>
          <Button
            colorScheme="facebook"
            mr="2"
            onClick={() => {
              navigate(link(status, id));
            }}
          >
            {buttonText(status)}
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
