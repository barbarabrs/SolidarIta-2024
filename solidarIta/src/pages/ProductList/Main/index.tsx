import {
  Text,
  Box,
  Button,
  Flex,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Spacer,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  useColorModeValue,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { NumericFormat } from "react-number-format";
import moment from "moment";
import React, {
  ChangeEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { IoIosAdd, IoIosTrash } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../../components/Pagination";
import { AuthContext } from "../../../contexts/AuthContext";
import {
  Product,
  ProductListContext,
} from "../../../contexts/ProductListContext";
import api from "../../../services/api";

const MainProdutcList: React.FC = (): React.ReactElement => {
  const [imageEdit, setImageEdit] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { idUser } = useContext(AuthContext);
  const { isLoading, products, setRefresh } = useContext(ProductListContext);
  const [productsList, setProductsList] = useState<Product[]>(products ?? []);
  const [index, setIndex] = useState<number>(999999999);
  const [name, setName] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const toast = useToast();
  const fileInputRefEdit = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (products !== null) {
      setProductsList(products);
    }
  }, [products]);

  useEffect(() => {
    setRefresh(true);
  }, []);

  const handleDelete = (ind: number) => {
    setIsDelete(true);
    setIndex(ind);
    onOpen();
  };

  const handlerIndex = (ind: number) => {
    setIsDelete(false);
    setIndex(ind);
    setImageEdit(productsList[ind].image);
    setName(productsList[ind].name);
    setValue(productsList[ind].price);
    setDescription(productsList[ind].description);
    onOpen();
  };

  const handlerEdit = (del?: boolean) => {
    if (del) {
      api
        .post("products/delete", { id: productsList[index].id })
        .then((response: { data: any }) => {
          toast({
            title: "Produto excluído com sucesso",
            description: "Produto excluído com sucesso",
            status: "success",
            duration: 4000,
            isClosable: true,
          });
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
          toast({
            title: "Erro ao excluir produto",
            description: "Revise as informações e tente novamente",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
        });
    } else {
      console.log(value);
      let res = "";
      const newValue = value.replace(".", ",").split(",");
      if (newValue.length > 1) {
        res = `${newValue[0]},${
          newValue[1].length < 2
            ? `${newValue[1]}00`.substring(0, 2)
            : newValue[1].substring(0, 2)
        }`;
      } else {
        res = `${newValue},00`;
      }
      console.log(res.replace(/[^\d,]/g, "").replace(",", "."));
      api
        .post("products/add", {
          items: [
            {
              name,
              price: res.replace(/[^\d,]/g, "").replace(",", "."),
              description,
              ...(imageEdit !== productsList[index].image &&
              imageEdit !== 'https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg'
                ? { image: imageEdit }
                : {}),
            },
          ],
          id: idUser,
        })
        .then((response: { data: any }) => {
          toast({
            title: "Produto editado com sucesso",
            description: "Produto editado com sucesso",
            status: "success",
            duration: 4000,
            isClosable: true,
          });
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
          toast({
            title: "Erro ao editar produto",
            description: "Revise as informações e tente novamente",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
        });
    }
  };

  return (
    <>
      <Flex flexDirection="column" w="100%" marginTop={10}>
        <Flex alignItems="center" justifyContent="space-between" mb="3">
          <Box></Box>
          <Spacer />
          <Flex mt="2" alignItems="center" justifyContent="center">
            {isLoading ? (
              <Pagination
                totalCountOfRegisters={1}
                registersPerPage={1}
                currentPage={1}
                onPageChange={setPage}
              />
            ) : (
              ""
            )}
          </Flex>
          <Spacer />
          <Box>
            <Button
              leftIcon={<IoIosAdd />}
              className="color_main"
              variant="solid"
              onClick={() => {
                navigate("/product/add");
              }}
            >
              Adicionar
            </Button>
          </Box>
        </Flex>
        <Spacer />
        {isLoading ? (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Imagem</Th>
                <Th>Produto</Th>
                <Th>Preço</Th>
                <Th>Descrição</Th>
                <Th>Criado em</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {productsList.map((elem: Product, index) => {
                return (
                  <Tr key={index}>
                    <Td>
                      <Flex
                        width="80px"
                        justifyContent={"center"}
                        border={"1px solid lightgrey"}
                        borderRadius={"3%"}
                      >
                        <Image
                          height="80px"
                          objectFit="cover"
                          src={
                            elem.image && elem.image !== ""
                              ? elem.image
                              : 'https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg'
                          }
                          alt="Selected"
                          mb={"5px"}
                        />
                      </Flex>
                    </Td>
                    <Td>{elem.name}</Td>
                    <Td>{elem.price}</Td>
                    <Td>{elem.description}</Td>
                    <Td>{moment(elem.date).format("DD/MM/yyyy")}</Td>
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
      </Flex>

      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent color={useColorModeValue("gray.800", "white")}>
          <ModalHeader color={useColorModeValue("#205d8b", "white")}>
            {isDelete ? "Excluir Produto" : "Editar Produto"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isDelete ? (
              "Deseja excluir esse produto? ele desaparecerá de todas as listas de compras ativas que estiver presente"
            ) : (
              <>
                {" "}
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
                          imageEdit && imageEdit !== ""
                            ? imageEdit
                            : 'https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg'
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
                        {fileInputRefEdit.current.files[0].name.substring(
                          0,
                          10
                        ) +
                          (fileInputRefEdit.current.files.length > 10
                            ? "..."
                            : "")}
                      </Text>
                    )}
                  </Box>
                </FormControl>
                <br />
                <FormControl mt={4} isRequired>
                  <FormLabel htmlFor="productEdit">Produto</FormLabel>
                  <Input
                    disabled={true}
                    id="productEdit"
                    maxlength="100"
                    borderColor="100"
                    type="text"
                    value={name}
                    isRequired
                    onChange={(event) => {
                      setName(event.target.value);
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
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    decimalScale={2}
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
                    value={description}
                    isRequired
                    onChange={(event) => {
                      setDescription(event.target.value);
                    }}
                  />
                </FormControl>
                <br />
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              className="color_main"
              mr={3}
              onClick={() => {
                isDelete ? handlerEdit(true) : handlerEdit();
              }}
            >
              {isDelete ? "Excluir" : "Salvar"}
            </Button>
            <Button onClick={onClose} colorScheme="red">
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MainProdutcList;
