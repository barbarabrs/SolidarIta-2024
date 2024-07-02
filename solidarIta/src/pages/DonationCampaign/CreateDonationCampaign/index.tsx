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
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  ButtonGroup,
  Divider,
  Heading,
  useToast,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { NumericFormat } from "react-number-format";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  itemAnimation,
  MotionBox,
} from "../../../components/Styles/motion-animate/animate";
import TitlePage from "../../../components/TitlePage";
import { parseCookies } from "nookies";
import { UserInterfaceData } from "../../../contexts/ProfileContext";
import api from "../../../services/api";
import { DonationCampaign, DonationCampaignProvider } from "../../../contexts/DonationCampaignContext";

const CreateDonationCampaign = ({ edit }: { edit: boolean }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [image, setImage] = useState<string>(
    "https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg"
  );
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [goal, setGoal] = useState<string>("");
  const [goalRes, setGoalRes] = useState<string>("0");
  const [userData, setUserData] = useState<UserInterfaceData[]>([]);
  const [donationCampaign, setDonationCampaign] = useState<DonationCampaign[]>(
    []
  );
  const cookies = parseCookies();
  const { donationCampaignId } = useParams();
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
    if (edit) {
      const id = cookies["id"];
      api
        .post("/donation/getOne", { id: donationCampaignId, owner: id })
        .then((response) => {
          console.log(response);
          if (response.data.length === 0) {
            navigate("/*");
          }
          setDonationCampaign(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  useEffect(() => {
    if (donationCampaign[0]) {
      setName(donationCampaign[0].name);
      setDescription(donationCampaign[0].description);
      setGoal(donationCampaign[0].goal.replace(".", ","));
      setImage(
        donationCampaign[0].image ??
          "https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg"
      );
    }
  }, [donationCampaign]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const newValue = goal.split(",");
    if (newValue.length > 1) {
      setGoalRes(
        `${newValue[0]},${
          newValue[1].length < 2
            ? `${newValue[1]}00`.substring(0, 2)
            : newValue[1].substring(0, 2)
        }`
      );
    } else {
      if (goal !== "") {
        setGoalRes(`${newValue},00`);
      } else {
        setGoalRes(`00,00`);
      }
    }
    console.log(goalRes);
  }, [goal]);

  const handleCreate = (event: FormEvent) => {
    event.preventDefault();
    if (userData[0].address) {
      onOpen();
    } else {
      toast({
        title: "Erro ao criar campanha",
        description:
          "É necessário ter o endereço cadastrado antes de criar uma campanha. Vá em perfil > editar endereço",
        status: "error",
        duration: 10000,
        isClosable: true,
      });
      return "";
    }
  };

  const handleDonationCampaign = () => {
    if (edit) {
      api
        .post("donation/edit", {
          id: donationCampaignId,
          name,
          description,
          ...(image !== donationCampaign[0].image &&
          image !==
            "https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg"
            ? { image: image }
            : {}),
        })
        .then((response: { data: any }) => {
          toast({
            title: "Campanha editada!",
            description: "Campanha editada com sucesso",
            status: "success",
            duration: 4000,
            isClosable: true,
          });
          navigate("/donationCampaign/all");
        })
        .catch((error) => {
          console.log(error);
          toast({
            title: "Erro ao realizar o edição",
            description: "Revise as informações e tente novamente",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
        });
      onClose();
    } else {
      api
        .post("donation/add", {
          name,
          description,
          goal: goalRes.replace(/[^\d,]/g, "").replace(",", "."),
          image,
          owner_id: parseInt(cookies["id"]),
        })
        .then((response: { data: any }) => {
          toast({
            title: "Campanha criada!",
            description: "Campanha criada com sucesso",
            status: "success",
            duration: 4000,
            isClosable: true,
          });
          navigate("/donationCampaign/all");
        })
        .catch((error) => {
          console.log(error);
          toast({
            title: "Erro ao realizar criação",
            description: "Revise as informações e tente novamente",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
        });
      onClose();
    }
  };

  const handleCancel = () => {
    navigate("/donationCampaign/all");
  };

  return (
    <DonationCampaignProvider>
      <MotionBox variants={itemAnimation} margin="0 auto" padding={"0 2rem"}>
        <Box width={"100%"} p={4}>
          <Heading as="h1" size="lg" mb={4}>
            {edit ? "Editar " : "Criar "} campanha de doação
          </Heading>
          <Divider />
          <Text fontSize={"13px"}>
            Crie sua campanha de doação com um propósito claro e uma causa
            definida, permitindo que outras pessoas contribuam financeiramente
            para a sua instituição!
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
                    <FormLabel htmlFor="title" m={0} p={0}>
                      Título
                    </FormLabel>
                    {edit ? (
                      <Text fontSize={"10px"} p={0} m={0} color="red">
                        O título não pode ser editado
                      </Text>
                    ) : (
                      <></>
                    )}

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
                      readOnly={edit}
                    />
                  </FormControl>
                </Box>
              </GridItem>
              <GridItem rowSpan={3} colSpan={4}>
                <FormControl isRequired>
                  <FormLabel htmlFor="description">
                    Valor a se arrecadar
                  </FormLabel>
                  <NumericFormat
                    border="none"
                    borderBottom={"1px solid black"}
                    id="goal"
                    customInput={Input}
                    thousandSeparator="."
                    decimalSeparator=","
                    allowNegative={false}
                    isNumericString
                    prefix={"R$ "}
                    placeholder="Valor"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    decimalScale={2}
                  />
                </FormControl>
              </GridItem>
            </Grid>
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
            <Divider borderWidth={"2px"} />
            <Text fontSize={"13px"}>
              "É obrigatório prestar contas de todas as campanhas finalizadas.
              Para fazer isso, acesse a campanha de doação e selecione "Prestar
              conta". A Ausência de prestação de contas pode levar à exclusão da
              conta.
            </Text>
          </form>
          <Box mt={4} textAlign="right">
            <Text fontSize="lg" fontWeight="bold">
              Valor da Campanha: {goalRes}
            </Text>
            <Button
              mt={4}
              colorScheme="facebook"
              onClick={handleCreate}
              isDisabled={goal === ""}
            >
              {edit ? "Editar " : "Criar "} campanha
            </Button>
          </Box>
        </Box>
        <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent color={useColorModeValue("gray.800", "white")}>
            <ModalHeader color={useColorModeValue("#205d8b", "white")}>
              Confirmar campanha
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {!edit &&
                ` Ao criar a campanha de doação, ela estará disponível para todos os
            usuários visualizarem e doarem. Você pode acompanhar a campanha pela
            tela de campanhas de doação.`}
              <br />
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme={"facebook"}
                mr={3}
                onClick={() => handleDonationCampaign()}
              >
                {edit ? "Editar campanha" : "Criar Campanha"}
              </Button>
              <Button onClick={onClose} colorScheme="gray">
                Cancelar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </MotionBox>
    </DonationCampaignProvider>
  );
};
export default CreateDonationCampaign;
