import { Box, Divider, Grid, Heading, Text } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { UserInterfaceData } from "../../../../contexts/ProfileContext";
import { GroceryListContext } from "../../../../contexts/GroceryListContext";
import PartnerCard from "./PartnerCard";

export interface Partner {
  id: number;
  nome: string;
  categoria: string;
  endereco: string;
  imagemUrl: string;
}

const GroceryListPartners = () => {
  const { isLoading, partners, setPartnerPage } =
    useContext(GroceryListContext);

  const [partnersList, setPartnersList] = useState<UserInterfaceData[]>(
    partners ?? []
  );

  // useEffect(() => {
  //   setPartnerPage(true)
  // },[])

  useEffect(() => {
    // console.log(partners);
    if (partners) {
      //   console.log(partners);
      setPartnersList(partners);
    }
  }, [partners]);

  return (
    <Box p={4}>
      <Heading as="h1" size="lg" mb={4}>
        Escolha um parceiro
      </Heading>
      <Divider />
      <Text fontSize={"13px"}>
        Escolha o estabelecimento onde irá ser feito o pedido
      </Text>
      <Grid templateColumns="repeat(3, 1fr)" gap={6} mt="5">
        {partnersList.map((partner) => (
          <PartnerCard partner={partner} />
        ))}
      </Grid>
    </Box>
  );
};

export default GroceryListPartners;
