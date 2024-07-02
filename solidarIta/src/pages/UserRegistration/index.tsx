import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { cnpj } from "cpf-cnpj-validator";
import { useToast } from "@chakra-ui/react";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { FaEnvelope, FaIdCard, FaLock, FaUser, FaLink } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import { FiMoon, FiSun } from "react-icons/fi";
import { PhoneInput } from "react-international-phone";
import { useNavigate } from "react-router-dom";
import logoLogin from "../../assets/images/logo-login.png";
import {
  animationFlex,
  itemAnimation,
  MotionFlex,
} from "../../components/Styles/motion-animate/animate";
import api from "../../services/api";
import { BsTelephoneFill } from "react-icons/bs";
import { MdPayment } from "react-icons/md";

export default function UserRegistration() {
  //SETANDO LOGINS CORRETOS AUTOMATICO, RETIRAR DEPOIS
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [cnpjInput, setCnpjInput] = useState("");
  const [corporateReason, setCorporateReason] = useState("");
  const [phone, setPhone] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pix, setPix] = useState("");
  const [category, setCategory] = useState("");
  const [socialMedia, setSocialMedia] = useState("");
  const [errorInvalidPhone, setErrorInvalidPhone] = useState("");
  const [errorWrongPassword, setErrorWrongPassword] = useState<boolean>(false);
  const [errorInvalidPassword, setErrorInvalidPassword] =
    useState<boolean>(false);
  const [errorInvalidCnpj, setErrorInvalidCnpj] = useState<boolean>(false);
  const [errorUnder18, setErrorUnder18] = useState<boolean>(false);
  const [donor, setDonor] = useState<boolean>(true);
  const [institution, setInstitution] = useState<boolean>(false);
  const [partner, setPartner] = useState<boolean>(false);
  const [months, setMonths] = useState<string[]>([]);
  const [days, setDays] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();

  useEffect(() => {
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
    const today = new Date();
    setDay("1");
    setMonth("1");
    setYear(today.getFullYear().toString());
  }, []);

  useEffect(() => {
    const rawValue = cnpjInput.replace(/\D/g, "");
    let formattedValue = "";

    if (rawValue.length <= 2) {
      formattedValue = rawValue;
    } else if (rawValue.length <= 5) {
      formattedValue = `${rawValue.slice(0, 2)}.${rawValue.slice(2)}`;
    } else if (rawValue.length <= 8) {
      formattedValue = `${rawValue.slice(0, 2)}.${rawValue.slice(
        2,
        5
      )}.${rawValue.slice(5)}`;
    } else if (rawValue.length <= 12) {
      formattedValue = `${rawValue.slice(0, 2)}.${rawValue.slice(
        2,
        5
      )}.${rawValue.slice(5, 8)}/${rawValue.slice(8)}`;
    } else {
      formattedValue = `${rawValue.slice(0, 2)}.${rawValue.slice(
        2,
        5
      )}.${rawValue.slice(5, 8)}/${rawValue.slice(8, 12)}-${rawValue.slice(
        12
      )}`;
    }
    setCnpjInput(formattedValue);
    if (cnpjInput.replace(/\D/g, "").length === 14) {
      if (cnpj.isValid(cnpjInput.replace(/\D/g, ""))) {
        setErrorInvalidCnpj(false);
      } else {
        setErrorInvalidCnpj(true);
      }
    }
  }, [cnpjInput]);

  useEffect(() => {
    if (/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password) || password === "") {
      setErrorInvalidPassword(false);
    } else {
      setErrorInvalidPassword(true);
    }
  }, [password]);

  useEffect(() => {
    if (
      passwordConfirm === password ||
      password === "" ||
      passwordConfirm === ""
    ) {
      setErrorWrongPassword(false);
    } else {
      setErrorWrongPassword(true);
    }
  }, [passwordConfirm, password]);

  useEffect(() => {
    const birthdayDate = new Date(`${year}-${month}-${day}`);
    const olderThan18 = new Date(birthdayDate);
    olderThan18.setFullYear(olderThan18.getFullYear() + 18);
    const today = new Date();
    if (today < olderThan18) {
      if (
        day === "1" &&
        month === "1" &&
        year === today.getFullYear().toString()
      ) {
        setErrorUnder18(false);
      } else {
        setErrorUnder18(true);
      }
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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const onlyNums = value.replace(/[^\d]/g, "");

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

    setPhone(formattedValue);

    if (onlyNums.length < 11) {
      setErrorInvalidPhone("Número de telefone incompleto");
    } else {
      setErrorInvalidPhone("");
    }
  };

  function handlerUserType(type: string) {
    setName("");
    setSurname("");
    setEmail("");
    setPassword("");
    setPasswordConfirm("");
    setCorporateReason("");
    setCnpjInput("");
    setPhone("");
    setDay("1");
    setMonth("1");
    setYear(new Date().getFullYear().toString());
    switch (type) {
      case "donor":
        setDonor(true);
        setPartner(false);
        setInstitution(false);
        break;
      case "partner":
        setPartner(true);
        setDonor(false);
        setInstitution(false);
        break;
      case "institution":
        setInstitution(true);
        setPartner(false);
        setDonor(false);
        break;
      default:
        break;
    }
  }

  const addressFormat = () => {
    return `${street}, ${number}${
      complement ? ` , ${complement}` : ""
    } - ${city}, ${state}.`;
  };

  const handleRegisterSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (
      donor &&
      day === "1" &&
      month === "1" &&
      year === new Date().getFullYear().toString()
    ) {
      setErrorUnder18(true);
      return;
    } else if (
      (partner || institution) &&
      !cnpj.isValid(cnpjInput.replace(/\D/g, ""))
    ) {
      setErrorInvalidCnpj(true);
      return;
    } else {
      api
        .post("user/create", {
          ...(donor ? { username: name + ' ' + surname } : { username: name }),
          email,
          password,
          user_types: partner ? 3 : institution ? 2 : 1,
          ...(corporateReason && { social_reason: corporateReason }),
          ...(cnpjInput && { cnpj_legal: cnpjInput.replace(/[^\d]/g, "") }),
          ...(street && { address: addressFormat() }),
          ...(pix && { pix: pix }),
          ...(phone && { phone: phone.replace(/[^\d]/g, "") }),
          ...(donor && { birthday: new Date(`${year}-${month}-${day}`) }),
          ...(category && { category: category }),
          ...(socialMedia && { social_media: socialMedia }),
        })
        .then((response) => {
          // console.log(response.data);
          if (partner || institution) {
            navigate("/pendingUser");

            toast({
              title: "Pré cadastro realizado!",
              description: "Pré cadastro realizado com sucesso.",
              status: "success",
              duration: 4000,
              isClosable: true,
            });
          } else {
            navigate("/login", { replace: true });

            toast({
              title: "Cadastro realizado!",
              description: "cadastro realizado com sucesso.",
              status: "success",
              duration: 4000,
              isClosable: true,
            });
          }
        })
        .catch((error) => {
          if (error.response.status === 401) {
            toast({
              title: "Não foi possível cadastrar.",
              description: error.response.data.message,
              status: "error",
              duration: 4000,
              isClosable: true,
            });
          } else {
            toast({
              title: "Não foi possível cadastrar.",
              description: "Algo de errado aconteceu, tente novamente.",
              status: "error",
              duration: 4000,
              isClosable: true,
            });
          }
        });
    }
  };

  return (
    <Box
      bg={useColorModeValue("white", "gray.800")}
      h={"100vh"}
      overflowY={"scroll"}
    >
      <Stack
        maxWidth={"1280px"}
        margin="0 auto"
        direction={{ base: "column", md: "row" }}
      >
        <MotionFlex
          variants={animationFlex}
          initial="hidden"
          animate="visible"
          px={8}
          pt={4}
          flex={1}
          justify={"center"}
        >
          <Stack spacing={4} w={"full"}>
            <Flex justifyContent={"space-between"}>
              <Button onClick={() => navigate("/login")} marginTop={"10px"}>
                Entrar
              </Button>
              <Heading
                mb={"2"}
                justifyContent={"center"}
                alignItems={"end"}
                display={"flex"}
              >
                <Text color={"#205d8b"} fontSize={"40px"}>
                  Solidar{" "}
                </Text>
                <Text color={"#f7c501"} fontSize={"50px"} lineHeight={"55px"}>
                  {" "}
                  Ita
                </Text>
              </Heading>
              <Button onClick={toggleColorMode} marginTop={"10px"}>
                {colorMode === "light" ? <FiMoon /> : <FiSun />}
              </Button>
            </Flex>
            {donor && (
              <MotionFlex
                variants={animationFlex}
                initial="hidden"
                animate="visible"
              >
                <form onSubmit={handleRegisterSubmit}>
                  <Box w="700px">
                    <Flex justifyContent={"center"} mb={6}>
                      <Box border={"solid 2px #205d8b"} borderRadius={"10px"}>
                        <Button
                          colorScheme="facebook"
                          variant={donor ? "solid" : "ghost"}
                          onClick={() => {
                            handlerUserType("donor");
                          }}
                        >
                          Doador
                        </Button>
                        <Button
                          colorScheme="facebook"
                          variant={partner ? "solid" : "ghost"}
                          onClick={() => {
                            handlerUserType("partner");
                          }}
                        >
                          Parceiro
                        </Button>
                        <Button
                          colorScheme="facebook"
                          variant={institution ? "solid" : "ghost"}
                          onClick={() => {
                            handlerUserType("institution");
                          }}
                        >
                          Instituição
                        </Button>
                      </Box>
                    </Flex>
                    <MotionFlex variants={itemAnimation}>
                      <FormControl
                        id="nome"
                        marginBottom="1.5rem"
                        spacing={4}
                        w={"full"}
                        maxW={"md"}
                      >
                        <FormLabel>Nome</FormLabel>
                        <InputGroup>
                          <InputLeftElement
                            height={"100%"}
                            pointerEvents="none"
                            children={<FaUser />}
                          />
                          <Input
                            size="lg"
                            borderRadius={"100px"}
                            placeholder="Nome"
                            focusBorderColor="#205d8b"
                            variant="filled"
                            type="text"
                            color={"black"}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            isRequired
                          />
                        </InputGroup>
                      </FormControl>
                      <Box width={"20px"} />
                      <FormControl id="Sobrenome" marginBottom="1.5rem">
                        <FormLabel>Sobrenome</FormLabel>
                        <InputGroup>
                          <InputLeftElement
                            height={"100%"}
                            pointerEvents="none"
                            children={<FaUser />}
                          />
                          <Input
                            size="lg"
                            borderRadius={"100px"}
                            placeholder="Sobrenome"
                            focusBorderColor="#205d8b"
                            variant="filled"
                            type="text"
                            color={"black"}
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            isRequired
                          />
                        </InputGroup>
                      </FormControl>
                    </MotionFlex>
                    <MotionFlex variants={itemAnimation}>
                      <FormControl id="email" marginBottom="1.5rem">
                        <FormLabel>Email</FormLabel>
                        <InputGroup>
                          <InputLeftElement
                            height={"100%"}
                            pointerEvents="none"
                            children={<FaEnvelope />}
                          />
                          <Input
                            size="lg"
                            borderRadius={"100px"}
                            placeholder="Email"
                            focusBorderColor="#205d8b"
                            variant="filled"
                            type="email"
                            color={"black"}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            isRequired
                          />
                        </InputGroup>
                      </FormControl>
                    </MotionFlex>
                    <MotionFlex variants={itemAnimation}>
                      <FormControl
                        id="password"
                        spacing={4}
                        w={"full"}
                        maxW={"md"}
                        isInvalid={errorInvalidPassword}
                      >
                        <FormLabel>Senha</FormLabel>
                        <InputGroup>
                          <InputLeftElement
                            height={"100%"}
                            pointerEvents="none"
                            children={<FaLock />}
                          />
                          <Input
                            size="lg"
                            borderRadius={"100px"}
                            placeholder="Senha"
                            focusBorderColor="#205d8b"
                            variant="filled"
                            type="password"
                            color={"black"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            isRequired
                          />
                        </InputGroup>
                        <FormErrorMessage
                          position={"absolute"}
                          lineHeight={1}
                          fontSize={"11px"}
                        >
                          Requisitos: no mínimo uma letra maiúscula, um número e
                          8 dígitos.
                        </FormErrorMessage>
                      </FormControl>
                      <Box width={"20px"} />
                      <FormControl
                        id="passwordConfirm"
                        marginBottom="1.5rem"
                        isInvalid={errorWrongPassword}
                      >
                        <FormLabel>Confirme nova senha</FormLabel>
                        <InputGroup>
                          <InputLeftElement
                            height={"100%"}
                            pointerEvents="none"
                            children={<FaLock />}
                          />
                          <Input
                            size="lg"
                            borderRadius={"100px"}
                            placeholder="Senha"
                            focusBorderColor="#205d8b"
                            variant="filled"
                            type="password"
                            color={"black"}
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            isRequired
                          />
                        </InputGroup>
                        <FormErrorMessage position={"absolute"}>
                          As senhas não coincidem
                        </FormErrorMessage>
                      </FormControl>
                    </MotionFlex>
                    {/* <MotionFlex variants={itemAnimation}>
                    <FormControl isRequired>
                      <FormLabel>Telefone</FormLabel>
                      <PhoneInput
                        defaultCountry="br"
                        value={phone}
                        onChange={(phone) => setPhone(phone)}
                        inputStyle={{
                          width: "100%",
                          fontWeight: "500",
                          borderRadius: '15px',
                          height: '40px',
                          backgroundColor: 'inherit'
                        }}
                      />
                    </FormControl>
                  </MotionFlex> */}
                    <MotionFlex variants={itemAnimation}>
                      <FormControl
                        id="birthdayWrapper"
                        marginBottom="1.5rem"
                        width={"100%"}
                        isInvalid={errorUnder18}
                      >
                        <FormLabel>Data de nascimento</FormLabel>
                        <InputGroup display={"flex"}>
                          <Select value={day} onChange={(e) => handlerDay(e)}>
                            {days.map((day, index) => (
                              <option key={index} value={day}>
                                {day}
                              </option>
                            ))}
                          </Select>
                          <Select
                            value={month}
                            onChange={(e) => handlerMonth(e)}
                          >
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
                          Desculpe, você precisa ter 18 anos ou mais para se
                          registrar.
                        </FormErrorMessage>
                      </FormControl>
                    </MotionFlex>
                    <MotionFlex
                      variants={itemAnimation}
                      display={"block"}
                      m={"0 auto"}
                    >
                      <Stack spacing={6}>
                        <Button
                          isDisabled={
                            errorWrongPassword ||
                            errorInvalidPassword ||
                            errorUnder18
                          }
                          size="lg"
                          borderRadius={"100px"}
                          my={"4"}
                          backgroundColor={
                            errorWrongPassword ||
                            errorInvalidPassword ||
                            errorUnder18
                              ? "#91A7B8"
                              : "#205d8b"
                          }
                          colorScheme={"blue"}
                          variant={"solid"}
                          type="submit"
                          value="submit"
                        >
                          Cadastre-se
                        </Button>
                      </Stack>
                    </MotionFlex>
                  </Box>
                </form>
              </MotionFlex>
            )}
            {partner && (
              <MotionFlex
                variants={animationFlex}
                initial="hidden"
                animate="visible"
              >
                <form onSubmit={handleRegisterSubmit}>
                  <Box w="700px">
                    <Flex justifyContent={"center"} mb={6}>
                      <Box border={"solid 2px #205d8b"} borderRadius={"10px"}>
                        <Button
                          colorScheme="facebook"
                          variant={donor ? "solid" : "ghost"}
                          onClick={() => {
                            handlerUserType("donor");
                          }}
                        >
                          Doador
                        </Button>
                        <Button
                          colorScheme="facebook"
                          variant={partner ? "solid" : "ghost"}
                          onClick={() => {
                            handlerUserType("partner");
                          }}
                        >
                          Parceiro
                        </Button>
                        <Button
                          colorScheme="facebook"
                          variant={institution ? "solid" : "ghost"}
                          onClick={() => {
                            handlerUserType("institution");
                          }}
                        >
                          Instituição
                        </Button>
                      </Box>
                    </Flex>
                    <MotionFlex variants={itemAnimation}>
                      <FormControl
                        id="nome"
                        marginBottom="1.5rem"
                        spacing={4}
                        w={"full"}
                        maxW={"md"}
                      >
                        <FormLabel>Nome</FormLabel>
                        <InputGroup>
                          <InputLeftElement
                            height={"100%"}
                            pointerEvents="none"
                            children={<FaUser />}
                          />
                          <Input
                            size="lg"
                            borderRadius={"100px"}
                            placeholder="Nome"
                            focusBorderColor="#205d8b"
                            variant="filled"
                            type="text"
                            color={"black"}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            isRequired
                          />
                        </InputGroup>
                      </FormControl>
                      <Box width={"20px"} />
                      <FormControl id="razaoSocial" marginBottom="1.5rem">
                        <FormLabel>Razão Social</FormLabel>
                        <InputGroup>
                          <InputLeftElement
                            height={"100%"}
                            pointerEvents="none"
                            children={<FaUser />}
                          />
                          <Input
                            size="lg"
                            borderRadius={"100px"}
                            placeholder="Razão Social"
                            focusBorderColor="#205d8b"
                            variant="filled"
                            type="text"
                            color={"black"}
                            value={corporateReason}
                            onChange={(e) => setCorporateReason(e.target.value)}
                            isRequired
                          />
                        </InputGroup>
                      </FormControl>
                      <Box width={"20px"} />
                      <FormControl id="category" marginBottom="1.5rem">
                        <FormLabel>Categoria</FormLabel>
                        <InputGroup>
                          <InputLeftElement
                            height={"100%"}
                            pointerEvents="none"
                            children={<BiCategory />}
                          />
                          <Input
                            size="lg"
                            borderRadius={"100px"}
                            placeholder="Categoria"
                            focusBorderColor="#205d8b"
                            variant="filled"
                            type="text"
                            color={"black"}
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            isRequired
                          />
                        </InputGroup>
                      </FormControl>
                    </MotionFlex>
                    <MotionFlex variants={itemAnimation}>
                      <FormControl id="email" marginBottom="1.5rem">
                        <FormLabel>Email</FormLabel>
                        <InputGroup>
                          <InputLeftElement
                            height={"100%"}
                            pointerEvents="none"
                            children={<FaEnvelope />}
                          />
                          <Input
                            size="lg"
                            borderRadius={"100px"}
                            placeholder="Email"
                            focusBorderColor="#205d8b"
                            variant="filled"
                            type="email"
                            color={"black"}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            isRequired
                          />
                        </InputGroup>
                      </FormControl>
                      <Box width={"20px"} />
                      <FormControl
                        id="cnpj"
                        marginBottom="1.5rem"
                        width={"100%"}
                        isInvalid={errorInvalidCnpj}
                      >
                        <FormLabel>CNPJ</FormLabel>
                        <InputGroup>
                          <InputLeftElement
                            height={"100%"}
                            pointerEvents="none"
                            children={<FaIdCard />}
                          />
                          <Input
                            size="lg"
                            borderRadius={"100px"}
                            placeholder="CNPJ"
                            focusBorderColor="#205d8b"
                            variant="filled"
                            type="text"
                            color={"black"}
                            value={cnpjInput}
                            onChange={(e) =>
                              e.target.value.replace(/\D/g, "").length <= 14
                                ? setCnpjInput(e.target.value)
                                : ""
                            }
                            isRequired
                          />
                        </InputGroup>
                        <FormErrorMessage position={"absolute"}>
                          CNPJ digitado não é válido
                        </FormErrorMessage>
                      </FormControl>
                    </MotionFlex>
                    <MotionFlex variants={itemAnimation}>
                      <FormControl
                        id="password"
                        spacing={4}
                        w={"full"}
                        maxW={"md"}
                        isInvalid={errorInvalidPassword}
                      >
                        <FormLabel>Senha</FormLabel>
                        <InputGroup>
                          <InputLeftElement
                            height={"100%"}
                            pointerEvents="none"
                            children={<FaLock />}
                          />
                          <Input
                            size="lg"
                            borderRadius={"100px"}
                            placeholder="Senha"
                            focusBorderColor="#205d8b"
                            variant="filled"
                            type="password"
                            color={"black"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            isRequired
                          />
                        </InputGroup>
                        <FormErrorMessage
                          position={"absolute"}
                          lineHeight={1}
                          fontSize={"11px"}
                        >
                          Requisitos: no mínimo uma letra maiúscula, um número e
                          8 dígitos.
                        </FormErrorMessage>
                      </FormControl>
                      <Box width={"20px"} />
                      <FormControl
                        id="passwordConfirm"
                        marginBottom="1.5rem"
                        isInvalid={errorWrongPassword}
                      >
                        <FormLabel>Confirme nova senha</FormLabel>
                        <InputGroup>
                          <InputLeftElement
                            height={"100%"}
                            pointerEvents="none"
                            children={<FaLock />}
                          />
                          <Input
                            size="lg"
                            borderRadius={"100px"}
                            placeholder="Senha"
                            focusBorderColor="#205d8b"
                            variant="filled"
                            type="password"
                            color={"black"}
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            isRequired
                          />
                        </InputGroup>
                        <FormErrorMessage position={"absolute"}>
                          As senhas não coincidem
                        </FormErrorMessage>
                      </FormControl>
                    </MotionFlex>
                    <MotionFlex variants={itemAnimation}>
                      <FormControl
                        id="phone"
                        marginBottom="1.5rem"
                        isInvalid={!!errorInvalidPhone}
                      >
                        <FormLabel>Telefone</FormLabel>
                        <InputGroup>
                          <InputLeftElement
                            height={"100%"}
                            pointerEvents="none"
                            children={<BsTelephoneFill />}
                          />
                          <Input
                            isRequired
                            size="lg"
                            borderRadius={"100px"}
                            focusBorderColor="#205d8b"
                            variant="filled"
                            color={"black"}
                            type="tel"
                            placeholder="Número de telefone"
                            value={phone}
                            onChange={handlePhoneChange}
                          />
                        </InputGroup>
                        <FormErrorMessage position={"absolute"}>
                          {errorInvalidPhone}
                        </FormErrorMessage>
                      </FormControl>
                      <Box width={"20px"} />
                      <FormControl id="pix" marginBottom="1.5rem">
                        <FormLabel>Chave PIX</FormLabel>
                        <InputGroup>
                          <InputLeftElement
                            height={"100%"}
                            pointerEvents="none"
                            children={<MdPayment />}
                          />
                          <Input
                            isRequired
                            size="lg"
                            borderRadius={"100px"}
                            focusBorderColor="#205d8b"
                            variant="filled"
                            color={"black"}
                            type="tel"
                            placeholder="PIX"
                            value={pix}
                            onChange={(e) => setPix(e.target.value)}
                          />
                        </InputGroup>
                      </FormControl>
                    </MotionFlex>
                    <MotionFlex variants={itemAnimation}>
                      <FormControl
                        id="street"
                        marginBottom="1.5rem"
                        width={"100%"}
                      >
                        <FormLabel>Rua</FormLabel>
                        <Input
                          size="lg"
                          borderRadius={"100px"}
                          placeholder="Rua"
                          focusBorderColor="#205d8b"
                          variant="filled"
                          type="text"
                          color={"black"}
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          isRequired
                        />
                      </FormControl>
                      <Box width={"20px"} />
                      <FormControl w="80px" id="number" marginBottom="1.5rem">
                        <FormLabel>Número</FormLabel>
                        <Input
                          isRequired
                          size="lg"
                          placeholder="N°"
                          borderRadius={"100px"}
                          focusBorderColor="#205d8b"
                          variant="filled"
                          color={"black"}
                          type="tel"
                          value={number}
                          onChange={(e) =>
                            setNumber(e.target.value.replace(/\D/g, ""))
                          }
                        />
                      </FormControl>
                      <Box width={"20px"} />
                      <FormControl id="complement" marginBottom="1.5rem">
                        <FormLabel>Complemento</FormLabel>
                        <Input
                          size="lg"
                          borderRadius={"100px"}
                          focusBorderColor="#205d8b"
                          variant="filled"
                          color={"black"}
                          type="tel"
                          placeholder="Complemento"
                          value={complement}
                          onChange={(e) => setComplement(e.target.value)}
                        />
                      </FormControl>
                    </MotionFlex>
                    <MotionFlex variants={itemAnimation}>
                      <FormControl id="city" marginBottom="1.5rem">
                        <FormLabel>Cidade</FormLabel>
                        <Input
                          isRequired
                          size="lg"
                          borderRadius={"100px"}
                          focusBorderColor="#205d8b"
                          variant="filled"
                          color={"black"}
                          type="tel"
                          placeholder="Cidade"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </FormControl>
                      <Box width={"20px"} />
                      <FormControl id="state" marginBottom="1.5rem">
                        <FormLabel>Estado</FormLabel>
                        <Input
                          isRequired
                          size="lg"
                          borderRadius={"100px"}
                          focusBorderColor="#205d8b"
                          variant="filled"
                          color={"black"}
                          type="tel"
                          placeholder="Estado"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                        />
                      </FormControl>
                    </MotionFlex>
                    <MotionFlex variants={itemAnimation}>
                      <FormControl id="social_media" marginBottom="1.5rem">
                        <FormLabel>Link da sua principal rede social</FormLabel>
                        <InputGroup>
                          <InputLeftElement
                            height={"100%"}
                            pointerEvents="none"
                            children={<FaLink />}
                          />
                          <Input
                            isRequired
                            size="lg"
                            borderRadius={"100px"}
                            focusBorderColor="#205d8b"
                            variant="filled"
                            color={"black"}
                            type="text"
                            placeholder="Link"
                            value={socialMedia}
                            onChange={(e) => setSocialMedia(e.target.value)}
                          />
                        </InputGroup>
                      </FormControl>
                    </MotionFlex>
                    <MotionFlex
                      variants={itemAnimation}
                      display={"block"}
                      m={"0 auto"}
                    >
                      <Stack spacing={6}>
                        <Button
                          isDisabled={
                            errorWrongPassword ||
                            errorInvalidPassword ||
                            !!errorInvalidPhone ||
                            errorInvalidCnpj
                          }
                          size="lg"
                          borderRadius={"100px"}
                          my={"4"}
                          backgroundColor={
                            errorWrongPassword ||
                            errorInvalidPassword ||
                            !!errorInvalidPhone ||
                            errorInvalidCnpj
                              ? "#91A7B8"
                              : "#205d8b"
                          }
                          colorScheme={"blue"}
                          variant={"solid"}
                          type="submit"
                          value="submit"
                        >
                          Cadastre-se
                        </Button>
                      </Stack>
                    </MotionFlex>
                  </Box>
                </form>
              </MotionFlex>
            )}
            {institution && (
              <MotionFlex
                variants={animationFlex}
                initial="hidden"
                animate="visible"
              >
                <form onSubmit={handleRegisterSubmit}>
                  <Box w="700px">
                    <Flex justifyContent={"center"} mb={6}>
                      <Box border={"solid 2px #205d8b"} borderRadius={"10px"}>
                        <Button
                          colorScheme="facebook"
                          variant={donor ? "solid" : "ghost"}
                          onClick={() => {
                            handlerUserType("donor");
                          }}
                        >
                          Doador
                        </Button>
                        <Button
                          colorScheme="facebook"
                          variant={partner ? "solid" : "ghost"}
                          onClick={() => {
                            handlerUserType("partner");
                          }}
                        >
                          Parceiro
                        </Button>
                        <Button
                          colorScheme="facebook"
                          variant={institution ? "solid" : "ghost"}
                          onClick={() => {
                            handlerUserType("institution");
                          }}
                        >
                          Instituição
                        </Button>
                      </Box>
                    </Flex>
                    <MotionFlex variants={itemAnimation}>
                      <FormControl
                        id="nome"
                        marginBottom="1.5rem"
                        spacing={4}
                        w={"full"}
                        maxW={"md"}
                      >
                        <FormLabel>Nome</FormLabel>
                        <InputGroup>
                          <InputLeftElement
                            height={"100%"}
                            pointerEvents="none"
                            children={<FaUser />}
                          />
                          <Input
                            size="lg"
                            borderRadius={"100px"}
                            placeholder="Nome"
                            focusBorderColor="#205d8b"
                            variant="filled"
                            type="text"
                            color={"black"}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            isRequired
                          />
                        </InputGroup>
                      </FormControl>
                      <Box width={"20px"} />
                      <FormControl id="razaoSocial" marginBottom="1.5rem">
                        <FormLabel>Razão Social</FormLabel>
                        <InputGroup>
                          <InputLeftElement
                            height={"100%"}
                            pointerEvents="none"
                            children={<FaUser />}
                          />
                          <Input
                            size="lg"
                            borderRadius={"100px"}
                            placeholder="Razão Social"
                            focusBorderColor="#205d8b"
                            variant="filled"
                            type="text"
                            color={"black"}
                            value={corporateReason}
                            onChange={(e) => setCorporateReason(e.target.value)}
                            isRequired
                          />
                        </InputGroup>
                      </FormControl>
                    </MotionFlex>
                    <MotionFlex variants={itemAnimation}>
                      <FormControl id="email" marginBottom="1.5rem">
                        <FormLabel>Email</FormLabel>
                        <InputGroup>
                          <InputLeftElement
                            height={"100%"}
                            pointerEvents="none"
                            children={<FaEnvelope />}
                          />
                          <Input
                            size="lg"
                            borderRadius={"100px"}
                            placeholder="Email"
                            focusBorderColor="#205d8b"
                            variant="filled"
                            type="email"
                            color={"black"}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            isRequired
                          />
                        </InputGroup>
                      </FormControl>
                      <Box width={"20px"} />
                      <FormControl
                        id="cnpj"
                        marginBottom="1.5rem"
                        width={"100%"}
                        isInvalid={errorInvalidCnpj}
                      >
                        <FormLabel>CNPJ</FormLabel>
                        <InputGroup>
                          <InputLeftElement
                            height={"100%"}
                            pointerEvents="none"
                            children={<FaIdCard />}
                          />
                          <Input
                            size="lg"
                            borderRadius={"100px"}
                            placeholder="CNPJ"
                            focusBorderColor="#205d8b"
                            variant="filled"
                            type="text"
                            color={"black"}
                            value={cnpjInput}
                            onChange={(e) =>
                              e.target.value.replace(/\D/g, "").length <= 14
                                ? setCnpjInput(e.target.value)
                                : ""
                            }
                            isRequired
                          />
                        </InputGroup>
                        <FormErrorMessage position={"absolute"}>
                          CNPJ digitado não é válido
                        </FormErrorMessage>
                      </FormControl>
                    </MotionFlex>
                    <MotionFlex variants={itemAnimation}>
                      <FormControl
                        id="password"
                        spacing={4}
                        w={"full"}
                        maxW={"md"}
                        isInvalid={errorInvalidPassword}
                      >
                        <FormLabel>Senha</FormLabel>
                        <InputGroup>
                          <InputLeftElement
                            height={"100%"}
                            pointerEvents="none"
                            children={<FaLock />}
                          />
                          <Input
                            size="lg"
                            borderRadius={"100px"}
                            placeholder="Senha"
                            focusBorderColor="#205d8b"
                            variant="filled"
                            type="password"
                            color={"black"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            isRequired
                          />
                        </InputGroup>
                        <FormErrorMessage
                          position={"absolute"}
                          lineHeight={1}
                          fontSize={"11px"}
                        >
                          Requisitos: no mínimo uma letra maiúscula, um número e
                          8 dígitos.
                        </FormErrorMessage>
                      </FormControl>
                      <Box width={"20px"} />
                      <FormControl
                        id="passwordConfirm"
                        marginBottom="1.5rem"
                        isInvalid={errorWrongPassword}
                      >
                        <FormLabel>Confirme nova senha</FormLabel>
                        <InputGroup>
                          <InputLeftElement
                            height={"100%"}
                            pointerEvents="none"
                            children={<FaLock />}
                          />
                          <Input
                            size="lg"
                            borderRadius={"100px"}
                            placeholder="Senha"
                            focusBorderColor="#205d8b"
                            variant="filled"
                            type="password"
                            color={"black"}
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            isRequired
                          />
                        </InputGroup>
                        <FormErrorMessage position={"absolute"}>
                          As senhas não coincidem
                        </FormErrorMessage>
                      </FormControl>
                    </MotionFlex>
                    <MotionFlex variants={itemAnimation}>
                      <FormControl
                        id="phone"
                        marginBottom="1.5rem"
                        isInvalid={!!errorInvalidPhone}
                      >
                        <FormLabel>Telefone</FormLabel>
                        <InputGroup>
                          <InputLeftElement
                            height={"100%"}
                            pointerEvents="none"
                            children={<BsTelephoneFill />}
                          />
                          <Input
                            isRequired
                            size="lg"
                            borderRadius={"100px"}
                            focusBorderColor="#205d8b"
                            variant="filled"
                            color={"black"}
                            type="tel"
                            placeholder="Número de telefone"
                            value={phone}
                            onChange={handlePhoneChange}
                          />
                        </InputGroup>
                        <FormErrorMessage position={"absolute"}>
                          {errorInvalidPhone}
                        </FormErrorMessage>
                      </FormControl>
                      <Box width={"20px"} />
                      <FormControl id="pix" marginBottom="1.5rem">
                        <FormLabel>Chave PIX</FormLabel>
                        <InputGroup>
                          <InputLeftElement
                            height={"100%"}
                            pointerEvents="none"
                            children={<MdPayment />}
                          />
                          <Input
                            isRequired
                            size="lg"
                            borderRadius={"100px"}
                            focusBorderColor="#205d8b"
                            variant="filled"
                            color={"black"}
                            type="tel"
                            placeholder="PIX"
                            value={pix}
                            onChange={(e) => setPix(e.target.value)}
                          />
                        </InputGroup>
                      </FormControl>
                    </MotionFlex>
                    <MotionFlex variants={itemAnimation}>
                      <FormControl
                        id="street"
                        marginBottom="1.5rem"
                        width={"100%"}
                      >
                        <FormLabel>Rua</FormLabel>
                        <Input
                          size="lg"
                          borderRadius={"100px"}
                          placeholder="Rua"
                          focusBorderColor="#205d8b"
                          variant="filled"
                          type="text"
                          color={"black"}
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          isRequired
                        />
                      </FormControl>
                      <Box width={"20px"} />
                      <FormControl w="80px" id="number" marginBottom="1.5rem">
                        <FormLabel>Número</FormLabel>
                        <Input
                          isRequired
                          size="lg"
                          placeholder="N°"
                          borderRadius={"100px"}
                          focusBorderColor="#205d8b"
                          variant="filled"
                          color={"black"}
                          type="tel"
                          value={number}
                          onChange={(e) =>
                            setNumber(e.target.value.replace(/\D/g, ""))
                          }
                        />
                      </FormControl>
                      <Box width={"20px"} />
                      <FormControl id="complement" marginBottom="1.5rem">
                        <FormLabel>Complemento</FormLabel>
                        <Input
                          size="lg"
                          borderRadius={"100px"}
                          focusBorderColor="#205d8b"
                          variant="filled"
                          color={"black"}
                          type="tel"
                          placeholder="Complemento"
                          value={complement}
                          onChange={(e) => setComplement(e.target.value)}
                        />
                      </FormControl>
                    </MotionFlex>
                    <MotionFlex variants={itemAnimation}>
                      <FormControl id="city" marginBottom="1.5rem">
                        <FormLabel>Cidade</FormLabel>
                        <Input
                          isRequired
                          size="lg"
                          borderRadius={"100px"}
                          focusBorderColor="#205d8b"
                          variant="filled"
                          color={"black"}
                          type="tel"
                          placeholder="Cidade"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </FormControl>
                      <Box width={"20px"} />
                      <FormControl id="state" marginBottom="1.5rem">
                        <FormLabel>Estado</FormLabel>
                        <Input
                          isRequired
                          size="lg"
                          borderRadius={"100px"}
                          focusBorderColor="#205d8b"
                          variant="filled"
                          color={"black"}
                          type="tel"
                          placeholder="Estado"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                        />
                      </FormControl>
                    </MotionFlex>
                    <MotionFlex variants={itemAnimation}>
                      <FormControl id="social_media" marginBottom="1.5rem">
                        <FormLabel>Link da sua principal rede social</FormLabel>
                        <InputGroup>
                          <InputLeftElement
                            height={"100%"}
                            pointerEvents="none"
                            children={<FaLink />}
                          />
                          <Input
                            isRequired
                            size="lg"
                            borderRadius={"100px"}
                            focusBorderColor="#205d8b"
                            variant="filled"
                            color={"black"}
                            type="text"
                            placeholder="Link"
                            value={socialMedia}
                            onChange={(e) => setSocialMedia(e.target.value)}
                          />
                        </InputGroup>
                      </FormControl>
                    </MotionFlex>
                    <MotionFlex
                      variants={itemAnimation}
                      display={"block"}
                      m={"0 auto"}
                    >
                      <Stack spacing={6}>
                        <Button
                          isDisabled={
                            errorWrongPassword ||
                            errorInvalidPassword ||
                            !!errorInvalidPhone ||
                            errorInvalidCnpj
                          }
                          size="lg"
                          borderRadius={"100px"}
                          my={"4"}
                          backgroundColor={
                            errorWrongPassword ||
                            errorInvalidPassword ||
                            !!errorInvalidPhone ||
                            errorInvalidCnpj
                              ? "#91A7B8"
                              : "#205d8b"
                          }
                          colorScheme={"blue"}
                          variant={"solid"}
                          type="submit"
                          value="submit"
                        >
                          Cadastre-se
                        </Button>
                      </Stack>
                    </MotionFlex>
                  </Box>
                </form>
              </MotionFlex>
            )}
          </Stack>
        </MotionFlex>

        <MotionFlex
          h={"100vh"}
          variants={animationFlex}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          flex={1}
          align={"center"}
          justify={"center"}
        >
          <Image
            // px={["20%", "20%", "5%"]}
            alt={"Login Image"}
            objectFit={"cover"}
            src={logoLogin}
          />
        </MotionFlex>
      </Stack>
    </Box>
  );
}
