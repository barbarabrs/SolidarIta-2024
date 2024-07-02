import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
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
  SimpleGrid,
  Tab,
  Table,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { ChangeEvent, useContext, useRef, useState } from "react";
import {
  BsFileEarmarkSpreadsheetFill,
  BsFillExclamationTriangleFill,
} from "react-icons/bs";
import { IoIosTrash } from "react-icons/io";
import { IoArrowBackCircle } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { NumericFormat } from "react-number-format";
import { useNavigate } from "react-router-dom";
import {
  itemAnimation,
  MotionBox,
} from "../../../../components/Styles/motion-animate/animate";
import { AuthContext } from "../../../../contexts/AuthContext";
import api from "../../../../services/api";

// import routeExport from "../../../../../public/spreadsheets/routeExport.xlsx";
// import routeExport from '../../../../../public/spreadsheets/routeExport.xlsx';

interface Item {
  image: string;
  name: string;
  price: string;
  description: string;
}

interface dateAccount {
  value: string;
  label: string;
}

function ProductAdd() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [image, setImage] = useState<string>("");
  const [imageEdit, setImageEdit] = useState<string>("");
  const [tabIndex, setTabIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState<string>("");
  const [nameEdit, setNameEdit] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [valueEdit, setValueEdit] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [descriptionEdit, setDescriptionEdit] = useState<string>("");
  const [index, setIndex] = useState<number>(999999999);
  const { idUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRefEdit = useRef<HTMLInputElement>(null);

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

  const handleImageChangeEdit = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(file);
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageEdit(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const handlerCancel = () => {
    navigate("/groceryList/all");
  };

  const handleSave = () => {
    if (name && value) {
      let res = "";
      const newValue = value.split(",");
      if (newValue.length > 1) {
        res = `${newValue[0]},${
          newValue[1].length < 2
            ? `${newValue[1]}00`.substring(0, 2)
            : newValue[1].substring(0, 2)
        }`;
      } else {
        res = `${newValue},00`;
      }
      const newItem: Item = {
        image: image,
        name: name,
        price: res,
        description: description,
      };
      setItems([...items, newItem]);
      setImage('https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg');
      setName("");
      setValue("");
      setDescription("");
    } else {
      toast({
        description:
          "É necessário completar os campos de nome e valor do produto para adiciona-lo",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleDelete = (index: number) => {
    const updatedItems = items.filter((item, i) => i !== index);
    setItems(updatedItems);
  };

  const handlerIndex = (ind: number) => {
    setIndex(ind);
    setNameEdit(items[ind].name);
    setValueEdit(items[ind].price);
    setDescriptionEdit(items[ind].description);
    setImageEdit(items[ind].image);
    onOpen();
  };

  const handleEdit = (index: number) => {
    let res = valueEdit;
    if (valueEdit) {
      const newValue = valueEdit.split(",");
      if (newValue.length > 1) {
        res = `${newValue[0]},${
          newValue[1].length < 2
            ? `${newValue[1]}00`.substring(0, 2)
            : newValue[1].substring(0, 2)
        }`;
      } else {
        res = `${newValue},00`;
      }
    }
    const itemToEdit = {
      image: imageEdit !== "" ? imageEdit : items[index].image,
      name: nameEdit !== "" ? nameEdit : items[index].name,
      price: res !== "" ? res : items[index].price,
      description: descriptionEdit ?? items[index].description,
    };
    items[index] = itemToEdit;
    onClose();
  };

  const handleCreateManually = () => {
    if (items.length > 0) {
      const updatedItems = items.map((item) => {
        const newValue = item.price.replace(/[^\d,]/g, "").replace(",", ".");
        return { ...item, price: newValue };
      });
      api
        .post("products/add", { items: updatedItems, id: idUser })
        .then((response: { data: any }) => {
          // console.log(response.data);
          toast({
            title: "Produtos cadastrados com sucesso",
            description: "Produtos cadastrados com sucesso",
            status: "success",
            duration: 4000,
            isClosable: true,
          });
          navigate("/product/list");
        })
        .catch((error) => {
          console.log(error);
          toast({
            title: "Erro ao cadastrar produtos",
            description: "Revise as informações e tente novamente",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
        });
    } else {
      toast({
        description:
          "É necessário adicionar primeiramente um novo produto para salvá-lo",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const downloadFile = () => {
    const url = "../../../../../public/spreadsheets/routeExport.csv";
    const link = document.createElement("a");
    link.href = url;
    link.download = "routeExport.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <MotionBox variants={itemAnimation} margin="0 auto" padding={"2rem"}>
        <Box width={"100%"}>
          <Flex justifyContent={"space-between"} alignItems={"center"}>
            <Heading mb={3}>Adicionar produtos</Heading>
            <Button
              className="color_main"
              variant="solid"
              leftIcon={<IoArrowBackCircle />}
              onClick={() => {
                navigate("/product/list");
              }}
            >
              {" "}
              Voltar à lista dos meus produtos
            </Button>
          </Flex>
          <Divider borderColor="100" mb="1rem" />
        </Box>
        <Tabs
          colorScheme="green"
          selectedIndex={tabIndex}
          onChange={(index) => setTabIndex(index)}
        >
          <TabList color="grey">
            <Tab fontWeight={"bold"} fontSize={"20px"}>
              Adicionar Manualmente
            </Tab>
            <Tab fontWeight={"bold"} fontSize={"20px"}>
              Importar de planilha
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              {tabIndex === 0 && (
                <>
                  <Box mt="5" mb="30px">
                    <Text fontSize="18px" fontWeight="bold">
                      Adicione novos itens um por um
                    </Text>
                    <Flex alignItems={"center"}>
                      <BsFillExclamationTriangleFill size={"10"} />
                      <Text fontSize="12px" ml="4px">
                        Não esqueça de salvar todas as alterações
                      </Text>
                    </Flex>
                  </Box>
                  <VStack spacing={4} w="100%">
                    <SimpleGrid columns={[1, null, 5]} spacing="40px">
                      <FormControl>
                        <FormLabel>Imagem </FormLabel>
                        <Box rowSpan={4} colSpan={1}>
                          <Flex
                            width="100px"
                            justifyContent={"center"}
                            border={"1px solid lightgrey"}
                            borderRadius={"3%"}
                          >
                            <Image
                              height="100px"
                              objectFit="cover"
                              src={
                                image && image !== "" ? image : 'https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg'
                              }
                              alt="Selected"
                              mb={"5px"}
                            />
                          </Flex>
                          <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleImageChange}
                          />
                          <Button
                            onClick={() => fileInputRef.current?.click()}
                            size="sm"
                          >
                            Selecionar arquivo
                          </Button>
                          {fileInputRef.current?.files?.length && (
                            <span>
                              Arquivo selecionado:{" "}
                              {fileInputRef.current.files[0].name.substring(
                                0,
                                10
                              ) +
                                (fileInputRef.current.files.length > 10
                                  ? "..."
                                  : "")}
                            </span>
                          )}
                        </Box>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Nome</FormLabel>
                        <Textarea
                          minH="100px"
                          border="none"
                          borderBottom={"1px solid black"}
                          placeholder="Nome do produto*"
                          type="textarea"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Descrição</FormLabel>
                        <Textarea
                          minH="100px"
                          border="none"
                          borderBottom={"1px solid black"}
                          placeholder="Descrição (opcional)"
                          type="textarea"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Preço</FormLabel>
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
                          placeholder="Valor*"
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                           decimalScale={2}
                        />
                      </FormControl>
                      {/* <Button onClick={handleSave} w="300px">
                        Adicionar
                      </Button> */}
                      <Flex spacing={6} h="100%" alignItems={"start"} w="100%">
                        <Button
                          w="100%"
                          onClick={handleSave}
                          // size="lg"
                          backgroundColor={
                            value.length === 0 || name.length === 0
                              ? "#91A7B8"
                              : "#205d8b"
                          }
                          colorScheme={"blue"}
                          variant={"solid"}
                        >
                          Adicionar
                        </Button>
                      </Flex>
                    </SimpleGrid>
                    {items.length > 0 ? (
                      <>
                        <Text
                          textAlign={"start"}
                          fontWeight={"bold"}
                          fontSize={"22px"}
                          mt="10px"
                        >
                          Produtos a serem salvos
                        </Text>
                        <Table
                          variant="simple"
                          justifyContent={"space-between"}
                          w="100%"
                        >
                          <Thead>
                            <Tr>
                              <Th>Imagem</Th>
                              <Th>Produto</Th>
                              <Th>Preço</Th>
                              <Th>Descrição</Th>
                              <Th>Ações</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {items.map((item, index) => {
                              return (
                                <Tr key={index}>
                                  <Td>
                                    {" "}
                                    <Flex
                                      width="50px"
                                      justifyContent={"center"}
                                      border={"1px solid lightgrey"}
                                      borderRadius={"3%"}
                                    >
                                      <Image
                                        height="50px"
                                        objectFit="cover"
                                        src={
                                          item.image && item.image !== ""
                                            ? item.image
                                            : 'https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg'
                                        }
                                        alt="Selected"
                                        mb={"5px"}
                                      />
                                    </Flex>
                                  </Td>
                                  <Td>{item.name}</Td>
                                  <Td>{item.price}</Td>
                                  <Td>{item.description}</Td>
                                  <Td>
                                    <Flex>
                                      <MdEdit
                                        onClick={() => {
                                          handlerIndex(index);
                                        }}
                                      />
                                      <Box w="20px" />
                                      <IoIosTrash
                                        onClick={() => {
                                          handleDelete(index);
                                        }}
                                      />
                                    </Flex>
                                  </Td>
                                </Tr>
                              );
                            })}
                          </Tbody>
                        </Table>
                      </>
                    ) : (
                      <></>
                    )}
                    <Button
                      position="fixed"
                      right="20px"
                      bottom="20px"
                      onClick={handleCreateManually}
                      fontSize={"22px"}
                      fontWeight={"bold"}
                      p="20px"
                      backgroundColor={
                        items.length === 0 ? "#91A7B8" : "#205d8b"
                      }
                      colorScheme={"blue"}
                      variant={"solid"}
                    >
                      Salvar
                    </Button>
                  </VStack>
                </>
              )}
            </TabPanel>
            <TabPanel>
              {tabIndex === 1 && (
                <>
                  <Box mt="5" mb="30px">
                    <Text fontSize="18px" fontWeight="bold">
                      Use planilhas para atualizar seus produtos em grande
                      quantidade de uma só vez
                    </Text>
                    <Flex alignItems={"center"}>
                      <BsFillExclamationTriangleFill size={"10"} />
                      <Text fontSize="12px" ml="4px">
                        Utilize nosso modelo de planilha
                      </Text>
                    </Flex>
                  </Box>
                  {/* <Divider borderColor="100" mb="1rem" /> */}
                  <SimpleGrid columns={2} spacing={10}>
                    <Box bg="tomato" height="150px" borderRadius={"10px"}>
                      <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                      />
                      <Button
                        h="100%"
                        w="100%"
                        onClick={handleClick}
                        fontSize={"16px"}
                        leftIcon={<BsFileEarmarkSpreadsheetFill />}
                      >
                        Adicionar novos itens e atualizar valores
                      </Button>
                    </Box>
                    <Box bg="tomato" height="150px" borderRadius={"10px"}>
                      <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                      />
                      <Button
                        h="100%"
                        w="100%"
                        onClick={handleClick}
                        fontSize={"16px"}
                        leftIcon={<BsFileEarmarkSpreadsheetFill />}
                      >
                        Sobrepor todos meus itens
                      </Button>
                    </Box>
                  </SimpleGrid>
                  <Button
                    position="absolute"
                    right="20px"
                    bottom="20px"
                    onClick={downloadFile}
                  >
                    Baixar modelo de planilha
                  </Button>
                </>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </MotionBox>

      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent color={useColorModeValue("gray.800", "white")}>
          <ModalHeader color={useColorModeValue("#205d8b", "white")}>
            Editar Produto
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Imagem </FormLabel>
              <Box rowSpan={4} colSpan={1}>
                <Flex
                  width="100px"
                  justifyContent={"center"}
                  border={"1px solid lightgrey"}
                  borderRadius={"3%"}
                >
                  <Image
                    height="100px"
                    objectFit="cover"
                    src={
                      imageEdit && imageEdit !== "" ? imageEdit : 'https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg'
                    }
                    alt="Selected"
                    mb={"5px"}
                  />
                </Flex>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRefEdit}
                  style={{ display: "none" }}
                  onChange={handleImageChangeEdit}
                />
                <Button
                  onClick={() => fileInputRefEdit.current?.click()}
                  size="sm"
                >
                  Selecionar arquivo
                </Button>
                {fileInputRefEdit.current?.files?.length && (
                  <Text>
                    Arquivo selecionado:{" "}
                    {fileInputRefEdit.current.files[0].name.substring(0, 10) +
                      (fileInputRefEdit.current.files.length > 10 ? "..." : "")}
                  </Text>
                )}
              </Box>
            </FormControl>
            <br />
            <FormControl mt={4} isRequired>
              <FormLabel htmlFor="productEdit">Produto</FormLabel>
              <Input
                id="productEdit"
                maxlength="100"
                borderColor="100"
                type="text"
                value={nameEdit}
                isRequired
                onChange={(event) => {
                  setNameEdit(event.target.value);
                }}
              />
            </FormControl>
            <br />
            <FormControl mt={4} isRequired>
              <FormLabel htmlFor="valueEdit">Valor</FormLabel>
              <NumericFormat
                id="valueEdit"
                customInput={Input}
                thousandSeparator="."
                decimalSeparator=","
                allowNegative={false}
                isNumericString
                prefix={"R$ "}
                placeholder="Valor*"
                value={valueEdit}
                onChange={(e) => setValueEdit(e.target.value)}
              />
            </FormControl>
            <br />
            <FormControl mt={4}>
              <FormLabel htmlFor="descriptionEdit">Descrição</FormLabel>
              <Input
                id="descriptionEdit"
                maxlength="100"
                borderColor="100"
                type="text"
                value={descriptionEdit}
                isRequired
                onChange={(event) => {
                  setDescriptionEdit(event.target.value);
                }}
              />
            </FormControl>
            <br />
          </ModalBody>

          <ModalFooter>
            <Button
              className="color_main"
              mr={3}
              onClick={() => handleEdit(index)}
            >
              Salvar
            </Button>
            <Button onClick={onClose} colorScheme="red">
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ProductAdd;
