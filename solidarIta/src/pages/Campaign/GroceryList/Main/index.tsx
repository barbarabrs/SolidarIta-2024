import {
  AccordionButton,
  AccordionIcon,
  Accordion,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Image,
  SimpleGrid,
  Skeleton,
  Tag,
  Text,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import moment from "moment";
import { parseCookies } from "nookies";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TitlePage from "../../../../components/TitlePage";
import { GroceryList } from "../../../../contexts/GroceryListContext";
import { ProductsList } from "../../../../contexts/ProductListContext";
import { UserInterfaceData } from "../../../../contexts/ProfileContext";
import api from "../../../../services/api";
import PaymentModal from "../PaymentModal";

export interface Logs {
  created: string;
  description: string;
}

export function MainCampaignGroceryList({
  history,
  finished,
}: {
  history: boolean;
  finished: boolean;
}) {
  const { groceryListId } = useParams();
  const [groceryList, setGroceryList] = useState<GroceryList[]>([]);
  const [productList, setProductList] = useState<ProductsList[]>([]);
  const [historyList, setHistoryList] = useState<ProductsList[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();
  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const cookies = parseCookies();
  const user_id = cookies["id"];
  const type_user = cookies["type"];

  const value = (product: ProductsList) => {
    return parseFloat(product.price) * product.amount;
  };

  const handleCheckboxChange = (productId: number) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  useEffect(() => {
    const donor_id = cookies["id"];
    setIsLoading(false);
    api
      .post("/groceryList/getOne", {
        id: groceryListId,
        user_id: parseInt(user_id),
        ...(!history && !finished ? { user_type: parseInt(type_user) } : {}),
        ...(history ? { donor_id: donor_id } : {}),
      })
      .then((response) => {
        if (
          (finished && response.data[0].status !== "Finalizado") ||
          (history &&
            response.data[0].status !== "Em andamento" &&
            response.data[0].status !== "Esperando entrega" &&
            response.data[0].status !== "Finalizado") ||
          (!history && !finished && response.data[0].status !== "Em andamento")
        ) {
          navigate("/*");
        }
        setGroceryList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    api
      .post("/products/getProductsList", {
        id: groceryListId,
        notPaid: finished ? false : true,
      })
      .then((response) => {
        console.log(response);
        setProductList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    if (history || finished) {
      api
        .post("/groceryList/donorHistory", {
          id: groceryListId,
          ...(history && { donor_id: donor_id }),
        })
        .then((response) => {
          console.log(response);
          setHistoryList(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    setIsLoading(true);
  }, []);

  const getTotalPrice = () => {
    return productList
      .filter((prod) => selectedProducts.includes(prod.id))
      .reduce((acc, product) => {
        return acc + parseFloat(product.price) * product.amount;
      }, 0);
  };

  return (
    <>
      <TitlePage title={"Lista de compras"} />
      {isLoading &&
      groceryList.length > 0 &&
      (history || productList.length > 0 || finished) ? (
        <>
          {history ? (
            <>
              <Tag mb="2">{groceryList[0].status}</Tag>
              <Text fontWeight={"bold"} fontSize="18px">
                Minhas atividades
              </Text>
              <Box border={"1px solid black"} borderRadius={"6px"} p="2">
                {historyList.length > 0 &&
                  historyList.map((product) => (
                    <Box>
                      <Flex
                        key={product.id}
                        w="100%"
                        justifyContent={"space-between"}
                      >
                        <Flex>
                          Pagou
                          <Box fontWeight={"bold"} ml="2">
                            {product.amount} {product.name}
                          </Box>
                        </Flex>
                        <Box>R${value(product).toFixed(2)}</Box>
                      </Flex>
                    </Box>
                  ))}
              </Box>
            </>
          ) : (
            <></>
          )}
          {(history || finished) && groceryList[0].status === "Finalizado" ? (
            <Grid mt="30px">
              <Box>
                <Heading mb={3} fontSize="22px">
                  Prestação de conta e transparência
                </Heading>
              </Box>
              <Divider borderColor="100" />
              <Accordion
                mb="5"
                allowToggle
                color={useColorModeValue("black", "white")}
              >
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box
                        as="span"
                        flex="1"
                        textAlign="left"
                        fontSize={"20px"}
                        fontWeight={"800"}
                        color={
                          groceryList[0].accountability === 1 ? "green" : "red"
                        }
                      >
                        Prestação de contas da instituição:
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    {groceryList[0].accountability === 1 ? (
                      <Text
                        dangerouslySetInnerHTML={{
                          __html: groceryList[0].accountability_message,
                        }}
                      />
                    ) : (
                      <Text color="red" textAlign={"center"}>
                        Instituição não prestou contas ainda
                      </Text>
                    )}
                  </AccordionPanel>
                </AccordionItem>
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box
                        as="span"
                        flex="1"
                        textAlign="left"
                        fontSize={"20px"}
                        fontWeight={"800"}
                        color={"green"}
                      >
                        Quem contribuiu:
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    {historyList.length > 0 ? (
                      <>
                        <Box>
                          {historyList.map((product) => (
                            <Box>
                              <Flex
                                key={product.id}
                                w="100%"
                                justifyContent={"space-between"}
                              >
                                <Flex>
                                  <Box fontWeight={"bold"} mr="2">
                                    {product.username}
                                  </Box>
                                  pagou
                                  <Box fontWeight={"bold"} ml="2">
                                    {product.amount} {product.name}
                                  </Box>
                                </Flex>
                                <Box>R${value(product).toFixed(2)}</Box>
                              </Flex>
                            </Box>
                          ))}
                        </Box>
                      </>
                    ) : (
                      <Text textAlign={"center"}></Text>
                    )}
                  </AccordionPanel>
                </AccordionItem>
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box
                        as="span"
                        flex="1"
                        textAlign="left"
                        fontSize={"20px"}
                        fontWeight={"800"}
                        color={"green"}
                      >
                        Entrega do parceiro:
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    {groceryList[0].scheduling ? (
                      <Box w="100%">
                        <Box>
                          Pedido foi entregue em:{" "}
                          <Text display={"inline"} fontWeight={"bold"}>
                            {moment(groceryList[0].scheduling).format(
                              "DD/MM/yyyy HH:mm:ss"
                            )}
                          </Text>
                        </Box>
                        <Box>
                          De:{" "}
                          <Text display={"inline"} fontWeight={"bold"}>
                            {groceryList[0].partner}
                          </Text>
                        </Box>
                        <Box>
                          Para:{" "}
                          <Text display={"inline"} fontWeight={"bold"}>
                            {groceryList[0].username}
                          </Text>
                        </Box>

                        <Box>
                          Lista de compras finalizada e confirmação de entrega
                          recebida por:{" "}
                          <Text display={"inline"} fontWeight={"bold"}>
                            {groceryList[0].username}
                          </Text>
                        </Box>
                      </Box>
                    ) : (
                      <Text color="red" textAlign={"center"}></Text>
                    )}
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>

              <Divider my="10px" />
            </Grid>
          ) : (
            <></>
          )}
          <Box>
            <Grid
              my={5}
              templateRows="repeat(1, 1fr)"
              templateColumns="repeat(20, 1fr)"
              gap={2}
            >
              <GridItem rowSpan={4} colSpan={4}>
                <Image
                  border={"1px solid lightgrey"}
                  borderRadius={"3%"}
                  height="150px"
                  width="100%"
                  objectFit="cover"
                  src={
                    groceryList[0].image !== ""
                      ? groceryList[0].image
                      : "https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg"
                  }
                  alt="Selected"
                  mb={"5px"}
                />
              </GridItem>
              <GridItem rowSpan={4} colSpan={1}></GridItem>
              <GridItem rowSpan={1} colSpan={15}>
                <Flex justifyContent={"space-between"}>
                  <Button
                    onClick={() => {
                      navigate("/institutions/all");
                    }}
                    cursor={"pointer"}
                    borderColor="200"
                    border="1px solid"
                    borderRadius={"6px"}
                    p={"6px"}
                    w="fit-content"
                  >
                    {groceryList[0].username}
                  </Button>
                  <Button
                    onClick={() => {
                      navigate("/partners/all");
                    }}
                    cursor={"pointer"}
                    display={"block"}
                    color={"green"}
                    borderColor="200"
                    border="1px solid"
                    borderRadius={"6px"}
                    p={"0px 6px"}
                    w="fit-content"
                  >
                    <Text>{groceryList[0].partner}</Text>
                    <Text
                      fontSize={"10px"}
                      color="black"
                      textAlign={"center"}
                      fontWeight={"800"}
                    >
                      Parceiro
                    </Text>
                  </Button>
                </Flex>
                <Box>
                  <Text fontSize="20px" fontWeight={"bold"}>
                    {groceryList[0].name}
                  </Text>
                </Box>
              </GridItem>
              <GridItem colSpan={15}>
                <Text>{groceryList[0].description}</Text>
              </GridItem>
              <GridItem colSpan={15}>
                <Text>{groceryList[0].goal}</Text>
              </GridItem>
            </Grid>

            <Box w="100%">
              <Text textAlign={"center"} mb="10px">
                {history
                  ? "Itens pendentes"
                  : finished
                  ? "Itens da lista"
                  : "Escolha os itens que deseja pagar"}
              </Text>
              <Grid templateColumns="repeat(2, 1fr)" gap={3} mt={5}>
                {productList.map((product) => (
                  <GridItem key={product.id}>
                    <Flex
                      p="0px 10px"
                      borderColor={
                        selectedProducts.includes(product.id)
                          ? "green"
                          : "initial"
                      }
                      borderWidth={
                        selectedProducts.includes(product.id) ? "3px" : "1px"
                      }
                      borderRadius="lg"
                      overflow="hidden"
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      {!finished && !history ? (
                        <Checkbox
                          mr="3"
                          isChecked={selectedProducts.includes(product.id)}
                          onChange={() => handleCheckboxChange(product.id)}
                        />
                      ) : (
                        <></>
                      )}
                      <Flex width="150px" justifyContent={"center"}>
                        <Image
                          src={
                            product.image ??
                            "https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg"
                          }
                          alt={product.name}
                          height="150px"
                        />
                      </Flex>
                      <Box ml="5" flex="1">
                        <Text mt={2} fontSize="xl" fontWeight="semibold">
                          {product.name}
                        </Text>
                        <Text fontSize="md" color="gray.500">
                          {product.description}
                        </Text>
                        <Text mt={2} fontSize="lg" fontWeight="semibold">
                          R${product.price}
                        </Text>
                      </Box>
                      <Box
                        mr="50px"
                        display={"inline-flex"}
                        alignItems={"center"}
                      >
                        <FormLabel>Qtd.</FormLabel>
                        <Text
                          bg={useColorModeValue( "white", "205d8b")}
                          border="1px black solid"
                          p="2px 9px"
                          borderRadius={"5px"}
                        >
                          {product.amount}
                        </Text>
                      </Box>
                    </Flex>
                  </GridItem>
                ))}
              </Grid>
            </Box>

            {history && groceryList[0].status === "Em andamento" ? (
              <Box
                position="fixed"
                bottom="20px"
                right="20px"
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="flex-end"
              >
                <Button
                  colorScheme={"facebook"}
                  mr="4"
                  onClick={() => {
                    navigate(`/campaign/groceryList/${groceryListId}`);
                  }}
                >
                  Ajudar novamente a lista de compras
                </Button>
              </Box>
            ) : (history || finished) &&
              (groceryList[0].status === "Esperando entrega" ||
                groceryList[0].status === "Finalizado") ? (
              <></>
            ) : (
              <Box
                position="fixed"
                bottom="20px"
                right="20px"
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="flex-end"
              >
                <Box
                  bg={useColorModeValue( "white", "205d8b")}
                  mr="4"
                  border="1px black solid"
                  p="2px 9px"
                  borderRadius={"5px"}
                >
                  Total a pagar: R${getTotalPrice().toFixed(2)}
                </Box>

                <PaymentModal
                  grocery_list_id={groceryListId ?? ""}
                  itens={productList.filter((prod) =>
                    selectedProducts.includes(prod.id)
                  )}
                  value={getTotalPrice().toFixed(2)}
                  pix={groceryList[0].pix}
                />
              </Box>
            )}
          </Box>
        </>
      ) : isLoading && groceryList.length === 0 ? (
        <Text textAlign={"center"}>Lista de compra não encontrada</Text>
      ) : (
        <SimpleGrid columns={1} spacing={10}>
          <Skeleton height="60px" />
          <Skeleton height="60px" />
          <Skeleton height="60px" />
          <Skeleton height="60px" />
          <Skeleton height="60px" />
          <Skeleton height="60px" />
          <Skeleton height="60px" />
          <Skeleton height="60px" />
        </SimpleGrid>
      )}
    </>
  );
}
