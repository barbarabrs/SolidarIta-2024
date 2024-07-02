import React, { useContext } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useState, FormEvent } from "react";
import logoLogin from "../../assets/images/logo-login.png";
import {
  Button,
  FormControl,
  Heading,
  Input,
  Stack,
  Image,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  Box,
  useColorMode,
  Flex,
  Text,
} from "@chakra-ui/react";
import { AuthContext } from "../../contexts/AuthContext";

import {
  MotionFlex,
  animationFlex,
  itemAnimation,
} from "../../components/Styles/motion-animate/animate";
import { FiMoon, FiSun } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Login() {
  //SETANDO LOGINS CORRETOS AUTOMATICO, RETIRAR DEPOIS
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { signIn, signInAnonymous } = useContext(AuthContext);
  const { colorMode, toggleColorMode } = useColorMode();

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    localStorage.removeItem("groceryListName");
    localStorage.removeItem("groceryListDescription");
    localStorage.removeItem("groceryListGoal");
    localStorage.removeItem("groceryListImage");
    signIn({ email, password });
  };

  return (
    <Box bg={useColorModeValue("white", "gray.800")}>
      <Stack
        minH={"100vh"}
        maxWidth={"1280px"}
        margin="0 auto"
        direction={{ base: "column", md: "row" }}
      >
        <MotionFlex
          variants={animationFlex}
          initial="hidden"
          animate="visible"
          p={8}
          flex={1}
          justify={"center"}
        >
          <Stack spacing={4} w={"full"} maxW={"md"}>
            <Flex justifyContent={"space-between"}>
              <Button onClick={() => navigate("/register")} marginTop={"10px"}>
                Cadastre-se
              </Button>
              <Button onClick={toggleColorMode} marginTop={"10px"}>
                {colorMode === "light" ? <FiMoon /> : <FiSun />}
              </Button>
            </Flex>
            <Flex flex={1} align={"center"}>
              <form onSubmit={handleLoginSubmit}>
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
                <Text mb={"8"} textAlign={"center"}>
                  Faça a diferença na sua comunidade: doe, compartilhe,
                  transforme vidas!
                </Text>
                <MotionFlex variants={itemAnimation}>
                  <FormControl id="email" marginBottom="1.5rem">
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
                  <FormControl id="password">
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
                  </FormControl>
                </MotionFlex>
                <MotionFlex
                  variants={itemAnimation}
                  display={"block"}
                  m={"0 auto"}
                >
                  <Stack spacing={6}>
                    <Button
                      size="lg"
                      borderRadius={"100px"}
                      mt={"10"}
                      backgroundColor={"#205d8b"}
                      colorScheme={"blue"}
                      variant={"solid"}
                      type="submit"
                      value="submit"
                    >
                      Entrar
                    </Button>
                  </Stack>
                  <Stack spacing={6}>
                    <Button
                      size="md"
                      borderRadius={"100px"}
                      mt={"10"}
                      variant={"solid"}
                      onClick={signInAnonymous}
                    >
                      Acesso anônimo
                    </Button>
                  </Stack>
                </MotionFlex>
              </form>
            </Flex>
          </Stack>
        </MotionFlex>
        <MotionFlex
          height={"100vh"}
          flex={1}
          align={"center"}
          justify={"center"}
        >
          <MotionFlex
            variants={animationFlex}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            flex={1}
            align={"center"}
            justify={"center"}
          >
            <Image
              px={["20%", "20%", "5%"]}
              alt={"Login Image"}
              objectFit={"cover"}
              src={logoLogin}
            />
          </MotionFlex>
        </MotionFlex>
      </Stack>
    </Box>
  );
}
