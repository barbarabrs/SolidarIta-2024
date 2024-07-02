import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionButton,
  AccordionIcon,
  Box,
  Divider,
  Flex,
  Grid,
  GridItem,
  Image,
  SimpleGrid,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Stack,
  Tag,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
  Button,
} from "@chakra-ui/react";
import { ImLock } from "react-icons/im";
import moment from "moment";
import { parseCookies } from "nookies";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TitlePage from "../../../../../components/TitlePage";
import { GroceryList } from "../../../../../contexts/GroceryListContext";
import { ProductsList } from "../../../../../contexts/ProductListContext";
import { UserInterfaceData } from "../../../../../contexts/ProfileContext";
import api from "../../../../../services/api";

export interface Logs {
  created: string;
  description: string;
}

export function MainDetailsCampaign() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { groceryListId } = useParams();
  const [groceryList, setGroceryList] = useState<GroceryList[]>([]);
  const [productList, setProductList] = useState<ProductsList[]>([]);
  const [userData, setUserData] = useState<UserInterfaceData[]>([]);
  const [historyList, setHistoryList] = useState<ProductsList[]>([]);
  const [logs, setLogs] = useState<Logs[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notAllowed, setNotAllowed] = useState<boolean>(false);
  const toast = useToast();
  const navigate = useNavigate();
  const cookies = parseCookies();

  useEffect(() => {
    window.scrollTo(0, 0);
    let res: GroceryList[] = [];
    setIsLoading(false);
    api
      .post("/groceryList/getOne", { id: groceryListId })
      .then((response) => {
        if (response.data.length === 0) {
          navigate("/*");
        }
        res = response.data;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        if (res[0]) {
          setGroceryList(res);
          api
            .post("/products/getProductsList", { id: groceryListId })
            .then((response) => {
              console.log(response);
              setProductList(response.data);
            })
            .catch((error) => {
              console.log(error);
            });
          api
            .post("/User", { id: res[0].owner_id })
            .then((response) => {
              console.log(response.data);
              setUserData([response.data]);
            })
            .catch((error) => {
              console.log(error);
            });
          api
            .post("/groceryList/donorHistory", {
              id: groceryListId,
            })
            .then((response) => {
              console.log(response);
              setHistoryList(response.data);
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          setNotAllowed(true);
        }
      });
    setIsLoading(true);
  }, []);

  const value = (product: ProductsList) => {
    return parseFloat(product.price) * product.amount;
  };

  const getTotalPrice = (paid?: string) => {
    if (paid) {
      return productList
        .filter((product) => product.paid === 1)
        .reduce((acc, product) => {
          return acc + parseFloat(product.price) * product.amount;
        }, 0);
    } else {
      return productList.reduce((acc, product) => {
        return acc + parseFloat(product.price) * product.amount;
      }, 0);
    }
  };

  const handleDelete = () => {
    api
      .post("groceryList/delete", { id: groceryListId })
      .then((response: { data: any }) => {
        toast({
          title: "Lista de compras excluído",
          description: "Lista de compras excluído com sucesso!",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Erro ao realizar o exclusão",
          description: "Revise as informações e tente novamente",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      });
    navigate("/feed");
    onClose();
  };

  return (
    <>
      <TitlePage title={"Detalhe da lista de compras"} />
      {isLoading && groceryList.length > 0 && productList.length > 0 ? (
        <Box>
          <Flex w="100%" justifyContent={"space-between"}>
            <Tag w="fit-content" p="8px 10px" color="grey" fontSize={"18px"}>
              {groceryList[0].status}
            </Tag>
            <Button mr={2} colorScheme={"red"} onClick={onOpen}>
              <ImLock />
              Excluir Lista de compras
            </Button>
          </Flex>
          <Accordion my="5" allowToggle>
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
                    Prestação de conta e transparência
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                {groceryList[0].accountability === 1 ? (
                  <Text
                    color="black"
                    dangerouslySetInnerHTML={{
                      __html: groceryList[0].accountability_message,
                    }}
                  />
                ) : groceryList[0].status === "Finalizado" ? (
                  <Text color="red" textAlign={"center"}>
                    Instituição não prestou contas ainda
                  </Text>
                ) : (
                  <Text textAlign={"center"}>
                    Lista de compra ainda está em processamento
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
                    Pagamentos
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
                  <Text textAlign={"center"}>
                    {" "}
                    Nenhum produto da lista de compras foi pago ainda.
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
                    Informações de entrega
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                {groceryList[0].scheduling && userData[0] ? (
                  <Box w="100%" color="black">
                    <Box>
                      Pedido precisa ser entregue em:{" "}
                      <Text display={"inline"} fontWeight={"bold"}>
                        {moment(groceryList[0].scheduling).format(
                          "DD/MM/yyyy HH:mm:ss"
                        )}
                      </Text>
                    </Box>
                    <Box>
                      Para:{" "}
                      <Text display={"inline"} fontWeight={"bold"}>
                        {groceryList[0].username}
                      </Text>
                    </Box>
                    <Box>
                      No endereço:{" "}
                      <Text display={"inline"} fontWeight={"bold"}>
                        {userData[0].address}
                      </Text>
                    </Box>
                    <Box>
                      Lista de compras finalizada e confirmação de entrega
                      recebida por:{" "}
                      <Text display={"inline"} fontWeight={"bold"}>
                        {groceryList[0].partner}
                      </Text>
                    </Box>
                  </Box>
                ) : groceryList[0].status === "Pendente" ||
                  groceryList[0].status === "Em andamento" ? (
                  <Text textAlign={"center"}>
                    Lista de compra ainda está em processamento
                  </Text>
                ) : (
                  <Text color="red" textAlign={"center"}>
                    Lista de compra não possui informações de entrega
                  </Text>
                )}
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
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
                  borderColor="200"
                  border="1px solid"
                  borderRadius={"6px"}
                  p={"6px"}
                  w="fit-content"
                  onClick={() => {
                    navigate("/institutions/all");
                  }}
                  cursor={"pointer"}
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

          <Grid templateColumns="repeat(11, 2fr)" gap={1} mb="5">
            <GridItem colSpan={5} w="100%">
              <Text textAlign={"center"} mb="10px">
                Itens já pagos
              </Text>
              <Grid templateColumns="repeat(1, 1fr)" gap={3}>
                {productList
                  .filter((product) => product.paid === 1)
                  .map((product) => (
                    <GridItem key={product.id}>
                      <Flex
                        minH={"120px"}
                        borderColor={"grey"}
                        borderWidth={"3px"}
                        borderRadius="lg"
                        overflow="hidden"
                        alignItems={"center"}
                        justifyContent={"space-between"}
                      >
                        <Flex width="120px" justifyContent={"center"}>
                          <Image
                            src={
                              product.image ??
                              "https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg"
                            }
                            alt={product.name}
                            height="120px"
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
                          mr="2"
                          display={"inline-flex"}
                          alignItems={"center"}
                        >
                          <Text mr="1">Qtd.</Text>
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
            </GridItem>
            <GridItem
              display="flex"
              colSpan={1}
              gap={10}
              justifyContent={"center"}
            >
              <Divider
                orientation="vertical"
                borderWidth={"3px"}
                w="fit-content"
                borderColor="black"
              />
            </GridItem>
            <GridItem colSpan={5} w="100%">
              <Text textAlign={"center"} mb="10px">
                Itens pendentes
              </Text>
              <Grid templateColumns="repeat(1, 1fr)" gap={3}>
                {productList
                  .filter((product) => product.paid !== 1)
                  .map((product) => (
                    <GridItem key={product.id}>
                      <Flex
                        minH={"120px"}
                        borderColor={"green"}
                        borderWidth={"3px"}
                        borderRadius="lg"
                        overflow="hidden"
                        alignItems={"center"}
                        justifyContent={"space-between"}
                      >
                        <Flex width="120px" justifyContent={"center"}>
                          <Image
                            src={
                              product.image ??
                              "https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg"
                            }
                            alt={product.name}
                            height="120px"
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
                          mr="2"
                          display={"inline-flex"}
                          alignItems={"center"}
                        >
                          <Text mr="1">Qtd.</Text>
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
            </GridItem>
          </Grid>

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
              Total do pedido: R${getTotalPrice().toFixed(2)}
            </Box>
            <Box
              bg={useColorModeValue( "white", "205d8b")}
              mr="4"
              border="1px black solid"
              p="2px 9px"
              borderRadius={"5px"}
            >
              Total já pago: R${getTotalPrice("paid").toFixed(2)}
            </Box>
          </Box>
          <Modal
            blockScrollOnMount={false}
            isOpen={isOpen}
            onClose={onClose}
            colorScheme={"red"}
          >
            <ModalOverlay />
            <ModalContent
              color={useColorModeValue("gray.800", "white")}
              border={"1px solid red"}
            >
              <ModalHeader color={useColorModeValue("red", "white")}>
                Confirmar exclusão
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <>
                  {" "}
                  Caso haja certeza da exclusão de lista de compras selecionada,
                  aperte em "Excluir". Essa ação apagará totalmente os registros
                  da campanha e a instituição não receberá nenhum dos produtos.
                </>
              </ModalBody>

              <ModalFooter>
                <Button
                  colorScheme={"red"}
                  mr={3}
                  onClick={() => handleDelete()}
                >
                  Excluir
                </Button>
                <Button onClick={onClose} colorScheme="gray">
                  Cancelar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      ) : isLoading && notAllowed ? (
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
