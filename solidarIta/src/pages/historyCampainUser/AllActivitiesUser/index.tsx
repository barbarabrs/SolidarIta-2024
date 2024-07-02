import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Skeleton,
  Tag,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import moment from "moment";
import { parseCookies } from "nookies";
import React, { useEffect, useState } from "react";
import { ImLock } from "react-icons/im";
import { useNavigate, useParams } from "react-router-dom";
import {
  itemAnimation,
  MotionBox,
} from "../../../components/Styles/motion-animate/animate";
import TitlePage from "../../../components/TitlePage";
import { GroceryList } from "../../../contexts/GroceryListContext";
import { ProductsList } from "../../../contexts/ProductListContext";
import { UserInterfaceData } from "../../../contexts/ProfileContext";
import api from "../../../services/api";

export interface Logs {
  created: string;
  description: string;
}

export function AllActivitiesUser() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { id } = useParams();
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
      .post("/campaigns/history", { donor_id: id })
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
            donor_id: id,
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
      .post("groceryList/delete", { id: id })
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
    <MotionBox variants={itemAnimation} margin="0 auto" padding={"2rem"}>
      <TitlePage title={"Atividades do doador em campanhas"} />
      {isLoading && groceryList.length > 0 && historyList.length > 0 ? (
        <Box>
          <Accordion my="5" allowToggle>
            {groceryList.length > 0 &&
              groceryList.map((grocery) => (
                <AccordionItem>
                  <AccordionButton
                    transition="background-color 0.3s"
                    _hover={{ bg: "rgba(0, 0, 0, 0.1)" }}
                  >
                    <Grid
                      my={5}
                      templateRows="repeat(1, 1fr)"
                      templateColumns="repeat(20, 1fr)"
                      gap={2}
                      w="100%"
                    >
                      <GridItem rowSpan={4} colSpan={4}>
                        <Image
                          border={"1px solid lightgrey"}
                          borderRadius={"3%"}
                          height="150px"
                          width="100%"
                          objectFit="cover"
                          src={
                            grocery.image !== "" ? grocery.image : 'https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg'
                          }
                          alt="Selected"
                          mb={"5px"}
                        />
                      </GridItem>
                      <GridItem rowSpan={4} colSpan={1}></GridItem>
                      <GridItem rowSpan={1} colSpan={15}>
                        <Flex justifyContent={"space-between"}>
                          <Text
                            borderColor="200"
                            border="1px solid"
                            borderRadius={"6px"}
                            p={"6px"}
                            w="fit-content"
                          >
                            {grocery.owner}
                          </Text>
                          <Text
                            color={"green"}
                            borderColor="200"
                            border="1px solid"
                            borderRadius={"6px"}
                            p={"0px 6px"}
                            w="fit-content"
                          >
                            <Text>{grocery.partner}</Text>
                            <Text
                              fontSize={"10px"}
                              color="black"
                              textAlign={"center"}
                              fontWeight={"800"}
                            >
                              Parceiro
                            </Text>
                          </Text>
                        </Flex>
                        <Box textAlign={"start"}>
                          <Text fontSize="20px" fontWeight={"bold"}>
                            {grocery.name}
                          </Text>
                        </Box>
                      </GridItem>
                      <GridItem colSpan={15} textAlign={"start"}>
                        <Text>{grocery.description}</Text>
                      </GridItem>
                      <GridItem colSpan={15} textAlign={"start"}>
                        <Text>{grocery.goal}</Text>
                      </GridItem>
                    </Grid>
                    <AccordionIcon fontSize={"40px"} ml="8px" />
                  </AccordionButton>

                  <AccordionPanel pb={4} borderX={'1px solid black'}>
                    <Text fontWeight={"bold"} fontSize="20px" my="3px">
                      Atividades do doador
                    </Text>
                    <Box border={"1px solid black"} borderRadius={"6px"} p="2" fontSize="18px">
                      {historyList.length > 0 && (
                        <>
                          <Box>
                            {historyList.filter((product) => product.grocerylist === grocery.grocerylist).map((product) => (
                              <Box  my={3}>
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
                      )}
                    </Box>
                  </AccordionPanel>
                </AccordionItem>
              ))}
          </Accordion>
        </Box>
      ) : isLoading && notAllowed ? (
        <Text textAlign={"center"}>Doador não encontrado</Text>
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
    </MotionBox>
  );
}
