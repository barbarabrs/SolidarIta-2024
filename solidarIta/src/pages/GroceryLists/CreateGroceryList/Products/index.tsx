import {
  Box,
  Button,
  Divider,
  Flex,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { parseCookies } from "nookies";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GroceryListCreate } from "../../../../contexts/GroceryListContext";
import { Product } from "../../../../contexts/ProductListContext";
import api from "../../../../services/api";

const GroceryListProducts = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const { isLoading, products } = useContext(GroceryListContext);
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [data, setData] = useState<GroceryListCreate[]>([]);
  const { partner } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const cookies = parseCookies();

  useEffect(() => {
    api
      .post("/products", { id: partner })
      .then((response) => {
        console.log(response.data);
        setProductsList(response.data);
        // setIsLoading(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleQuantityChange = (productId: number, quantity: number) => {
    const newCart = { ...cart, [productId]: quantity };
    setCart(newCart);
  };

  const getTotalPrice = () => {
    return Object.keys(cart).reduce((acc, id) => {
      const product = productsList.find((p) => p.id === Number(id));
      if (product) {
        return acc + parseFloat(product.price) * cart[parseFloat(id)];
      }
      return acc;
    }, 0);
  };

  const handleOrderSubmit = () => {
    if (
      localStorage.getItem("groceryListName") !== null &&
      localStorage.getItem("groceryListDescription") !== null &&
      localStorage.getItem("groceryListGoal") !== null &&
      localStorage.getItem("groceryListImage") !== null
    ) {
      setData([
        {
          name: localStorage.getItem("groceryListName") ?? "",
          description: localStorage.getItem("groceryListDescription") ?? "",
          goal: localStorage.getItem("groceryListGoal") ?? "",
          image: localStorage.getItem("groceryListImage") ?? "",
          products: cart,
          partner_id: parseInt(partner ?? "0"),
          owner_id: parseInt(cookies["id"]),
        },
      ]);
      onOpen();
    } else {
      toast({
        title: "Não é possível finalizar pedido",
        description: "Informações da campanha não estão completas",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    // setData()
  };

  const handleOrder = () => {
    localStorage.removeItem("groceryListName");
    localStorage.removeItem("groceryListDescription");
    localStorage.removeItem("groceryListGoal");
    localStorage.removeItem("groceryListImage");
    console.log(data);
    api
      .post("groceryList/add", { data })
      .then((response: { data: any }) => {
        toast({
          title: "Pedido feito com sucesso",
          description: "Pedido enviado ao parceiro",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        navigate("/groceryList/all");
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Erro ao realizar o pedido",
          description: "Revise as informações e tente novamente",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      });
    onClose();
  };

  return (
    <>
      <Box p={4}>
        <Heading as="h1" size="lg" mb={4}>
          Escolha os produtos de sua compra
        </Heading>
        <Divider />
        <Text fontSize={"13px"}>
          Ao escolher seus items de compras, seu pedido será enviado ao
          estabelecimento para ser aprovado
        </Text>
        <Grid templateColumns="repeat(2, 1fr)" gap={3} mt={5}>
          {productsList.map((product) => (
            <GridItem key={product.id}>
              <Flex
                borderColor={cart[product.id] > 0 ? "green" : "initial"}
                borderWidth={cart[product.id] > 0 ? "3px" : "1px"}
                borderRadius="lg"
                overflow="hidden"
                alignItems={"center"}
                justifyContent={"space-between"}
                height={"100%"}
                maxH={"150px"}
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
                  <Text mt={2} fontSize="lg" fontWeight="semibold">
                    R${product.price}
                  </Text>
                </Box>
                <Box mr="50px" display={"inline-flex"} alignItems={"center"}>
                  <FormLabel>Qtd.</FormLabel>
                  <Select
                    // w={"30px"}
                    defaultValue={0}
                    value={cart[product.id]}
                    onChange={(e) =>
                      handleQuantityChange(product.id, parseInt(e.target.value))
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
        <Box mt={4} textAlign="right">
          <Text fontSize="lg" fontWeight="bold">
            Total: R${getTotalPrice().toFixed(2)}
          </Text>
          <Button
            mt={4}
            colorScheme="facebook"
            onClick={handleOrderSubmit}
            isDisabled={getTotalPrice() === 0}
          >
            Finalizar Pedido
          </Button>
        </Box>
      </Box>
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent color={useColorModeValue("gray.800", "white")}>
          <ModalHeader color={useColorModeValue("#205d8b", "white")}>
            Confirmar pedido
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Ao enviar o pedido da lista de compra, o estabelecimento responsável
            será notificado e sua lista ficará pendente até seu pedido ser
            aceito, você pode acompanhar pela tela de listas de compras
            <br />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme={"facebook"}
              mr={3}
              onClick={() => handleOrder()}
            >
              Enviar pedido
            </Button>
            <Button onClick={onClose} colorScheme="gray">
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroceryListProducts;
