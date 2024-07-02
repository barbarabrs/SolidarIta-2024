import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Image,
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
} from "@chakra-ui/react";
import moment from "moment";
import { useEffect, useState } from "react";
import { ImLock } from "react-icons/im";
import { useNavigate, useParams } from "react-router-dom";
import TitlePage from "../../../components/TitlePage";
import { UserInterfaceData } from "../../../contexts/ProfileContext";
import api from "../../../services/api";

const UsersDetail = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [profile, setProfile] = useState<UserInterfaceData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<boolean>(false);
  const toast = useToast();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(false);
    api
      .post("/user", { id: id })
      .then((response) => {
        console.log([response.data]);
        setProfile([response.data]);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(true);
      });
  }, []);

  const handleDelete = () => {
    api
      .post("user/delete", { id })
      .then((response: { data: any }) => {
        toast({
          title: "Usuário excluído",
          description: "Usuário excluído com sucesso!",
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
    handlerNavigate(profile[0].user_types);
    onClose();
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

  function handlerNavigate(type: number) {
    switch (type) {
      case 1:
        return navigate("/donors/all");
        break;
      case 2:
        return navigate("/institutions/all");
        break;
      case 3:
        return navigate("/partners/all");
        break;
      default:
        break;
    }
  }

  return (
    <>
      <Box width={"100%"}>
        <TitlePage title="Informações do Usuário" />
        {isLoading === true && [1, 2, 3].includes(profile[0].user_types) ? (
          <Flex align="center" justify="center" width={"100%"}>
            <Box
              width={"100%"}
             
              mb={2}
              px={{ base: 2, sm: 12, md: 17 }}
            >
              <Flex w="100%" justifyContent={"space-between"}>
                <Tag
                  w="fit-content"
                  p="8px 10px"
                  color="grey"
                  fontSize={"18px"}
                >
                  {handlerUserType(profile[0].user_types)}
                </Tag>
                <Button mr={2} colorScheme={"red"} onClick={onOpen}>
                  <ImLock />
                  Excluir Conta
                </Button>
              </Flex>
              <Stack>
                <Image
                  objectFit="cover"
                  borderRadius="full"
                  boxSize="250px"
                  src={profile[0].image ?? 'https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg'}
                  alt="Dan Abramov"
                />
              </Stack>
              <Heading as="h1" size="lg" mb="4" mt="3">
                {profile[0].username}
              </Heading>
              <Box mb="4">
                <Flex justifyContent={"space-between"}>
                  <Heading as="h2" size="md" mb="2">
                    Status
                  </Heading>
                </Flex>

                <Flex align="center" mb="2">
                  <Text fontSize="md" color="gray.600" flex="1">
                    {profile[0].status}
                  </Text>
                </Flex>
              </Box>
              <Divider mb="4" />
              <Box mb="4">
                <Heading as="h2" size="md" mb="2">
                  Dados da Conta
                </Heading>
                {profile[0].user_types === 2 || profile[0].user_types === 3 ? (
                  <Flex align="center" mb="2">
                    <Text fontSize="md" color="gray.600" mr="2">
                      Razão Social:
                    </Text>
                    <Text fontSize="md" color="gray.600" flex="1">
                      {profile[0].social_reason}
                    </Text>
                  </Flex>
                ) : (
                  <></>
                )}
                <Flex align="center" mb="2">
                  <Text fontSize="md" color="gray.600" mr="2">
                    Email:
                  </Text>
                  <Text fontSize="md" color="gray.600" flex="1">
                    {profile[0].email}
                  </Text>
                </Flex>
                {profile[0].user_types === 2 || profile[0].user_types === 3 ? (
                  <Flex align="center" mb="2">
                    <Text fontSize="md" color="gray.600" mr="2">
                      CNPJ:
                    </Text>
                    <Text fontSize="md" color="gray.600" flex="1">
                      {profile[0].cnpj_legal}
                    </Text>
                  </Flex>
                ) : (
                  <></>
                )}

                <Flex align="center" mb="2"></Flex>
              </Box>
              <Divider mb="4" />
              {profile[0].user_types === 3 ? (
                <>
                  <Box mb="4">
                    <Flex justifyContent={"space-between"}>
                      <Heading as="h2" size="md" mb="2">
                        Categoria do estabelecimento
                      </Heading>
                    </Flex>

                    <Flex align="center" mb="2">
                      <Text fontSize="md" color="gray.600" mr="2">
                        Categoria:
                      </Text>
                      <Text fontSize="md" color="gray.600" flex="1">
                        {profile[0].category}
                      </Text>
                    </Flex>
                  </Box>
                  <Divider mb="4" />
                </>
              ) : (
                <></>
              )}
              {profile[0].user_types === 2 || profile[0].user_types === 3 ? (
                <>
                  <Box mb="4">
                    <Flex justifyContent={"space-between"}>
                      <Heading as="h2" size="md" mb="2">
                        Número de telefone
                      </Heading>
                    </Flex>

                    <Flex align="center" mb="2">
                      <Text fontSize="md" color="gray.600" mr="2">
                        Telefone:
                      </Text>
                      <Text fontSize="md" color="gray.600" flex="1">
                        {profile[0].phone}
                      </Text>
                    </Flex>
                  </Box>
                  <Divider mb="4" />
                </>
              ) : (
                <></>
              )}
              {profile[0].user_types === 2 || profile[0].user_types === 3 ? (
                <Box mb="4">
                  <Flex justifyContent={"space-between"}>
                    <Heading as="h2" size="md" mb="2">
                      Endereço
                    </Heading>
                  </Flex>

                  <Flex align="center" mb="2">
                    <Text fontSize="md" color="gray.600" mr="2">
                      Endereço completo:
                    </Text>
                    <Text fontSize="md" color="gray.600" flex="1">
                      {profile[0].address}
                    </Text>
                  </Flex>
                </Box>
              ) : profile[0].user_types === 1 ? (
                <Box mb="4">
                  <Flex justifyContent={"space-between"}>
                    <Heading as="h2" size="md" mb="2">
                      Data de nascimento
                    </Heading>
                  </Flex>

                  <Flex align="center" mb="2">
                    <Text fontSize="md" color="gray.600" mr="2">
                      Data de nascimento:
                    </Text>
                    <Text fontSize="md" color="gray.600" flex="1">
                      {moment(profile[0].birthday).format("DD/MM/yyyy")}
                    </Text>
                  </Flex>
                </Box>
              ) : (
                <></>
              )}
              <Divider mb="4" />
              {profile[0].user_types === 2 || profile[0].user_types === 3 ? (
                <>
                  <Box mb="4">
                    <Flex justifyContent={"space-between"}>
                      <Heading as="h2" size="md" mb="2">
                        Forma de Pagamento
                      </Heading>
                    </Flex>

                    <Flex align="center" mb="2">
                      <Text fontSize="md" color="gray.600" mr="2">
                        PIX:
                      </Text>
                      <Text fontSize="md" color="gray.600" flex="1">
                        {profile[0].pix}
                      </Text>
                    </Flex>
                  </Box>

                  <Divider />
                </>
              ) : (
                <></>
              )}{" "}
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
                  {profile[0].user_types === 2 ? (
                    <>
                      {" "}
                      Ao excluir uma instituição, todas as campanhas vinculadas
                      a ela serão excluídas juntas. Caso haja certeza da operação,
                      aperte em "Excluir".
                    </>
                  ) : profile[0].user_types === 3 ? (
                    <>
                      {" "}
                      Ao excluir um parceiro, todas as campanhas e produtos
                      vinculados a ele serão excluídas juntos. Caso haja certeza da
                      operação, aperte em "Excluir".
                    </>
                  ) : (
                    <> Caso haja certeza da operação, aperte em "Excluir".</>
                  )}

                  <br />
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
          </Flex>
        ) : isLoading === true ? (
          <Text textAlign={"center"}>Não há resultados</Text>
        ) : (
          <Stack mt="50px">
            <Skeleton height="57px" />
            <Skeleton height="57px" />
            <Skeleton height="57px" />
            <Skeleton height="57px" />
            <Skeleton height="57px" />
            <Skeleton height="57px" />
            <Skeleton height="57px" />
            <Skeleton height="57px" />
            <Skeleton height="57px" />
          </Stack>
        )}
      </Box>
    </>
  );
};

export default UsersDetail;
