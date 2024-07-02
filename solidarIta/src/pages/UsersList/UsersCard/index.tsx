import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Image,
  Tag,
  Text,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CgExternal } from "react-icons/cg";
import { AuthContext } from "../../../contexts/AuthContext";
import { parseCookies } from "nookies";

interface UsersCardProps {
  username: string;
  social_reason: string;
  id: number;
  image: string;
  status: string;
  social_media: string;
  type: number;
}

export function UsersCard(props: UsersCardProps) {
  const cookies = parseCookies();
  const user_id = cookies["id"];
  const { rolesUser } = useContext(AuthContext);
  const { username, social_reason, id, image, status, social_media, type } =
    props;
  const navigate = useNavigate();

  function handlerNavigate(type: number) {
    switch (type) {
      case 1:
        return navigate(`/user/activities/${id}`);
        break;
      case 2:
        return navigate(`/feed/institution/${id}`);
        break;
      case 3:
        return navigate(`/feed/partner/${id}`);
        break;
      default:
        break;
    }
  }

  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
    >
      <Image
        width={"100%"}
        height={type === 1 ? "150px" : "200px"}
        objectFit="cover"
        src={image && image !== "" ? image : 'https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg'}
        alt={username}
      />
      <Flex
        flexDirection="column"
        justifyContent={"space-between"}
        p="6"
        height={type === 1 ? "calc(100% - 150px)" : "calc(100% - 200px)"}
      >
        <Box>
          <Heading as="h2" size="lg" mb="2">
            {username}
          </Heading>
          <Text fontSize="md" color="gray.600" mb="4">
            {social_reason}
          </Text>
          <Text fontSize="md" color="gray.600" mb="4">
            {status}
          </Text>
        </Box>
        {id === parseInt(user_id) ? (
          <Button
            minH={"40px"}
            height={"auto"}
            colorScheme="facebook"
            mr="2"
            onClick={() => {
              navigate(`/profile`);
            }}
          >
            Ver perfil
          </Button>
        ) : (
          <>
            {rolesUser.includes("usersDetail") ? (
              <Flex justifyContent={"space-between"}>
                <Button
                  minH={"40px"}
                  height={"auto"}
                  colorScheme="facebook"
                  mr="2"
                  onClick={() => {
                    navigate(`/user/detail/${id}`);
                  }}
                >
                  Ver perfil
                </Button>
                {type === 3 ? (
                  <Button
                    height={"auto"}
                    colorScheme="facebook"
                    mr="2"
                    onClick={() => {
                      navigate(`/products/${id}`);
                    }}
                  >
                    Produtos
                  </Button>
                ) : (
                  <></>
                )}

                <Button
                  colorScheme="facebook"
                  onClick={() => {
                    handlerNavigate(type);
                  }}
                  p="5px"
                  height={"auto"}
                >
                  <Text style={{ whiteSpace: "normal" }}>
                    {type === 1 ? "Ver Atividades" : "Ver campanhas"}{" "}
                  </Text>
                </Button>
              </Flex>
            ) : (
              <>
                {type === 2 || type === 3 ? (
                  <Flex justifyContent={"space-between"}>
                    {type === 3 ? (
                      <Button
                        height={"auto"}
                        colorScheme="facebook"
                        mr="2"
                        onClick={() => {
                          navigate(`/products/${id}`);
                        }}
                      >
                        Produtos
                      </Button>
                    ) : (
                      <></>
                    )}
                    <Button
                      height={"auto"}
                      p="5px"
                      style={{ whiteSpace: "normal" }}
                      colorScheme="facebook"
                      mr="2"
                      onClick={() => {
                        handlerNavigate(type);
                      }}
                    >
                      Ver campanhas
                    </Button>

                    {social_media ? (
                      <Button
                        colorScheme="facebook"
                        p="5px"
                        height={"auto"}
                        style={{ whiteSpace: "normal" }}
                      >
                        <a
                          style={{
                            marginRight: "5px",
                          }}
                          href={social_media}
                          target="_blank"
                        >
                          Saiba mais
                        </a>
                        <CgExternal fontSize={"35px"} />
                      </Button>
                    ) : (
                      <></>
                    )}
                  </Flex>
                ) : (
                  <></>
                )}
              </>
            )}
          </>
        )}
      </Flex>
    </Box>
  );
}
