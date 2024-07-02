import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { FormEvent, useEffect, useState } from "react";
import {
  itemAnimation,
  MotionBox,
} from "../../components/Styles/motion-animate/animate";
import api from "../../services/api";

const AccountsPendingPage: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeTab, setActiveTab] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [justify, setJustify] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [acc, setAcc] = useState("");
  const toast = useToast();

  const handleActivate = (id: any) => {
    onClose();
    api
      .post("/user/verify", {
        activated: 1,
        id,
      })
      .then((response) => {
        toast({
          title: "Conta ativada",
          description: "Usuário aceito no sistema com sucesso.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        setRefresh(!refresh);
      })
      .catch(() => {
        toast({
          title: "Ocorreu um erro.",
          description: "Ação não pode ser completada, tente novamente",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        setRefresh(!refresh);
      });
  };

  const handlerVerify = (id: any) => {
    api
      .post("/user/verify", {
        activated: 1,
        id,
      })
      .then((response) => {
        toast({
          title: "Conta validada e aceita",
          description: "Instituição/Parceiro aceito no sistema com sucesso.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        setRefresh(!refresh);
      })
      .catch(() => {
        toast({
          title: "Ocorreu um erro.",
          description: "Ação não pode ser completada, tente novamente",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        setRefresh(!refresh);
      });
  };

  const handleDenied = (id: any, event: FormEvent) => {
    event.preventDefault();
    api
      .post("/user/verify", {
        activated: 2,
        justification_rejection: justify,
        id,
      })
      .then((response) => {
        toast({
          title: "Pedido rejeitado.",
          description: "Pedido rejeitado com sucesso.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        setRefresh(!refresh);
      })
      .catch(() => {
        toast({
          title: "Ocorreu um erro.",
          description: "Ação não pode ser completada, tente novamente",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        setRefresh(!refresh);
      });
  };

  useEffect(() => {
    const fetchAccounts = async () => {
      let data;
      if (activeTab === 2) {
        data = { canceled: true };
      } else {
        data = { user_type: activeTab === 0 ? 2 : 3, pending: true };
      }

      try {
        const response = await api
          .post("/user/list", { ...data })
          .then((response) => {
            console.log(response.data);
            setAccounts(response.data);
          });
      } catch (error) {
        console.log(error);
      }
    };

    fetchAccounts();
  }, [activeTab, refresh]);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  function handlerUserType(type: number) {
    switch (type) {
      case 1:
        return "Doador";
        break;
      case 2:
        return "Instituição";
        break;
      case 3:
        return "Parceiro";
        break;
      default:
        break;
    }
  }

  return (
    <MotionBox variants={itemAnimation} margin="0 auto" padding={"2rem"}>
      <Box p={4}>
        <Heading size="lg">Contas Pendentes e Excluídas</Heading>
        <Divider borderWidth={"2px"} />
        <Text fontSize={"13px"} mb={4}>
          Por favor, avalie as instituições e parceiros que solicitaram acesso
          ao sistema. Sua validação é fundamental para garantir que apenas
          organizações confiáveis possam participar e receber ajuda da
          comunidade. Se as informações fornecidas forem validadas, por favor,
          aceite a entrada da instituição/parceiro no sistema. Caso contrário,
          rejeite o pedido.
        </Text>
        <Tabs
          index={activeTab}
          onChange={handleTabChange}
          variant="soft-rounded"
        >
          <TabList>
            <Tab>Pedidos de novas instituições</Tab>
            <Tab>Pedidos de novos parceiro</Tab>
            <Tab>Histórico de usuários cancelados e excluídos</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <VStack spacing={4} align="stretch">
                {accounts.map((account: any) => (
                  <Box borderWidth="1px" borderRadius="lg" p={4} width="100%">
                    <Heading
                      size="md"
                      mb={4}
                      border={"solid 2px green"}
                      borderRadius={"10px"}
                      w="fit-content"
                      p="5px 15px"
                    >
                      {account.username}
                    </Heading>
                    <SimpleGrid columns={2} spacing={2} width="100%">
                      <Tag colorScheme={"gray"} w="fit-content">
                        {handlerUserType(account.user_types)}
                      </Tag>
                      <Flex spacing={2} align="start" di>
                        <Text fontWeight="bold" mr="8px">
                          Email:
                        </Text>
                        <Text>{account.email}</Text>
                      </Flex>
                      <Flex spacing={2} align="start">
                        <Text fontWeight="bold" mr="8px">
                          Pix:
                        </Text>
                        <Text>{account.pix}</Text>
                      </Flex>
                      <Flex spacing={2} align="start">
                        <Text fontWeight="bold" mr="8px">
                          CNPJ:
                        </Text>
                        <Text>{account.cnpj_legal}</Text>
                      </Flex>
                      <Flex spacing={2} align="start">
                        <Text fontWeight="bold" mr="8px">
                          Telefone:
                        </Text>
                        <Text>{account.phone}</Text>
                      </Flex>
                      <Flex spacing={2} align="start">
                        <Text fontWeight="bold" mr="8px">
                          Razão Social:
                        </Text>
                        <Text>{account.social_reason}</Text>
                      </Flex>
                      <Flex spacing={2} align="start">
                        <Text fontWeight="bold" mr="8px">
                          Endereço:
                        </Text>
                        <Text>{account.address}</Text>
                      </Flex>
                      <Flex spacing={2} align="start">
                        <Text fontWeight="bold" mr="8px">
                          Link da rede social:
                        </Text>
                        <Text>{account.social_media}</Text>
                      </Flex>
                    </SimpleGrid>
                    <Flex
                      justifyContent={"space-between"}
                      mt={5}
                      alignItems={"center"}
                    >
                      <Box>
                        {" "}
                        <Button
                          colorScheme={"green"}
                          onClick={() => {
                            handlerVerify(account.id);
                          }}
                        >
                          Aceitar entrada da instituição no sistema
                        </Button>
                      </Box>
                      <Box>
                        <form
                          onSubmit={(e) => {
                            handleDenied(account.id, e);
                          }}
                        >
                          <FormControl
                            id="justify"
                            display={"flex"}
                            alignItems={"center"}
                            w="100%"
                          >
                            <Input
                              isRequired
                              size="lg"
                              borderRadius={"100px"}
                              focusBorderColor="#205d8b"
                              variant="filled"
                              color={"black"}
                              type="text"
                              placeholder="Motivo da rejeição"
                              value={justify}
                              onChange={(e) => setJustify(e.target.value)}
                            />
                            <Button
                              w="200px"
                              colorScheme={"red"}
                              p="10px"
                              type="submit"
                              value="submit"
                            >
                              Rejeitar pedido
                            </Button>
                          </FormControl>
                        </form>
                      </Box>
                    </Flex>
                  </Box>
                ))}
              </VStack>
            </TabPanel>
            <TabPanel>
              <VStack spacing={4} align="stretch">
                {accounts.map((account: any) => (
                  <Box borderWidth="1px" borderRadius="lg" p={4} width="100%">
                    <Heading
                      size="md"
                      mb={4}
                      border={"solid 2px green"}
                      borderRadius={"10px"}
                      w="fit-content"
                      p="5px 15px"
                    >
                      {account.username}
                    </Heading>
                    <SimpleGrid columns={2} spacing={2} width="100%">
                      <Tag colorScheme={"gray"} w="fit-content">
                        {handlerUserType(account.user_types)}
                      </Tag>
                      <Flex spacing={2} align="start" di>
                        <Text fontWeight="bold" mr="8px">
                          Email:
                        </Text>
                        <Text>{account.email}</Text>
                      </Flex>
                      <Flex spacing={2} align="start">
                        <Text fontWeight="bold" mr="8px">
                          Pix:
                        </Text>
                        <Text>{account.pix}</Text>
                      </Flex>
                      <Flex spacing={2} align="start">
                        <Text fontWeight="bold" mr="8px">
                          CNPJ:
                        </Text>
                        <Text>{account.cnpj_legal}</Text>
                      </Flex>
                      <Flex spacing={2} align="start">
                        <Text fontWeight="bold" mr="8px">
                          Telefone:
                        </Text>
                        <Text>{account.phone}</Text>
                      </Flex>
                      <Flex spacing={2} align="start">
                        <Text fontWeight="bold" mr="8px">
                          Razão Social:
                        </Text>
                        <Text>{account.social_reason}</Text>
                      </Flex>
                      <Flex spacing={2} align="start">
                        <Text fontWeight="bold" mr="8px">
                          Categoria:
                        </Text>
                        <Text>{account.category}</Text>
                      </Flex>
                      <Flex spacing={2} align="start">
                        <Text fontWeight="bold" mr="8px">
                          Endereço:
                        </Text>
                        <Text>{account.address}</Text>
                      </Flex>
                      <Flex spacing={2} align="start">
                        <Text fontWeight="bold" mr="8px">
                          Link da rede social:
                        </Text>
                        <Text>{account.social_media}</Text>
                      </Flex>
                    </SimpleGrid>
                    <Flex
                      justifyContent={"space-between"}
                      mt={5}
                      alignItems={"center"}
                    >
                      <Box>
                        {" "}
                        <Button
                          colorScheme={"green"}
                          onClick={() => {
                            handlerVerify(account.id);
                          }}
                        >
                          Aceitar entrada da instituição no sistema
                        </Button>
                      </Box>
                      <Box>
                        <form
                          onSubmit={(e) => {
                            handleDenied(account.id, e);
                          }}
                        >
                          <FormControl
                            id="justify"
                            display={"flex"}
                            alignItems={"center"}
                            w="100%"
                          >
                            <Input
                              isRequired
                              size="lg"
                              borderRadius={"100px"}
                              focusBorderColor="#205d8b"
                              variant="filled"
                              color={"black"}
                              type="text"
                              placeholder="Motivo da rejeição"
                              value={justify}
                              onChange={(e) => setJustify(e.target.value)}
                            />
                            <Button
                              w="200px"
                              colorScheme={"red"}
                              p="10px"
                              type="submit"
                              value="submit"
                            >
                              Rejeitar pedido
                            </Button>
                          </FormControl>
                        </form>
                      </Box>
                    </Flex>
                  </Box>
                ))}
              </VStack>
            </TabPanel>
            <TabPanel>
              <VStack spacing={4} align="stretch">
                {accounts.map((account: any) => (
                  <Box borderWidth="1px" borderRadius="lg" p={4} width="100%">
                    <Flex
                      spacing={2}
                      align="start"
                      mb={4}
                      alignItems={"center"}
                      justify={"space-between"}
                    >
                      <Heading
                        size="md"
                        mr={4}
                        border={"solid 2px grey"}
                        borderRadius={"10px"}
                        w="fit-content"
                        p="5px 15px"
                      >
                        {account.username}
                      </Heading>
                      <Tag colorScheme={"red"}>
                        Excluído por:{" "}
                        <Text fontWeight={"bold"} ml="5px">
                          {" "}
                          {account.justification_rejection}{" "}
                        </Text>
                      </Tag>
                      <Button
                        colorScheme={"green"}
                        p="0px 10px"
                        onClick={() => {
                          onOpen();
                          setAcc(account.id);
                        }}
                      >
                        Ativar Usuário
                      </Button>
                    </Flex>
                    <SimpleGrid columns={2} spacing={2} width="100%">
                      <Tag colorScheme={"gray"} w="fit-content">
                        {handlerUserType(account.user_types)}
                      </Tag>
                      <Flex></Flex>
                      <Flex spacing={2} align="start">
                        <Text fontWeight="bold" mr="8px">
                          Email:
                        </Text>
                        <Text>{account.email}</Text>
                      </Flex>
                      <Flex spacing={2} align="start">
                        <Text fontWeight="bold" mr="8px">
                          Pix:
                        </Text>
                        <Text>{account.pix}</Text>
                      </Flex>
                      <Flex spacing={2} align="start">
                        <Text fontWeight="bold" mr="8px">
                          CNPJ:
                        </Text>
                        <Text>{account.cnpj_legal}</Text>
                      </Flex>
                      <Flex spacing={2} align="start">
                        <Text fontWeight="bold" mr="8px">
                          Telefone:
                        </Text>
                        <Text>{account.phone}</Text>
                      </Flex>
                      <Flex spacing={2} align="start">
                        <Text fontWeight="bold" mr="8px">
                          Razão Social:
                        </Text>
                        <Text>{account.social_reason}</Text>
                      </Flex>
                      {account.user_types === 3 ? (
                        <Flex spacing={2} align="start">
                          <Text fontWeight="bold" mr="8px">
                            Categoria:
                          </Text>
                          <Text>{account.category}</Text>
                        </Flex>
                      ) : (
                        <></>
                      )}
                      <Flex spacing={2} align="start">
                        <Text fontWeight="bold" mr="8px">
                          Endereço:
                        </Text>
                        <Text>{account.address}</Text>
                      </Flex>
                      <Flex spacing={2} align="start">
                        <Text fontWeight="bold" mr="8px">
                          Link da rede social:
                        </Text>
                        <Text>{account.social_media}</Text>
                      </Flex>
                    </SimpleGrid>
                  </Box>
                ))}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent color={useColorModeValue("gray.800", "white")}>
          <ModalHeader color={useColorModeValue("green", "white")}>
            Confirmar ativação
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Ao ativar um usuário, ele terá acesso ao sistema.
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme={"green"}
              mr={3}
              onClick={() => handleActivate(acc)}
            >
              Ativar
            </Button>
            <Button onClick={onClose} colorScheme="gray">
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </MotionBox>
  );
};

export default AccountsPendingPage;
