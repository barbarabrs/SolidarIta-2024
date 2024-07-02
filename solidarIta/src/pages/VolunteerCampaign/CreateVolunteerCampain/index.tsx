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
import { VolunteerCampaign, VolunteerCampaignProvider } from "../../../contexts/VolunteerCampaignContext";

const CreateVolunteerCampaign = ({ edit }: { edit: boolean }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [image, setImage] = useState<string>(
    "https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg"
  );
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [goal, setGoal] = useState<string>("");
  const [place, setPlace] = useState<string>("");
  const [schedule, setSchedule] = useState<string>("");
  const [userData, setUserData] = useState<UserInterfaceData[]>([]);
  const [volunteerCampaign, setVolunteerCampaign] = useState<
    VolunteerCampaign[]
  >([]);
  const cookies = parseCookies();
  const { volunteerCampaignId } = useParams();
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
        .post("/volunteer/getOne", { id: volunteerCampaignId, owner: id })
        .then((response) => {
          console.log(response);
          if (response.data.length === 0) {
            navigate("/*");
          }
          setVolunteerCampaign(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  useEffect(() => {
    if (volunteerCampaign[0]) {
      setName(volunteerCampaign[0].name);
      setDescription(volunteerCampaign[0].description);
      setGoal(volunteerCampaign[0].goal);
      setPlace(volunteerCampaign[0].place);
      setSchedule(volunteerCampaign[0].schedule);
      setImage(
        volunteerCampaign[0].image ??
          "https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg"
      );
    }
  }, [volunteerCampaign]);

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

  const handleVolunteerCampaign = () => {
    if (edit) {
      api
        .post("volunteer/edit", {
          id: volunteerCampaignId,
          name,
          description,
          place,
          schedule,
          ...(image !== volunteerCampaign[0].image &&
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
          navigate("/volunteerCampaign/all");
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
        .post("volunteer/add", {
          name,
          description,
          goal,
          place,
          schedule,
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
          navigate("/volunteerCampaign/all");
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
    navigate("/volunteerCampaign/all");
  };

  return (
    <VolunteerCampaignProvider>
      <MotionBox variants={itemAnimation} margin="0 auto" padding={"0 2rem"}>
        <Box width={"100%"} p={4}>
          <Heading as="h1" size="lg" mb={4}>
            {edit ? "Editar " : "Criar "} campanha de voluntariado
          </Heading>
          <Divider />
          <Text fontSize={"13px"}>
            Crie sua campanha de voluntariado com um propósito claro e uma causa
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
                    <FormLabel htmlFor="title">Título</FormLabel>
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
              <GridItem rowSpan={1} colSpan={4}>
                <FormControl isRequired>
                  <FormLabel htmlFor="description">Local</FormLabel>
                  <Input
                    id="title"
                    max-length="300"
                    borderColor="100"
                    type="text"
                    placeholder="Defina o local onde a ação de voluntariado ocorrerá"
                    value={place}
                    onChange={(event) => {
                      setPlace(event.target.value);
                    }}
                  />
                </FormControl>
              </GridItem>
              <GridItem rowSpan={1} colSpan={4}>
                <FormControl isRequired>
                  <FormLabel htmlFor="date">Data e Horário</FormLabel>
                  <Input
                    id="title"
                    max-length="300"
                    borderColor="100"
                    type="text"
                    placeholder="Defina o horário em que a ação de voluntariado ocorrerá"
                    value={schedule}
                    onChange={(event) => {
                      setSchedule(event.target.value);
                    }}
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
              Para fazer isso, acesse a campanha de voluntariado e selecione
              "Prestar conta". A Ausência de prestação de contas pode levar à
              exclusão da conta.
            </Text>
          </form>
          <Box mt={4} textAlign="right">
            <Button
              mt={4}
              colorScheme="facebook"
              onClick={handleCreate}
              isDisabled={name === ""}
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
                ` Ao criar a campanha de voluntariado, ela estará disponível para todos os
            usuários visualizarem e se inscreverem. Você pode acompanhar a campanha pela
            tela de campanhas de voluntariado.`}
              <br />
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme={"facebook"}
                mr={3}
                onClick={() => handleVolunteerCampaign()}
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
    </VolunteerCampaignProvider>
  );
};
export default CreateVolunteerCampaign;
