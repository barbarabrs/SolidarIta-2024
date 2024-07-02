import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  Image,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Editor } from "@tinymce/tinymce-react";
import { parseCookies } from "nookies";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  itemAnimation,
  MotionBox,
} from "../../../../components/Styles/motion-animate/animate";
import TitlePage from "../../../../components/TitlePage";
import { GroceryList } from "../../../../contexts/GroceryListContext";
import api from "../../../../services/api";

export function GroceryListAccountability() {
  const { groceryListId } = useParams();
  const [groceryList, setGroceryList] = useState<GroceryList[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();
  const cookies = parseCookies();
  const navigate = useNavigate();
  const [editionGet, setEditionGet] = useState("");
  const [contentPost, setContentPost] = useState("");

  const handleEditorChange = (content: string) => {
    setEditionGet(content);
  };

  useEffect(() => {
    const id = cookies["id"];
    setIsLoading(false);
    api
      .post("/groceryList/getOne", { id: groceryListId, owner: id })
      .then((response) => {
        if (response.data.length === 0) {
          navigate("/*");
        }
        console.log(response);
        setGroceryList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    setIsLoading(true);
  }, []);

  useEffect(() => {
    console.log(groceryList);
    if (groceryList.length > 0) {
      if (groceryList[0] && groceryList[0].status !== "Finalizado") {
        navigate("/*");
      }
    }
  }, [groceryList]);

  const handlerAccountabilily = () => {
    api
      .post("accountability/add", {
        message: editionGet,
        grocery_list_id: groceryListId,
      })
      .then((response: { data: any }) => {
        toast({
          title: "Prestação de conta finalizado",
          description: "Prestação de conta feita com sucesso",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        navigate("/groceryList/all");
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Erro ao prestar conta",
          description: "Revise as informações e tente novamente",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      });
  };

  return (
    <>
      <MotionBox variants={itemAnimation} margin="0 auto" padding={"2rem"}>
        <TitlePage title={"Prestação de conta"} />
        {isLoading && groceryList.length > 0 ? (
          <Box>
            <Grid
              my={5}
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
                    groceryList[0].image !== ""
                      ? groceryList[0].image
                      : 'https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg'
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
                    {groceryList[0].username}
                  </Button>
                  <Button
                    onClick={() => {
                      navigate("/partners/all");
                    }}
                    cursor={"pointer"}
                    display={"block"}
                    color={"green"}
                    borderColor="200"
                    border="1px solid"
                    borderRadius={"6px"}
                    p={"0px 6px"}
                    w="fit-content"
                  >
                    <Text>{groceryList[0].partner}</Text>
                    <Text
                      fontSize={"10px"}
                      color="black"
                      textAlign={"center"}
                      fontWeight={"800"}
                    >
                      Parceiro
                    </Text>
                  </Button>
                </Flex>
                <Box>
                  <Text fontSize="20px" fontWeight={"bold"}>
                    {groceryList[0].name}
                  </Text>
                </Box>
              </GridItem>
              <GridItem colSpan={15}>
                <Text>{groceryList[0].description}</Text>
              </GridItem>
              <GridItem colSpan={15}>
                <Text>{groceryList[0].goal}</Text>
              </GridItem>
            </Grid>
            <Text fontWeight={"bold"} fontSize={"20px"}>
              Impacto da campanha
            </Text>
            <Text fontSize={"12px"} color="grey">
              Utilize este espaço para declarar como a contribuição das pessoas
              nesta campanha teve impacto para a instituição.
            </Text>
            <Divider mb="2" />
            <Editor
              apiKey={"mwl80krfecqnvuxlwj11bw31f0fg10stbn8xje2byj3frfhw"}
              initialValue={contentPost}
              init={{
                zIndex: "100000000000000000000000",
                skin: "snow",
                icons: "thin",
                placeholder: "Prestação de conta...",
                height: "65vh",
                resize: false,
                menubar: true,
                plugins: [
                  "advlist autolink lists link image charmap print preview anchor",
                  "searchreplace visualblocks code fullscreen textcolor ",
                  "insertdatetime media table paste code help wordcount",
                ],
                textcolor_rows: "4",
                toolbar:
                  "undo redo | styleselect | fontsizeselect | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | code | preview ",
              }}
              onEditorChange={handleEditorChange}
              outputFormat="html"
              id="editorStyle"
            />
            <Flex justifyContent={"end"} mt="5">
              <Button
                colorScheme={"facebook"}
                size="md"
                onClick={handlerAccountabilily}
              >
                Salvar
              </Button>
            </Flex>
          </Box>
        ) : (
          <></>
        )}
      </MotionBox>
    </>
  );
}
