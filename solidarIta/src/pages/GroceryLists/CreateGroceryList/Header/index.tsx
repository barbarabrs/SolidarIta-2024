import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Text,
  Image,
  Textarea,
  ButtonGroup,
  Divider,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  itemAnimation,
  MotionBox,
} from "../../../../components/Styles/motion-animate/animate";
import TitlePage from "../../../../components/TitlePage";
import { parseCookies } from "nookies";
import { UserInterfaceData } from "../../../../contexts/ProfileContext";
import api from "../../../../services/api";

const GroceryListHeader = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [goal, setGoal] = useState<string>("");
  const [userData, setUserData] = useState<UserInterfaceData[]>([]);
  const cookies = parseCookies();
  const toast = useToast();

  useEffect(() => {
    const id = cookies["id"];
    api
      .post("/User", { id })
      .then((response) => {
        setUserData([response.data]);
      })
      .catch((error) => {
        console.log(error);
      });
    setName(localStorage.getItem("groceryListName") ?? "");
    setDescription(localStorage.getItem("groceryListDescription") ?? "");
    setGoal(localStorage.getItem("groceryListGoal") ?? "");
    setImage(
      localStorage.getItem("groceryListImage") ??
        "https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg"
    );
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const handleCreate = (event: FormEvent) => {
    event.preventDefault();
    if (userData[0].address) {
      localStorage.setItem("groceryListName", name);
      localStorage.setItem("groceryListDescription", description);
      localStorage.setItem("groceryListGoal", goal);
      localStorage.setItem("groceryListImage", image);
      navigate("/groceryList/create/partners");
      return "";
    } else {
      toast({
        title: "Erro ao aceitar pedido",
        description:
          "É necessário ter o endereço cadastrado antes de criar um pedido. Vá em perfil > editar endereço",
        status: "error",
        duration: 10000,
        isClosable: true,
      });
      return "";
    }
  };

  const handleCancel = () => {
    localStorage.removeItem("groceryListName");
    localStorage.removeItem("groceryListDescription");
    localStorage.removeItem("groceryListGoal");
    localStorage.removeItem("groceryListImage");
    navigate("/groceryList/all");
  };

  return (
    <>
      <Box width={"100%"} p={4}>
        <Heading as="h1" size="lg" mb={4}>
          Criar Lista de compras
        </Heading>
        <Divider />
        <Text fontSize={"13px"}>
          Crie sua campanha de lista de compras compartilhada com um propósito
          claro e uma causa definida, permitindo que outras pessoas contribuam
          financeiramente para os itens que você precisa!
        </Text>
        <form onSubmit={handleCreate}>
          <Grid
            my={5}
            h="320px"
            templateRows="repeat(5, 1fr)"
            templateColumns="repeat(6, 1fr)"
            gap={4}
          >
            <GridItem rowSpan={5} colSpan={2}>
              <FormControl>
                <FormLabel htmlFor="title">Foto para a campanha</FormLabel>
                <Image
                  border={"1px solid lightgrey"}
                  borderRadius={"3%"}
                  height="250px"
                  width="100%"
                  objectFit="cover"
                  src={image}
                  alt="Selected"
                  mb={"5px"}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </FormControl>
            </GridItem>
            <GridItem rowSpan={1} colSpan={4}>
              <Box>
                <FormControl isRequired>
                  <FormLabel htmlFor="title">Título</FormLabel>
                  <Input
                    id="title"
                    max-length="300"
                    borderColor="100"
                    type="text"
                    placeholder="Crie um título para sua campanha"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                    }}
                  />
                </FormControl>
              </Box>
            </GridItem>
            <GridItem rowSpan={3} colSpan={4}>
              <FormControl isRequired mb={4}>
                <FormLabel htmlFor="description">Descrição</FormLabel>
                <Textarea
                  value={description}
                  onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                    const inputText = event.target.value;
                    setDescription(inputText.slice(0, 500));
                  }}
                  placeholder="Descreva brevemente sua campanha"
                  size="md"
                  height={"150px"}
                />
                <Box mt={2} textAlign="right">
                  <Text
                    fontSize="sm"
                    color={description.length === 500 ? "red" : "gray"}
                  >
                    {description.length}/{500}
                  </Text>
                </Box>
              </FormControl>
            </GridItem>
          </Grid>
          <FormControl isRequired mb={4}>
            <FormLabel htmlFor="goal">Objetivo</FormLabel>
            <Textarea
              value={goal}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                const inputText = event.target.value;
                setGoal(inputText.slice(0, 400));
              }}
              placeholder="Descreva brevemente o objetivo da campanha"
              size="md"
              height={"100px"}
            />
            <Box mt={2} textAlign="right">
              <Text
                fontSize="sm"
                color={goal.length === 400 ? "red" : "gray"}
              >
                {goal.length}/{400}
              </Text>
            </Box>
          </FormControl>
          <Divider borderWidth={"2px"} />
          <Text fontSize={"13px"}>
            "É obrigatório prestar contas de todas as campanhas finalizadas.
            Para fazer isso, acesse a lista de compras e selecione "Prestar
            conta". A Ausência de prestação de contas pode levar à exclusão da
            conta.
          </Text>
          <br></br>
          <ButtonGroup size="md" d="flex" justifyContent="flex-end">
            <Button colorScheme="facebook" type="submit" value="submit">
              Próximo
            </Button>
            <Button colorScheme="gray" onClick={handleCancel}>
              Cancelar
            </Button>
          </ButtonGroup>
        </form>
      </Box>
    </>
  );
};
export default GroceryListHeader;
