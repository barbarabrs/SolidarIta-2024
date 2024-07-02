import { Badge, Box, Flex, GridItem, Img, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserInterfaceData } from "../../../../../contexts/ProfileContext";

const PartnerCard = ({ partner }: { partner: UserInterfaceData }) => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const navigate = useNavigate();

  return (
    <GridItem
      key={partner.id}
      onClick={() => {
        navigate(`/groceryList/create/products/${partner.id}`);
      }}
    >
      <Flex
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        transition="transform 0.2s"
        transform={hoveredId === partner.id ? "scale(1.05)" : "scale(1)"}
        onMouseEnter={() => setHoveredId(partner.id)}
        onMouseLeave={() => setHoveredId(null)}
        cursor="pointer"
        h="100%"
        maxH={"200px"}
      >
        <Box h="100%" w="100px">
          <Img
            src={partner.image ?? 'https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg'}
            alt={partner.username}
            w="100px"
            height={"inherit"}
            objectFit={"cover"}
          />
        </Box>
        <Box p="4" flex={1}>
          <Box d="flex" alignItems="baseline">
            <Badge borderRadius="full" px="2" colorScheme="teal">
              {partner.category}
            </Badge>
          </Box>
          <Text mt="1" fontWeight="semibold" as="h4" lineHeight="tight">
            {partner.username}
          </Text>
          <Box>{partner.social_reason}</Box>
        </Box>
      </Flex>
    </GridItem>
  );
};

export default PartnerCard;
