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
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
interface CampaignCardProps {
  title: string;
  campaign_type: string;
  description: string;
  owner: string;
  partner?: string;
  id: string;
  image: string;
  owner_image: string;
  partner_image: string;
  status: string;
}

export function CampaignCard(props: CampaignCardProps) {
  const {
    title,
    campaign_type,
    owner,
    partner,
    id,
    description,
    image,
    owner_image,
    partner_image,
    status,
  } = props;
  const navigate = useNavigate();
  const { type } = useContext(AuthContext);

  const truncateDescription = (text: string, limit: number) => {
    if (text.length <= limit) {
      return text;
    }
    return text.slice(0, limit) + "...";
  };

  const tagType = (type: string) => {
    switch (type) {
      case "donate":
        return "Doação";
      case "groceryList":
        return "Lista de Compra";
      case "volunteering":
        return "Voluntariado";
      default:
        return "";
    }
  };

  const buttonType = (type: string) => {
    if (status === "Em andamento") {
      switch (type) {
        case "donate":
          return "Doar";
        case "groceryList":
          return "Ajude na lista de compras";
        case "volunteering":
          return "Inscrever-se";
        default:
          return "";
      }
    } else if (status === "Finalizado") {
      return "Visualizar";
    } else {
      return "Não disponível";
    }
  };

  const link = (id: string, type: string) => {
    switch (type) {
      case "donate":
        return status === "Em andamento"
          ? navigate(`/campaign/donation/${parseInt(id)}`)
          : navigate(`/campaign/donation/accountability/${parseInt(id)}`);
      case "groceryList":
        return status === "Em andamento"
          ? navigate(`/campaign/groceryList/${parseInt(id)}`)
          : navigate(`/campaign/groceryList/accountability/${parseInt(id)}`);
      case "volunteering":
        return status === "Em andamento"
          ? navigate(`/campaign/volunteer/${parseInt(id)}`)
          : navigate(`/campaign/volunteer/accountability/${parseInt(id)}`);
      default:
        return "";
    }
  };

  const linkAdmin = (id: string, type: string) => {
    switch (type) {
      case "donate":
        return navigate(`/campaign/donation/detail/${parseInt(id)}`);
      case "groceryList":
        return navigate(`/campaign/groceryList/detail/${parseInt(id)}`);
      case "volunteering":
        return navigate(`/campaign/volunteer/detail/${parseInt(id)}`);
      default:
        return "";
    }
  };

  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
    >
      <Image
        width={"100%"}
        height={"200px"}
        objectFit="cover"
        src={
          image && image !== ""
            ? image
            : "https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg"
        }
        alt={title}
      />
      <Flex
        flexDirection="column"
        justifyContent={"space-between"}
        p="6"
        height={"calc(100% - 200px)"}
      >
        <Box>
          <Heading as="h2" size="lg" mb="2">
            {title}
          </Heading>

          {parseInt(type) === 4 ? (
            <Flex justifyContent={"space-between"} w="100%">
              <Tag mb="2">{tagType(campaign_type)}</Tag>{" "}
              <Tag mb="2" backgroundColor={"yellow"}>
                {status}
              </Tag>
            </Flex>
          ) : (
            <Tag mb="2">Campanha de {tagType(campaign_type)}</Tag>
          )}

          <Text fontSize="md" color="gray.600" mb="4">
            {truncateDescription(description, 70)}
          </Text>
        </Box>
        <Box>
          {campaign_type === "groceryList" && partner ? (
            <Flex justifyContent={"space-around"} mb="3">
              <Flex
                flexDirection="column"
                fontSize={"12px"}
                alignItems={"center"}
              >
                <Text color="grey">Criado por</Text>
                <Image
                  borderRadius="full"
                  boxSize="40px"
                  src={
                    owner_image && owner_image !== ""
                      ? owner_image
                      : "https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg"
                  }
                  alt={truncateDescription(owner, 10)}
                />
                <Heading fontSize={"15px"} colorScheme={"facebook"}>
                  {truncateDescription(owner, 10)}
                </Heading>
              </Flex>
              <Divider
                height={"auto"}
                borderColor="blue.500"
                borderWidth="1px"
                orientation="vertical"
              />
              <Flex
                flexDirection="column"
                fontSize={"12px"}
                alignItems={"center"}
              >
                <Text color="grey">Parceiro</Text>
                <Image
                  borderRadius="full"
                  boxSize="40px"
                  src={
                    partner_image && partner_image !== ""
                      ? partner_image
                      : "https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg"
                  }
                  alt={truncateDescription(partner, 10)}
                />
                <Heading fontSize={"15px"} colorScheme={"facebook"}>
                  {truncateDescription(partner, 10)}
                </Heading>
              </Flex>
            </Flex>
          ) : (
            <Flex justifyContent={"space-around"} mb="3">
              <Flex
                flexDirection="column"
                fontSize={"12px"}
                alignItems={"center"}
              >
                <Text color="grey">Criado por</Text>
                <Image
                  borderRadius="full"
                  boxSize="40px"
                  src={
                    owner_image && owner_image !== ""
                      ? owner_image
                      : "https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg"
                  }
                  alt={truncateDescription(owner, 10)}
                />
                <Heading fontSize={"15px"} colorScheme={"facebook"}>
                  {truncateDescription(owner, 10)}
                </Heading>
              </Flex>
            </Flex>
          )}
          {parseInt(type) === 4 ? (
            <Button
              colorScheme="facebook"
              onClick={() => {
                linkAdmin(id, campaign_type);
              }}
            >
              Acompanhar campanha
            </Button>
          ) : status === "Em andamento" || status === "Finalizado" ? (
            <Button
              colorScheme="facebook"
              onClick={() => {
                link(id, campaign_type);
              }}
            >
              {buttonType(campaign_type)}
            </Button>
          ) : (
            <></>
          )}
        </Box>
      </Flex>
    </Box>
  );
}
