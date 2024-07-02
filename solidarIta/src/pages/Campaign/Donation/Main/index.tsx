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
import { DonationCampaign } from "../../../../contexts/DonationCampaignContext";
import api from "../../../../services/api";
import PaymentModal from "../PaymentModal";

export interface Logs {
  created: string;
  description: string;
}

export interface HistoryList {
  amount: string;
  username: string;
  id: string;
}

export function MainCampaignDonation({
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

  const { donationCampaignId } = useParams();
  const [donationCampaign, setDonationCampaign] = useState<DonationCampaign[]>(
    []
  );
  const [historyList, setHistoryList] = useState<HistoryList[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();
  const navigate = useNavigate();
  const cookies = parseCookies();
  const user_id = cookies["id"];
  const type_user = cookies["type"];
  const [radio, setRadio] = useState("");
  const [amount, setAmount] = useState("");
  const [amountRes, setAmountRes] = useState("");
  const [warning, setWarning] = useState("");

  const handleAmountChange = (event: { target: { value: string } }) => {
    const value = event.target.value;
    const goal = parseFloat(donationCampaign[0].goal);
    const raised = parseFloat(donationCampaign[0].raised ?? 0);
    const donationAmount = parseFloat(
      value.replace(/[^\d,]/g, "").replace(",", ".")
    );

    if (
      0 < goal - (raised + donationAmount) &&
      goal - (raised + donationAmount) < 1
    ) {
      setWarning(
        "O valor não pode fazer faltar apenas centavos para atingir a meta da campanha."
      );
    } else if (donationAmount <= goal - raised || value === "") {
      setRadio(""); // Deseleciona qualquer radio selecionado
      setAmount(value);
      setWarning("");
    } else {
      setWarning("O valor não pode ser maior que o disponível na campanha");
    }
  };

  const handleAmountRadioChange = (event: string) => {
    setRadio(event); // Deseleciona qualquer radio selecionado
    setAmount("");
  };

  useEffect(() => {
    const newValue = amount.replace(/[^\d,]/g, "").split(",");
    if (newValue.length > 1) {
      setAmountRes(
        `${
          newValue[0].includes(".")
            ? newValue[0]
            : parseInt(newValue[0]).toLocaleString()
        },${
          newValue[1].length < 2
            ? `${newValue[1]}00`.substring(0, 2)
            : newValue[1].substring(0, 2)
        }`
      );
    } else {
      if (amount !== "") {
        setAmountRes(`${newValue},00`);
      } else {
        setAmountRes("");
      }
    }
  }, [amount]);

  useEffect(() => {
    const donor_id = cookies["id"];
    setIsLoading(false);
    api
      .post("/donation/getOne", {
        id: donationCampaignId,
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
        setDonationCampaign(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    if (history || finished || log) {
      api
        .post("/donation/donorHistory", {
          id: donationCampaignId,
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

  const handlerFinished = () => {
    api
      .post("donation/changeStatus", {
        id: donationCampaignId,
        status: "finished",
      })
      .then((response: { data: any }) => {
        toast({
          title: "Campanha de doação finalizada com sucesso",
          description: "Campanha de doação foi finalizada com sucesso",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        navigate("/donationCampaign/all");
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Erro ao finalizar campanha de doação",
          description: "Revise as informações e tente novamente",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      });
  };

  const handleDelete = () => {
    api
      .post("donation/delete", { id: donationCampaignId })
      .then((response: { data: any }) => {
        toast({
          title: "Campanha de doação excluído",
          description: "Campanha de doação excluído com sucesso!",
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
    onCloseDelete();
  };

  return (
    <>
      <TitlePage title={"Campanha de doação"} />
      {isLoading && donationCampaign.length > 0 ? (
        <>
          {history ? (
            <>
              <Tag mb="2">{donationCampaign[0].status}</Tag>
              <Text fontWeight={"bold"} fontSize="18px">
                Minhas atividades
              </Text>
              <Box
                border={"1px solid black"}
                borderRadius={"6px"}
                p="2"
                mb="30px"
              >
                {historyList.length > 0 &&
                  historyList.map((donor) => (
                    <Box>
                      <Flex
                        key={donor.id}
                        w="100%"
                        justifyContent={"space-between"}
                      >
                        <Flex>
                          Doou a quantia de
                          <Box fontWeight={"bold"} ml="2">
                            {parseFloat(donor.amount).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </Box>
                        </Flex>
                      </Flex>
                    </Box>
                  ))}
              </Box>
            </>
          ) : (
            <></>
          )}
          {parseInt(type_user) === 4 && (
            <Flex w="100%" justifyContent={"space-between"}>
              <Tag w="fit-content" p="8px 10px" color="grey" fontSize={"18px"}>
                {donationCampaign[0].status}
              </Tag>
              <Button mr={2} colorScheme={"red"} onClick={onOpenDelete}>
                <ImLock />
                Excluir Campanha de doação
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
                          donationCampaign[0].accountability === 1
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
                    {donationCampaign[0].accountability === 1 ? (
                      <Text
                        dangerouslySetInnerHTML={{
                          __html: donationCampaign[0].accountability_message,
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
                        Quem contribuiu:
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
                                  doou a quantia de
                                  <Box fontWeight={"bold"} ml="2">
                                    {parseFloat(donor.amount).toLocaleString(
                                      "pt-BR",
                                      { style: "currency", currency: "BRL" }
                                    )}
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
                {donationCampaign[0].status}
              </Tag>
              {donationCampaign[0].status === "Em andamento" && (
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
              mb={"40px"}
              mt={5}
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
                    donationCampaign[0].image !== ""
                      ? donationCampaign[0].image
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
                    {donationCampaign[0].username}
                  </Button>
                  <Flex>
                    <Box
                      color={"green"}
                      mr="10px"
                      cursor={"pointer"}
                      borderColor="200"
                      border="2px solid"
                      borderRadius={"6px"}
                      p={"6px"}
                      w="fit-content"
                      textAlign={"center"}
                    >
                      <Text fontWeight={"bold"}>Meta da campanha</Text>
                      <Text>
                        {parseFloat(donationCampaign[0].goal).toLocaleString(
                          "pt-BR",
                          { style: "currency", currency: "BRL" }
                        )}
                      </Text>
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
                      <Text fontWeight={"bold"}>Valor arrecadado</Text>
                      <Text>
                        {parseFloat(donationCampaign[0].raised ?? "0").toLocaleString(
                          "pt-BR",
                          { style: "currency", currency: "BRL" }
                        ) || "0,00"}
                      </Text>
                    </Box>
                  </Flex>
                </Flex>
                <Box>
                  <Text fontSize="20px" fontWeight={"bold"}>
                    {donationCampaign[0].name}
                  </Text>
                </Box>
              </GridItem>
              <GridItem colSpan={15}>
                <Text>{donationCampaign[0].description}</Text>
              </GridItem>
            </Grid>
            {!(history || finished || log) && (
              <Box>
                <Text
                  textAlign={"center"}
                  my="10px"
                  fontWeight={"bold"}
                  fontSize="19px"
                >
                  Escolha o valor que deseja doar
                </Text>

                <RadioGroup
                  onChange={(e) => {
                    handleAmountRadioChange(e);
                  }}
                  value={radio}
                >
                  <Stack
                    direction="row"
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    {[10, 20, 50, 100, 200, 300, 500].map(
                      (value) =>
                        parseFloat(donationCampaign[0].goal || "0") -
                          parseFloat(donationCampaign[0].raised || "0") >=
                          value && (
                          <Radio key={value} value={String(value) + ".00"}>
                            R${value},00
                          </Radio>
                        )
                    )}
                    <Box>
                      <NumericFormat
                        id="amount"
                        customInput={Input}
                        thousandSeparator="."
                        decimalSeparator=","
                        allowNegative={false}
                        isNumericString
                        prefix={"R$ "}
                        variant="filled"
                        placeholder="Se preferir, defina o seu valor"
                        width="300px"
                        value={amount}
                        onChange={handleAmountChange}
                        decimalScale={2}
                      />
                      {warning && (
                        <span
                          style={{
                            color: "red",
                            display: "block",
                            fontSize: "12px",
                            width: "300px",
                          }}
                        >
                          {warning}
                        </span>
                      )}
                    </Box>
                  </Stack>
                </RadioGroup>
              </Box>
            )}
            <Divider mt="10px" borderWidth={"2px"} />
            {log && (
              <>
                <Box
                  mt="50px"
                  borderColor="200"
                  border="2px solid"
                  borderRadius={"6px"}
                >
                  <Text textAlign={"center"}>Doações realizadas</Text>
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
                    historyList.map((don) => (
                      <Flex
                        borderBottom="1px solid"
                        p="5px 15px"
                        mx="10px"
                        justifyContent={"space-between"}
                      >
                        <Text>{don.username}</Text>
                        <Text>
                          {parseFloat(don.amount).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </Text>
                      </Flex>
                    ))}
                </Box>
              </>
            )}
            {history && donationCampaign[0].status === "Em andamento" ? (
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
                    navigate(`/campaign/donation/${donationCampaignId}`);
                  }}
                >
                  Ajudar novamente a campanha
                </Button>
              </Box>
            ) : history || finished ? (
              <></>
            ) : log ? (
              <Box
                position="fixed"
                bottom="20px"
                right="20px"
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="flex-end"
              >
                {donationCampaign[0].status === "Finalizado" ? (
                  <Box
                    bg={useColorModeValue( "white", "205d8b")}
                    mr="4"
                    border="1px black solid"
                    p="2px 9px"
                    borderRadius={"5px"}
                  >
                    Campanha de doação finalizada!
                  </Box>
                ) : (
                  <></>
                )}
              </Box>
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
                  Total a doar: {"R$" + (radio !== "" ? radio : amountRes)}
                </Box>

                <PaymentModal
                  warning={warning}
                  donation_id={donationCampaignId ?? ""}
                  value={
                    radio !== "" ? radio : amountRes.replace(/[^\d,]/g, "")
                  }
                  pix={donationCampaign[0].pix}
                />
              </Box>
            )}
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
                    Caso haja certeza da exclusão de campanha de doação
                    selecionada, aperte em "Finalizar". Essa ação finaliza o
                    recebimento de novas valores na campanha.
                  </>
                </ModalBody>

                <ModalFooter>
                  <Button
                    colorScheme={"red"}
                    mr={3}
                    onClick={() => handlerFinished()}
                  >
                    Excluir
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
                    Caso haja certeza da exclusão de campanha de doação
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
      ) : isLoading && donationCampaign.length === 0 ? (
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
