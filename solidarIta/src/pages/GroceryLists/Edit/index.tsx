import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Image,
  Input,
  Select,
  SimpleGrid,
  Skeleton,
  Tag,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import React, {
  ChangeEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { parseCookies } from "nookies";
import { UserInterfaceData } from "../../../contexts/ProfileContext";
import {
  GroceryList,
  GroceryListCreate,
} from "../../../contexts/GroceryListContext";
import { ProductsList } from "../../../contexts/ProductListContext";
import api from "../../../services/api";
import TitlePage from "../../../components/TitlePage";
import {
  itemAnimation,
  MotionBox,
} from "../../../components/Styles/motion-animate/animate";

export function GroceryListEdit() {
  const { groceryListId } = useParams();
  const [groceryList, setGroceryList] = useState<GroceryList[]>([]);
  const [productList, setProductList] = useState<ProductsList[]>([]);
  const [productInclude, setProductInclude] = useState<ProductsList[]>([]);
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [goal, setGoal] = useState<string>("");
  const toast = useToast();
  const cookies = parseCookies();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = cookies["id"];
    setIsLoading(false);
    api
      .post("/groceryList/getOne", { id: groceryListId, owner: id })
      .then((response) => {
        console.log(response);
        if (response.data.length === 0) {
          navigate("/*");
        }
        setGroceryList(response.data);
        api
          .post("/products", { id: response.data[0].partner_id })
          .then((response) => {
            setProductList(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
    api
      .post("/products/getProductsList", { id: groceryListId, notPaid: true })
      .then((response) => {
        setProductInclude(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    setIsLoading(true);
  }, []);

  useEffect(() => {
    if (productInclude.length > 0) {
      const newCart = { ...cart };
      for (const product of productInclude) {
        newCart[product.id] = product.amount;
      }
      console.log(newCart);
      setCart(newCart);
    }
  }, [productInclude]);

  useEffect(() => {
    if (groceryList.length > 0) {
      if (
        groceryList[0].status !== "Pendente" &&
        groceryList[0].status !== "Em andamento"
      ) {
        navigate("/*");
      }
      setName(groceryList[0].name);
      setDescription(groceryList[0].description);
      setGoal(groceryList[0].goal);
      setImage(groceryList[0].image);
    }
  }, [groceryList]);

  const handleQuantityChange = (productId: number, quantity: number) => {
    const newCart = { ...cart, [productId]: quantity };
    setCart(newCart);
  };

  const getTotalPrice = () => {
    return Object.keys(cart).reduce((acc, id) => {
      const product = productList.find((p) => p.id === Number(id));
      if (product) {
        return acc + parseFloat(product.price) * cart[parseFloat(id)];
      }
      return acc;
    }, 0);
  };

  const handlerEdit = () => {
    api
      .post("groceryList/edit", {
        data: {
          name,
          description,
          goal,
          ...(image !== groceryList[0].image &&
          image !==
            "https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg"
            ? { image: image }
            : {}),
          products: cart,
          id: groceryListId,
        },
      })
      .then((response: { data: any }) => {
        toast({
          title: "Lista de compras editada com sucesso",
          description: "Lista de compras editada com sucesso",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        navigate("/groceryList/all");
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Erro ao editar pedido",
          description: "Revise as informações e tente novamente",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(file);
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const handlerCancel = () => {
    navigate("/groceryList/all");
  };

  return (
    <>
      <MotionBox variants={itemAnimation} margin="0 auto" padding={"2rem"}>
        <TitlePage title={"Editar lista de compras"} />
        {isLoading && groceryList.length > 0 && productList.length > 0 ? (
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
                  height="175px"
                  width="200px"
                  objectFit="cover"
                  src={
                    image && image !== ""
                      ? image
                      : "https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg"
                  }
                  alt="Selected"
                  mb={"5px"}
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
                <button onClick={() => fileInputRef.current?.click()}>
                  Selecionar arquivo
                </button>
                {fileInputRef.current?.files?.length && (
                  <span>
                    Arquivo selecionado:{" "}
                    {fileInputRef.current.files[0].name.substring(0, 10) +
                      "..."}
                  </span>
                )}
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
                  <Input
                    mt="2"
                    borderColor="200"
                    border="1px solid"
                    borderRadius={"6px"}
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                    }}
                  />
                </Box>
              </GridItem>
              <GridItem colSpan={15}>
                <Input
                  mt="2"
                  borderColor="200"
                  border="1px solid"
                  borderRadius={"6px"}
                  value={description}
                  onChange={(event) => {
                    setDescription(event.target.value);
                  }}
                />
              </GridItem>
              <GridItem colSpan={15}>
                <Input
                  mt="2"
                  borderColor="200"
                  border="1px solid"
                  borderRadius={"6px"}
                  value={goal}
                  onChange={(event) => {
                    setGoal(event.target.value);
                  }}
                />
              </GridItem>
            </Grid>
            <Grid templateColumns="repeat(2, 1fr)" gap={3} mt={5}>
              {productList.map((product) => (
                <GridItem key={product.id}>
                  <Flex
                    borderColor={cart[product.id] > 0 ? "green" : "initial"}
                    borderWidth={cart[product.id] > 0 ? "3px" : "1px"}
                    borderRadius="lg"
                    overflow="hidden"
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    h="100%"
                    maxH={"150px"}
                  >
                    <Flex width="120px" justifyContent={"center"}>
                      <Image
                        src={
                          product.image ??
                          "https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg"
                        }
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
                      <Select
                        // w={"30px"}
                        defaultValue={0}
                        value={cart[product.id]}
                        onChange={(e) =>
                          handleQuantityChange(
                            product.id,
                            parseInt(e.target.value)
                          )
                        }
                      >
                        {Array.from(Array(11).keys()).map((i) => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </Select>
                    </Box>
                  </Flex>
                </GridItem>
              ))}
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
              <Button colorScheme={"facebook"} mr="4" onClick={handlerEdit}>
                Salvar lista de compras
              </Button>
              <Button onClick={handlerCancel}>Cancelar</Button>
            </Box>
          </Box>
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
    </>
  );
}