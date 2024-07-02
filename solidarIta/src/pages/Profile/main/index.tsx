import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Image,
  Input,
  InputGroup,
  Select,
  Skeleton,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import moment from "moment";
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import { MdModeEdit } from "react-icons/md";
import TitlePage from "../../../components/TitlePage";
import { AuthContext } from "../../../contexts/AuthContext";
import {
  ProfileContext,
  UserInterfaceData,
} from "../../../contexts/ProfileContext";
import api from "../../../services/api";

const MainProfile = () => {
  const [image, setImage] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordOld, setPasswordOld] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [months, setMonths] = useState<string[]>([]);
  const [days, setDays] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [status, setStatus] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [pix, setPix] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [editImage, setEditImage] = useState<boolean>(false);
  const [editPersonalData, setEditPersonalData] = useState<boolean>(false);
  const [editPhone, setEditPhone] = useState<boolean>(false);
  const [editPix, setEditPix] = useState<boolean>(false);
  const [editCategory, setEditCategory] = useState<boolean>(false);
  const [editAddress, setEditAddress] = useState<boolean>(false);
  const [editBirthday, setEditBirthday] = useState<boolean>(false);
  const [editPassword, setEditPassword] = useState<boolean>(false);
  const [errorInvalidPhone, setErrorInvalidPhone] = useState("");
  const [errorUnder18, setErrorUnder18] = useState<boolean>(false);
  const [errorInvalidPassword, setErrorInvalidPassword] =
    useState<boolean>(false);
  const { userData, isLoading } = useContext(ProfileContext);
  const [profile, setProfile] = useState<UserInterfaceData | null>(userData);
  const { imageUser, user } = useContext(AuthContext);
  const toast = useToast();

  useEffect(() => {
    setImage(
      "https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg"
    );
    setMonths([
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ]);
    setDays([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
      "24",
      "25",
      "26",
      "27",
      "28",
      "29",
      "30",
      "31",
    ]);
    const now = new Date().getFullYear();
    setYears(
      Array.from({ length: 100 }, (_, index) => (now - index).toString())
    );
  }, []);

  useEffect(() => {
    const birthdayDate = new Date(`${year}-${month}-${day}`);
    const olderThan18 = new Date(birthdayDate);
    olderThan18.setFullYear(olderThan18.getFullYear() + 18);
    const today = new Date();
    if (today < olderThan18) {
      setErrorUnder18(true);
    } else {
      setErrorUnder18(false);
    }
  }, [year, month, day]);

  const handlerDay = (e: ChangeEvent<HTMLSelectElement>) => {
    setDay(e.target.value);
  };

  const handlerMonth = (e: ChangeEvent<HTMLSelectElement>) => {
    setMonth(e.target.value);
  };

  const handlerYear = (e: ChangeEvent<HTMLSelectElement>) => {
    setYear(e.target.value);
  };

  useEffect(() => {
    setProfile(userData);
    if (userData?.status) {
      setStatus(userData.status);
    }
    if (userData?.phone) {
      setPhone(userData.phone.toString().replace(/[^\d]/g, ""));
    }
    if (userData?.address) {
      setAddress(userData.address);
    }
    if (userData?.pix) {
      setPix(userData.pix);
    }
    if (userData?.category) {
      setCategory(userData.category);
    }
    if (userData?.image) {
      setImage(userData.image);
    }
    if (userData?.birthday) {
      const birthday = moment(userData.birthday);
      setDay(birthday.format("DD"));
      setMonth((birthday.month() + 1).toString());
      setYear(birthday.format("YYYY"));
    }
  }, [userData]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const handleImage = () => {
    setEditImage(false);
    handleEdit();
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const onlyNums = value.replace(/[^\d]/g, "");
    console.log(onlyNums);
    if (onlyNums.length > 11) {
      return;
    }

    let formattedValue = onlyNums;
    if (onlyNums.length > 2 && onlyNums.length <= 7) {
      formattedValue = `(${onlyNums.slice(0, 2)}) ${onlyNums.slice(2)}`;
    } else if (onlyNums.length > 7 && onlyNums.length <= 11) {
      formattedValue = `(${onlyNums.slice(0, 2)}) ${onlyNums.slice(
        2,
        7
      )}-${onlyNums.slice(7)}`;
    }
    console.log(formattedValue);

    setPhone(formattedValue);

    if (onlyNums.length < 11) {
      setErrorInvalidPhone("Número de telefone incompleto");
    } else {
      setErrorInvalidPhone("");
    }
  };

  useEffect(() => {
    if (/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password) || password === "") {
      setErrorInvalidPassword(false);
    } else {
      setErrorInvalidPassword(true);
    }
  }, [password]);

  const handleNewPassword = (event: FormEvent) => {
    event.preventDefault();
    api
      .post("/User/checkPassword", {
        password: passwordOld,
        email: userData?.email,
        id: userData?.id,
      })
      .then((response) => {
        if (response.data.status === true) {
          handleEdit();
        } else {
          toast({
            title: "Erro ao editar senha.",
            description: "Senha atual incorreta.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Erro ao editar senha.",
          description: "Senha atual incorreta.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const handleEdit = () => {
    let data;
    switch (userData?.user_types) {
      case 1:
        data = {
          id: userData.id,
          username: userData.username,
          status: status,
          email: userData.email,
          ...(password.length >= 8 ? { password: password } : {}),
          user_types: 1,
          birthday: new Date(`${year}-${month}-${day}`),
          ...(image !== userData.image &&
          image !==
            "https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg"
            ? { image: image }
            : {}),
        };
        break;
      case 2:
        data = {
          id: userData.id,
          username: userData.username,
          status: status,
          email: userData.email,
          ...(password.length >= 8 ? { password: password } : {}),
          user_types: 2,
          social_reason: userData.social_reason,
          cnpj_legal: userData.cnpj_legal,
          address: address,
          pix: pix,
          phone: phone.replace(/[^\d]/g, ""),
          ...(image !== userData.image &&
          image !==
            "https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg"
            ? { image: image }
            : {}),
        };
        break;
      case 3:
        data = {
          id: userData.id,
          username: userData.username,
          status: status,
          email: userData.email,
          ...(password.length >= 8 ? { password: password } : {}),
          user_types: 3,
          social_reason: userData.social_reason,
          cnpj_legal: userData.cnpj_legal,
          address: address,
          pix: pix,
          phone: phone.replace(/[^\d]/g, ""),
          category: category,
          ...(image !== userData.image &&
          image !==
            "https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg"
            ? { image: image }
            : {}),
        };
        break;
      default:
        break;
    }
    api
      .post("/User/edit", { data })
      .then((response) => {
        toast({
          title: "Perfil editado.",
          description: "Perfil editado com sucesso.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Erro ao editar perfil.",
          description: "Revise as informações e tente novamente.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      });
  };

  return (
    <>
      <Box width={"100%"}>
        <TitlePage title="Perfil" />
        {isLoading === true ? (
          <Flex align="center" justify="center" width={"100%"}>
            <Box
              width={"100%"}
             
              mx={2}
              pt={5}
              px={{ base: 2, sm: 12, md: 17 }}
            >
              {editImage ? (
                <form onSubmit={handleImage}>
                  <Flex justifyContent={"space-between"}>
                    <FormControl>
                      <Image
                        border={"1px solid lightgrey"}
                        borderRadius={"3%"}
                        boxSize="280px"
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
                    <Flex alignItems={"end"}>
                      <Button
                        mr={2}
                        className="color_main"
                        type="submit"
                        value="submit"
                      >
                        Salvar foto
                      </Button>
                      <Button
                        onClick={() => {
                          setEditImage(false),
                            setImage(
                              "https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg"
                            );
                        }}
                        colorScheme="blue"
                      >
                        Cancelar
                      </Button>
                    </Flex>
                  </Flex>
                </form>
              ) : (
                <Stack>
                  <Image
                    objectFit="cover"
                    borderRadius="full"
                    boxSize="250px"
                    src={image}
                    alt="Dan Abramov"
                  />
                  <Button
                    onClick={() => {
                      setEditImage(true);
                    }}
                    mt="-40px !important"
                    width="fit-content"
                    top="50%"
                    transform="translateY(-50%)"
                    borderRadius="50%"
                    p="0"
                    colorScheme="facebook"
                  >
                    <MdModeEdit />
                  </Button>
                </Stack>
              )}
              <Heading as="h1" size="lg" mb="4" mt="3">
                {user}
              </Heading>
              <Box mb="4">
                <Flex justifyContent={"space-between"}>
                  <Heading as="h2" size="md" mb="2">
                    Status
                  </Heading>
                  {!editPersonalData ? (
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => setEditPersonalData(true)}
                    >
                      Editar
                    </Button>
                  ) : (
                    <Flex>
                      <Button
                        mr="1"
                        size="sm"
                        colorScheme="green"
                        onClick={handleEdit}
                      >
                        Salvar
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => {
                          setEditPersonalData(false),
                            setStatus(userData?.status ? userData.status : "");
                        }}
                      >
                        Cancelar
                      </Button>
                    </Flex>
                  )}
                </Flex>
                {!editPersonalData ? (
                  <Flex align="center" mb="2">
                    <Text fontSize="md" color="gray.600" flex="1">
                      {profile?.status}
                    </Text>
                  </Flex>
                ) : (
                  <Input
                    mt="2"
                    borderColor="200"
                    border="1px solid"
                    borderRadius={"6px"}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                )}
              </Box>
              <Divider mb="4" />
              <Box mb="4">
                <Heading as="h2" size="md" mb="2">
                  Dados da Conta
                </Heading>
                {profile?.user_types === 2 || profile?.user_types === 3 ? (
                  <Flex align="center" mb="2">
                    <Text fontSize="md" color="gray.600" mr="2">
                      Razão Social:
                    </Text>
                    <Text fontSize="md" color="gray.600" flex="1">
                      {profile?.social_reason}
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
                    {profile?.email}
                  </Text>
                </Flex>
                {profile?.user_types === 2 || profile?.user_types === 3 ? (
                  <Flex align="center" mb="2">
                    <Text fontSize="md" color="gray.600" mr="2">
                      CNPJ:
                    </Text>
                    <Text fontSize="md" color="gray.600" flex="1">
                      {profile?.cnpj_legal}
                    </Text>
                  </Flex>
                ) : (
                  <></>
                )}
                {!editPassword ? (
                  <Flex align="center" mb="2">
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => setEditPassword(true)}
                    >
                      Redefinir a senha
                    </Button>
                  </Flex>
                ) : (
                  <form onSubmit={handleNewPassword}>
                    <Flex
                      border={"2px grey solid"}
                      borderRadius={"5px"}
                      p="3"
                      justifyContent={"space-between"}
                      alignItems={"center"}
                    >
                      <Flex>
                        <FormControl
                          id="password"
                          marginBottom="1.5rem"
                          marginRight="1.5rem"
                          width={"100%"}
                        >
                          <FormLabel>Senha Atual</FormLabel>
                          <Input
                            type="password"
                            mt="2"
                            w="fit-content"
                            borderColor="200"
                            border="1px solid"
                            borderRadius={"6px"}
                            value={passwordOld}
                            onChange={(e) => {
                              setPasswordOld(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormControl
                          id="passwordNew"
                          marginBottom="1.5rem"
                          width={"100%"}
                          isInvalid={errorInvalidPassword}
                        >
                          <FormLabel>Nova senha</FormLabel>
                          <Input
                            type="password"
                            mt="2"
                            w="fit-content"
                            borderColor="200"
                            border="1px solid"
                            borderRadius={"6px"}
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                            }}
                          />
                          <FormErrorMessage position={"absolute"} w="900px">
                            Requisitos: no mínimo uma letra maiúscula, um número
                            e 8 dígitos.
                          </FormErrorMessage>
                        </FormControl>
                      </Flex>
                      <Flex>
                        <Button
                          mr="1"
                          isDisabled={errorInvalidPassword || password === ""}
                          size="sm"
                          colorScheme="green"
                          type="submit"
                          value="submit"
                        >
                          Salvar nova senha
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() => {
                            setEditPassword(false), setPassword("");
                          }}
                        >
                          Cancelar
                        </Button>
                      </Flex>
                    </Flex>
                  </form>
                )}
              </Box>
              <Divider mb="4" />
              {profile?.user_types === 3 ? (
                <>
                  <Box mb="4">
                    <Flex justifyContent={"space-between"}>
                      <Heading as="h2" size="md" mb="2">
                        Categoria do estabelecimento
                      </Heading>
                      {!editCategory ? (
                        <Button
                          size="sm"
                          colorScheme="blue"
                          onClick={() => setEditCategory(true)}
                        >
                          Editar
                        </Button>
                      ) : (
                        <Flex>
                          <Button
                            isDisabled={category.length < 3}
                            mr="1"
                            size="sm"
                            colorScheme="green"
                            onClick={handleEdit}
                          >
                            Salvar
                          </Button>
                          <Button
                            size="sm"
                            colorScheme="red"
                            onClick={() => {
                              setEditCategory(false),
                                setCategory(
                                  userData?.category ? userData.category : ""
                                );
                            }}
                          >
                            Cancelar
                          </Button>
                        </Flex>
                      )}
                    </Flex>
                    {!editCategory ? (
                      <Flex align="center" mb="2">
                        <Text fontSize="md" color="gray.600" mr="2">
                          Categoria:
                        </Text>
                        <Text fontSize="md" color="gray.600" flex="1">
                          {profile?.category}
                        </Text>
                      </Flex>
                    ) : (
                      <Input
                        mt="2"
                        w="fit-content"
                        borderColor="200"
                        border="1px solid"
                        borderRadius={"6px"}
                        value={category}
                        onChange={(e) => {
                          setCategory(e.target.value);
                        }}
                      />
                    )}
                  </Box>
                  <Divider mb="4" />
                </>
              ) : (
                <></>
              )}
              {profile?.user_types === 2 || profile?.user_types === 3 ? (
                <>
                  <Box mb="4">
                    <Flex justifyContent={"space-between"}>
                      <Heading as="h2" size="md" mb="2">
                        Número de telefone
                      </Heading>
                      {!editPhone ? (
                        <Button
                          size="sm"
                          colorScheme="blue"
                          onClick={() => setEditPhone(true)}
                        >
                          Editar
                        </Button>
                      ) : (
                        <Flex>
                          <Button
                            isDisabled={!!errorInvalidPhone}
                            mr="1"
                            size="sm"
                            colorScheme="green"
                            onClick={handleEdit}
                          >
                            Salvar
                          </Button>
                          <Button
                            size="sm"
                            colorScheme="red"
                            onClick={() => {
                              setEditPhone(false),
                                setPhone(
                                  userData?.phone
                                    ? userData?.phone?.toString()
                                    : ""
                                );
                            }}
                          >
                            Cancelar
                          </Button>
                        </Flex>
                      )}
                    </Flex>
                    {!editPhone ? (
                      <Flex align="center" mb="2">
                        <Text fontSize="md" color="gray.600" mr="2">
                          Telefone:
                        </Text>
                        <Text fontSize="md" color="gray.600" flex="1">
                          {profile?.phone}
                        </Text>
                      </Flex>
                    ) : (
                      <FormControl
                        id="phone"
                        marginBottom="1.5rem"
                        isInvalid={!!errorInvalidPhone}
                      >
                        <Input
                          mt="2"
                          w="fit-content"
                          borderColor="200"
                          border="1px solid"
                          borderRadius={"6px"}
                          value={phone}
                          onChange={handlePhoneChange}
                        />
                        <FormErrorMessage position={"absolute"}>
                          {errorInvalidPhone}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Box>
                  <Divider mb="4" />
                </>
              ) : (
                <></>
              )}
              {profile?.user_types === 2 || profile?.user_types === 3 ? (
                <Box mb="4">
                  <Flex justifyContent={"space-between"}>
                    <Heading as="h2" size="md" mb="2">
                      Endereço
                    </Heading>
                    {!editAddress ? (
                      <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={() => setEditAddress(true)}
                      >
                        Editar
                      </Button>
                    ) : (
                      <Flex>
                        <Button
                          isDisabled={address.length < 10}
                          mr="1"
                          size="sm"
                          colorScheme="green"
                          onClick={handleEdit}
                        >
                          Salvar
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() => {
                            setEditAddress(false),
                              setAddress(
                                userData?.address ? userData.address : ""
                              );
                          }}
                        >
                          Cancelar
                        </Button>
                      </Flex>
                    )}
                  </Flex>
                  {!editAddress ? (
                    <Flex align="center" mb="2">
                      <Text fontSize="md" color="gray.600" mr="2">
                        Endereço completo:
                      </Text>
                      <Text fontSize="md" color="gray.600" flex="1">
                        {profile?.address}
                      </Text>
                    </Flex>
                  ) : (
                    <Input
                      mt="2"
                      borderColor="200"
                      border="1px solid"
                      borderRadius={"6px"}
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                      }}
                    />
                  )}
                </Box>
              ) : (
                <Box mb="4">
                  <Flex justifyContent={"space-between"}>
                    <Heading as="h2" size="md" mb="2">
                      Data de nascimento
                    </Heading>
                    {!editBirthday ? (
                      <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={() => setEditBirthday(true)}
                      >
                        Editar
                      </Button>
                    ) : (
                      <>
                        {" "}
                        <Flex>
                          <Button
                            isDisabled={!!errorUnder18}
                            mr="1"
                            size="sm"
                            colorScheme="green"
                            onClick={handleEdit}
                          >
                            Salvar
                          </Button>
                          <Button
                            size="sm"
                            colorScheme="red"
                            onClick={() => {
                              setEditBirthday(false),
                                setDay(
                                  userData?.birthday
                                    ? moment(userData.birthday).format("DD")
                                    : ""
                                ),
                                setMonth(
                                  userData?.birthday
                                    ? (
                                        moment(userData.birthday).month() + 1
                                      ).toString()
                                    : ""
                                ),
                                setYear(
                                  userData?.birthday
                                    ? moment(userData.birthday).format("YYYY")
                                    : ""
                                );
                            }}
                          >
                            Cancelar
                          </Button>
                        </Flex>
                      </>
                    )}
                  </Flex>
                  {!editBirthday ? (
                    <Flex align="center" mb="2">
                      <Text fontSize="md" color="gray.600" mr="2">
                        Data de nascimento:
                      </Text>
                      <Text fontSize="md" color="gray.600" flex="1">
                        {moment(profile?.birthday).format("DD/MM/yyyy")}
                      </Text>
                    </Flex>
                  ) : (
                    <FormControl
                      id="birthdayWrapper"
                      marginBottom="1.5rem"
                      width={"100%"}
                      isInvalid={errorUnder18}
                    >
                      <InputGroup display={"flex"}>
                        <Select value={day} onChange={(e) => handlerDay(e)}>
                          {days.map((day, index) => (
                            <option key={index} value={day}>
                              {day}
                            </option>
                          ))}
                        </Select>
                        <Select value={month} onChange={(e) => handlerMonth(e)}>
                          {months.map((month, index) => (
                            <option key={index} value={index + 1}>
                              {month}
                            </option>
                          ))}
                        </Select>
                        <Select value={year} onChange={(e) => handlerYear(e)}>
                          {years.map((year, index) => (
                            <option key={index} value={year}>
                              {year}
                            </option>
                          ))}
                        </Select>
                      </InputGroup>
                      <FormErrorMessage position={"absolute"}>
                        Desculpe, você precisa ter 18 anos ou mais.
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Box>
              )}
              <Divider mb="4" />
              {profile?.user_types === 2 || profile?.user_types === 3 ? (
                <>
                  <Box mb="4">
                    <Flex justifyContent={"space-between"}>
                      <Heading as="h2" size="md" mb="2">
                        Forma de Pagamento
                      </Heading>
                      {!editPix ? (
                        <Button
                          size="sm"
                          colorScheme="blue"
                          onClick={() => setEditPix(true)}
                        >
                          Editar
                        </Button>
                      ) : (
                        <Flex>
                          <Button
                            isDisabled={pix.length < 5}
                            mr="1"
                            size="sm"
                            colorScheme="green"
                            onClick={handleEdit}
                          >
                            Salvar
                          </Button>
                          <Button
                            size="sm"
                            colorScheme="red"
                            onClick={() => {
                              setEditPix(false),
                                setPix(userData?.pix ? userData.pix : "");
                            }}
                          >
                            Cancelar
                          </Button>
                        </Flex>
                      )}
                    </Flex>
                    {!editPix ? (
                      <Flex align="center" mb="2">
                        <Text fontSize="md" color="gray.600" mr="2">
                          PIX:
                        </Text>
                        <Text fontSize="md" color="gray.600" flex="1">
                          {profile?.pix}
                        </Text>
                      </Flex>
                    ) : (
                      <Input
                        mt="2"
                        w="fit-content"
                        borderColor="200"
                        border="1px solid"
                        borderRadius={"6px"}
                        value={pix}
                        onChange={(e) => {
                          setPix(e.target.value);
                        }}
                      />
                    )}
                  </Box>

                  <Divider />
                </>
              ) : (
                <></>
              )}{" "}
            </Box>
          </Flex>
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

export default MainProfile;
