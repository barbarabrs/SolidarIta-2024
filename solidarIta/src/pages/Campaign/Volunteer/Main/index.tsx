import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  SimpleGrid,
  Skeleton,
  Stack,
  Tag,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { parseCookies } from "nookies";
import React, { useEffect, useState } from "react";
import { ImLock } from "react-icons/im";
import { NumericFormat } from "react-number-format";
import { useNavigate, useParams } from "react-router-dom";
import TitlePage from "../../../../components/TitlePage";
import { VolunteerCampaign } from "../../../../contexts/VolunteerCampaignContext";
import api from "../../../../services/api";
import SubscribeModal from "../SubscribeModal";

export interface Logs {
  created: string;
  description: string;
}

export interface HistoryList {
  phone: string;
  username: string;
  id: string;
}

export function MainCampaignVolunteer({
  history,
  finished,
  log,
}: {
  history: boolean;
  finished: boolean;
  log: boolean;
}) {
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  const { isOpen: isOpen, onOpen: onOpen, onClose: onClose } = useDisclosure();
  const { volunteerCampaignId } = useParams();
  const [volunteerCampaign, setVolunteerCampaign] = useState<
    VolunteerCampaign[]
  >([]);
  const [historyList, setHistoryList] = useState<HistoryList[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();
  const navigate = useNavigate();
  const cookies = parseCookies();
  const username = cookies["username"];
  const user_id = cookies["id"];
  const type_user = cookies["type"];

  useEffect(() => {
    const donor_id = cookies["id"];
    setIsLoading(false);
    api
      .post("/volunteer/getOne", {
        id: volunteerCampaignId,
        ...(!log ? { user_id: user_id } : {}),
        ...(!history && !finished ? { user_type: parseInt(type_user) } : {}),
        ...(history ? { donor_id: donor_id } : {}),
        ...(log ? { owner: user_id } : {}),
      })
      .then((response) => {
        console.log(response.data);
        if (
          (response.data[0] &&
            finished &&
            response.data[0].status !== "Finalizado" &&
            parseInt(type_user) !== 4) ||
          (history &&
            response.data[0].status !== "Em andamento" &&
            response.data[0].status !== "Esperando entrega" &&
            response.data[0].status !== "Finalizado") ||
          (!log &&
            !history &&
            !finished &&
            response.data[0].status !== "Em andamento")
        ) {
          navigate("/*");
        }
        setVolunteerCampaign(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    api
      .post("/volunteer/donorHistory", {
        id: volunteerCampaignId,
      })
      .then((response) => {
        console.log(response);
        setHistoryList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    setIsLoading(true);
  }, []);

  const handlerFinished = () => {
    api
      .post("volunteer/changeStatus", {
        id: volunteerCampaignId,
        status: "finished",
      })
      .then((response: { data: any }) => {
        toast({
          title: "Campanha de voluntariado finalizada com sucesso",
          description: "Campanha de voluntariado foi finalizada com sucesso",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        navigate("/volunteerCampaign/all");
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Erro ao finalizar campanha de voluntariado",
          description: "Revise as informações e tente novamente",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      });
  };

  const handleDelete = () => {
    api
      .post("volunteer/delete", { id: volunteerCampaignId })
      .then((response: { data: any }) => {
        toast({
          title: "Campanha de voluntariado excluído",
          description: "Campanha de voluntariado excluído com sucesso!",
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

  const formatPhoneNumber = (phoneNumber: string) => {
    const cleaned = ("" + phoneNumber).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phoneNumber;
  };

  return (
    <>
      <TitlePage title={"Campanha de voluntariado"} />
      {isLoading && volunteerCampaign.length > 0 ? (
        <>
          {history ? (
            <Flex justifyContent={"space-between"}>
              <Tag mb="2" h="fit-content">
                {volunteerCampaign[0].status}
              </Tag>
              {/* <Text fontWeight={"bold"} fontSize="18px">
                
              </Text> */}

              <Box p="2">
                <Badge fontWeight={"bold"} fontSize="18px" colorScheme="green">
                  Inscrição na campanha ativa
                </Badge>
              </Box>
            </Flex>
          ) : (
            <></>
          )}
          {parseInt(type_user) === 4 && (
            <Flex w="100%" justifyContent={"space-between"}>
              <Tag w="fit-content" p="8px 10px" color="grey" fontSize={"18px"}>
                {volunteerCampaign[0].status}
              </Tag>
              <Button mr={2} colorScheme={"red"} onClick={onOpenDelete}>
                <ImLock />
                Excluir Campanha de voluntariado
              </Button>
            </Flex>
          )}
          {finished ? (
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
                          volunteerCampaign[0].accountability === 1
                            ? "green"
                            : "red"
                        }
                      >
                        Prestação de contas da instituição:
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    {volunteerCampaign[0].accountability === 1 ? (
                      <Text
                        dangerouslySetInnerHTML={{
                          __html: volunteerCampaign[0].accountability_message,
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
                        color={"#205d8b"}
                      >
                        Quem participou:
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    {historyList.length > 0 ? (
                      <>
                        <Box>
                          {historyList.map((donor) => (
                            <Box>
                              <Flex
                                key={donor.id}
                                w="100%"
                                justifyContent={"space-between"}
                              >
                                <Flex>
                                  <Box fontWeight={"bold"} mr="2">
                                    {donor.username}
                                  </Box>
                                </Flex>
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
              </Accordion>
              <Divider my="10px" />
            </Grid>
          ) : log ? (
            <Flex w="100%" justifyContent={"space-between"}>
              <Tag w="fit-content" p="8px 10px" color="grey" fontSize={"18px"}>
                {volunteerCampaign[0].status}
              </Tag>
              {volunteerCampaign[0].status === "Em andamento" && (
                <Button mr={2} colorScheme={"red"} onClick={onOpen}>
                  <ImLock />
                  Finalizar Campanha
                </Button>
              )}
            </Flex>
          ) : (
            <></>
          )}
          <Box>
            <Grid
              mb={"20px"}
              mt={5}
              templateRows="repeat(3, 1fr)"
              templateColumns="repeat(20, 1fr)"
              gap={2}
            >
              <GridItem rowSpan={2} colSpan={4}>
                <Image
                  border={"1px solid lightgrey"}
                  borderRadius={"3%"}
                  height="150px"
                  width="100%"
                  objectFit="cover"
                  src={
                    volunteerCampaign[0].image !== ""
                      ? volunteerCampaign[0].image
                      : "https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg"
                  }
                  alt="Selected"
                  mb={"5px"}
                />
              </GridItem>
              <GridItem rowSpan={2} colSpan={1}></GridItem>
              <GridItem rowSpan={2} colSpan={10}>
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
                    {volunteerCampaign[0].username}
                  </Button>
                </Flex>
                <Box>
                  <Text fontSize="20px" fontWeight={"bold"}>
                    {volunteerCampaign[0].name}
                  </Text>
                </Box>
                <Text>{volunteerCampaign[0].goal}</Text>
              </GridItem>

              <GridItem rowSpan={2} colSpan={5}>
                <Flex alignItems={"end"} flexDirection={"column"}>
                  <Box
                    color={"green"}
                    mb="10px"
                    cursor={"pointer"}
                    borderColor="200"
                    border="2px solid"
                    borderRadius={"6px"}
                    p={"6px"}
                    w="fit-content"
                    textAlign={"center"}
                  >
                    <Text fontWeight={"bold"}>Data e Horário</Text>
                    <Text>{volunteerCampaign[0].schedule}</Text>
                  </Box>
                  <Box
                    color={"#ffc125"}
                    cursor={"pointer"}
                    borderColor="200"
                    border="2px solid"
                    borderRadius={"6px"}
                    p={"6px"}
                    w="fit-content"
                    textAlign={"center"}
                  >
                    <Text fontWeight={"bold"}>Local</Text>
                    <Text>{volunteerCampaign[0].place}</Text>
                  </Box>
                </Flex>
              </GridItem>
              <GridItem rowSpan={1} colSpan={20}>
                <Text>{volunteerCampaign[0].description}</Text>
              </GridItem>
            </Grid>
            {!finished && (
              <>
               {log && (
                <Text fontSize={"12px"}>
                  *Contate os voluntários pelo número celular
                </Text>)}
                <Box
                  mt="10px"
                  borderColor="200"
                  border="2px solid"
                  borderRadius={"6px"}
                >
                 
                    <Text textAlign={"center"}>Voluntários inscritos</Text>
                  
                </Box>
                <Box
                  w="100%"
                  minH={"calc(100vh - 600px)"}
                  borderColor="200"
                  border="2px solid"
                  borderRadius={"6px"}
                  borderTop={"none"}
                >
                  {historyList.length > 0 &&
                    historyList.map((volun) => (
                      <Flex
                        p="5px 15px"
                        mx="10px"
                        borderBottom="1px solid"
                        justifyContent={"space-between"}
                      >
                        <Text>{volun.username}</Text>
                        {log && <Text>{formatPhoneNumber(volun.phone)}</Text>}
                      </Flex>
                    ))}
                </Box>
              </>
            )}
            {!log && volunteerCampaign[0].status === "Em andamento" ? (
              <Box
                position="fixed"
                bottom="20px"
                right="20px"
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="flex-end"
              >
                <SubscribeModal
                  available={
                    !historyList.some((item) => item.username === username)
                  }
                  place={volunteerCampaign[0].place}
                  volunteer_id={volunteerCampaignId ?? ""}
                  schedule={volunteerCampaign[0].schedule}
                />
              </Box>
            ) : !finished && volunteerCampaign[0].status === "Finalizado" ? (
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
                  Campanha de voluntariado finalizada!
                </Box>{" "}
              </Box>
            ) : (
              <></>
            )}
            <Modal
              blockScrollOnMount={false}
              isOpen={isOpen}
              onClose={onClose}
              colorScheme={"facebook"}
            >
              <ModalOverlay />
              <ModalContent
                color={useColorModeValue("gray.800", "white")}
                // border={"1px solid red"}
              >
                <ModalHeader>Confirmar finalização</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <>
                    {" "}
                    Caso haja certeza de finalizar a campanha de voluntariado
                    selecionada, aperte em "Finalizar". Essa ação finaliza a
                    opção de nova inscrição nesta campanha.
                  </>
                </ModalBody>

                <ModalFooter>
                  <Button
                    colorScheme={"facebook"}
                    mr={3}
                    onClick={() => handlerFinished()}
                  >
                    Finalizar
                  </Button>
                  <Button onClick={onClose} colorScheme="gray">
                    Cancelar
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
            <Modal
              blockScrollOnMount={false}
              isOpen={isOpenDelete}
              onClose={onCloseDelete}
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
                    Caso haja certeza da exclusão de campanha de voluntariado
                    selecionada, aperte em "Excluir". Essa ação apagará
                    totalmente os registros da campanha.
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
                  <Button onClick={onCloseDelete} colorScheme="gray">
                    Cancelar
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Box>
        </>
      ) : isLoading && volunteerCampaign.length === 0 ? (
        <Text textAlign={"center"}>Campanha não encontrada</Text>
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
