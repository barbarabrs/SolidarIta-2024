import {
  Box,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../../../contexts/ProductListContext";
import api from "../../../services/api";

const MainProductsList = () => {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const { id } = useParams();

  useEffect(() => {
    api
      .post("/products", { id: id })
      .then((response) => {
        console.log(response.data);
        setProductsList(response.data);
        // setIsLoading(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <Box p={4}>
        <Heading as="h1" size="lg" mb={4}>
          Produtos
        </Heading>
        <Divider />
        {productsList.length !== 0 ? (
          <>
            <Text fontSize={"13px"}>
              <Flex justifyContent={"space-between"} alignItems={"center"}>
                <Flex
                  borderColor="inherit"
                  border="2px solid"
                  borderRadius={"6px"}
                  p={"6px"}
                  w="fit-content"
                  height={"fit-content"}
                  alignItems={"center"}
                  mt="2px"
                >
                  <Flex width="100px" justifyContent={"center"}>
                    <Image
                      src={productsList[0].user_image ?? 'https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg'}
                      alt={productsList[0].username}
                      height={"100px"}
                      objectFit={"cover"}
                    />
                  </Flex>
                  <Text fontSize={"20px"} fontWeight={"800"}>
                    {productsList[0].username}
                  </Text>
                </Flex>
                <Flex fontSize={"16px"}>{productsList.length} Itens</Flex>
              </Flex>
            </Text>
            <Grid templateColumns="repeat(3, 1fr)" gap={3} mt={5}>
              {productsList.map((product) => (
                <GridItem key={product.id}>
                  <Flex
                    borderColor={"green"}
                    borderWidth={"3px"}
                    borderRadius="lg"
                    overflow="hidden"
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    height={"100%"}
                    maxH={"180px"}
                  >
                    <Flex width="100px" justifyContent={"center"}>
                      <Image
                        src={product.image ?? 'https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg'}
                        alt={product.name}
                        maxH={"120px"}
                        objectFit={"cover"}
                      />
                    </Flex>
                    <Box ml="5" flex="1">
                      <Text mt={2} fontSize="xl" fontWeight="semibold">
                        {product.name}
                      </Text>
                      <Text fontSize="md" color="gray.500">
                        {product.description}
                      </Text>
                    </Box>
                    <Box
                      mr="50px"
                      display={"inline-flex"}
                      alignItems={"center"}
                    >
                      <Text mt={2} fontSize="lg" fontWeight="semibold">
                        R${product.price}
                      </Text>
                    </Box>
                  </Flex>
                </GridItem>
              ))}
            </Grid>
          </>
        ) : (
          <Text textAlign={"center"}>Não há resultados</Text>
        )}
      </Box>
    </>
  );
};

export default MainProductsList;
