import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Image,
  Tag,
  Text,
} from "@chakra-ui/react";
import React, { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
interface CampaignHistoryCardProps {
  title: string;
  type: string;
  description: string;
  owner: string;
  partner?: string;
  id: string;
  image: string;
  owner_image: string;
  partner_image: string;
}

export function CampaignHistoryCard(props: CampaignHistoryCardProps) {
  const {
    title,
    type,
    owner,
    partner,
    id,
    description,
    image,
    owner_image,
    partner_image,
  } = props;
  const navigate = useNavigate();

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
        return "Lista de compra";
      case "volunteering":
        return "Voluntariado";
      default:
        return "";
    }
  };

  const link = (id: string, type: string) => {
    switch (type) {
      case "donate":
        return navigate(`/campaign/donation/view/${parseInt(id)}`);
      case "groceryList":
        return navigate(`/campaign/groceryList/view/${parseInt(id)}`);
      case "volunteering":
        return navigate(`/campaign/volunteer/view/${parseInt(id)}`);
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
          <Tag mb="2">{tagType(type)}</Tag>
          <Text fontSize="md" color="gray.600" mb="4">
            {truncateDescription(description, 70)}
          </Text>
        </Box>
        <Box>
          {type === "groceryList" && partner ? (
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

          <Button
            colorScheme="facebook"
            mr="2"
            onClick={() => {
              link(id, type);
            }}
          >
            Visualizar
          </Button>
        </Box>
      </Flex>
    </Box>
  );
}
