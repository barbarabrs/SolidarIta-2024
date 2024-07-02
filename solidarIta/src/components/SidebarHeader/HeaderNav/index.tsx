import React, { useContext, useEffect } from "react";
import logo from "../../../assets/images/logo.png";
import {
  IconButton,
  Box,
  Flex,
  HStack,
  VStack,
  Image,
  useColorModeValue,
  Text,
  useColorMode,
  FlexProps,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Button,
  MenuDivider,
  Avatar,
} from "@chakra-ui/react";
import { FiMenu, FiChevronDown, FiSun, FiMoon } from "react-icons/fi";
import { AuthContext } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, signOut, rolesUser, imageUser, type } = useContext(AuthContext);
  const navigate = useNavigate();
  const storedData = localStorage.getItem("myData");

  useEffect(() => {
    // console.log(storedData)
    // console.log(localStorage.getItem('meuItem'));
    // console.log( localStorage.getItem('myData'))
  }, [localStorage.getItem("myData")]);

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
      case 4:
        return "Admin";
        break;
      default:
        break;
    }
  }

  function manageAccounts() {
    navigate("/users");
  }

  return (
    <Flex
      boxShadow="rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px"
      ml={{ base: 0, lg: 56 }}
      px={{ base: 4, lg: 4 }}
      height="50px"
      alignItems="center"
      bg={useColorModeValue("gray.100", "gray.900")}
      //borderBottomWidth="1px"
      //borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", lg: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", lg: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", lg: "none" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        <Image
          htmlWidth="150px"
          objectFit="cover"
          src={logo}
          alt="SolidarIta"
        />
      </Text>

      <HStack spacing={{ base: "0", lg: "6" }}>
        <Button onClick={toggleColorMode}>
          {colorMode === "light" ? <FiMoon /> : <FiSun />}
        </Button>

        {type !== "0" ? (
          <Flex alignItems={"center"}>
            <Menu>
              <MenuButton
                py={2}
                transition="all 0.3s"
                _focus={{ boxShadow: "none" }}
              >
                <HStack>
                  {parseInt(type) !== 4 && (
                    <Avatar
                      size={"sm"}
                      src={
                        imageUser && imageUser !== ""
                          ? imageUser
                          : 'https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg'
                      }
                    />
                  )}

                  <VStack
                    display={{ base: "none", lg: "flex" }}
                    alignItems="flex-start"
                    spacing="1px"
                    ml="2"
                  >
                    <Text fontSize="sm">{user ? user : "Usuário"}</Text>
                    <Text fontSize="xs" color="gray.600">
                      {handlerUserType(parseInt(type))}
                    </Text>
                  </VStack>
                  <Box display={{ base: "none", lg: "flex" }}>
                    <FiChevronDown />
                  </Box>
                </HStack>
              </MenuButton>
              <MenuList
                zIndex={"1000000"}
                bg={useColorModeValue("white", "gray.900")}
                borderColor={useColorModeValue("gray.200", "gray.700")}
              >
                {rolesUser.includes("profile") ? (
                  <MenuItem
                    onClick={() => {
                      navigate("/profile");
                    }}
                  >
                    Perfil
                  </MenuItem>
                ) : (
                  <></>
                )}
                <MenuItem onClick={signOut}>Sair</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        ) : (
          <Text onClick={signOut}>Sair</Text>
        )}
      </HStack>
    </Flex>
  );
};

export default MobileNav;
