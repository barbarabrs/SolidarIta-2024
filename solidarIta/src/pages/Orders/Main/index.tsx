import {
  Box,
  Button,
  Divider,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Skeleton,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { parseCookies } from "nookies";
import React, { useContext, useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import {
  itemAnimation,
  MotionBox,
} from "../../../components/Styles/motion-animate/animate";
import { GroceryList } from "../../../contexts/GroceryListContext";
import { ProductListContext } from "../../../contexts/ProductListContext";
import api from "../../../services/api";
import FilterModal from "../Modal/Filter";
import { OrdersCard } from "../Modal/OrdersCard";

interface Account {
  id: number;
  mail: string;
  account_id: string;
  type: string;
  reason: string;
  reasonC?: string;
}

const MainOrders: React.FC = (): React.ReactElement => {
  // const { isLoading, setIsLoading } = useContext(ProductListContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [baseAccount, setBaseAccount] = useState<Account[]>([]);
  const [groceryList, setGroceryList] = useState<GroceryList[]>([]);
  const [status, setStatus] = useState<number>(0);
  const [page, setPage] = useState(1);
  const cookies = parseCookies();

  useEffect(() => {
    console.log(groceryList);
  }, [groceryList]);

  useEffect(() => {
    setIsLoading(false);
    const id = cookies["id"];

    api
      .post("/groceryList", { id, from: "partner", status })
      .then((response) => {
        setGroceryList(response.data);
        setIsLoading(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [status]);

  return (
    <Tabs onChange={(index) => setStatus(index)}>
      <TabList>
        <Tab>Solicitações pendente</Tab>
        <Tab>Pedidos em andamento</Tab>
        <Tab>Pedidos esperando entrega</Tab>
        <Tab>Pedidos finalizados</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <Box w="100%">
            {isLoading && groceryList.length > 0 ? (
              <MotionBox variants={itemAnimation} margin="0 auto">
                <Box mx={"auto"} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
                  <SimpleGrid
                    columns={1}
                    spacing={{ base: 5 }}
                    minChildWidth="300px"
                  >
                    {groceryList.map((item) => (
                      <OrdersCard
                        title={item.name}
                        status={item.status}
                        username={item.username ?? ""}
                        id={item.id}
                        date={item.date}
                        image={item.image}
                      />
                    ))}
                  </SimpleGrid>
                </Box>
              </MotionBox>
            ) : isLoading && groceryList ? (
              <Text textAlign={"center"}>Não há resultados</Text>
            ) : (
              <SimpleGrid columns={4} spacing={10}>
                <Skeleton height="200px" />
                <Skeleton height="200px" />
                <Skeleton height="200px" />
                <Skeleton height="200px" />
                <Skeleton height="200px" />
                <Skeleton height="200px" />
                <Skeleton height="200px" />
                <Skeleton height="200px" />
              </SimpleGrid>
            )}
          </Box>
        </TabPanel>
        <TabPanel>
          <Box w="100%">
            {isLoading && groceryList.length > 0 ? (
              <MotionBox variants={itemAnimation} margin="0 auto">
                <Box mx={"auto"} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
                  <SimpleGrid
                    columns={1}
                    spacing={{ base: 5 }}
                    minChildWidth="300px"
                  >
                    {groceryList.map((item) => (
                      <OrdersCard
                        title={item.name}
                        status={item.status}
                        username={item.username ?? ""}
                        id={item.id}
                        date={item.date}
                        image={item.image}
                      />
                    ))}
                  </SimpleGrid>
                </Box>
              </MotionBox>
            ) : isLoading && groceryList ? (
              <Text textAlign={"center"}>Não há resultados</Text>
            ) : (
              <SimpleGrid columns={4} spacing={10}>
                <Skeleton height="200px" />
                <Skeleton height="200px" />
                <Skeleton height="200px" />
                <Skeleton height="200px" />
                <Skeleton height="200px" />
                <Skeleton height="200px" />
                <Skeleton height="200px" />
                <Skeleton height="200px" />
              </SimpleGrid>
            )}
          </Box>
        </TabPanel>
        <TabPanel>
          <Box w="100%">
            {isLoading && groceryList.length > 0 ? (
              <MotionBox variants={itemAnimation} margin="0 auto">
                <Box mx={"auto"} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
                  <SimpleGrid
                    columns={1}
                    spacing={{ base: 5 }}
                    minChildWidth="300px"
                  >
                    {groceryList.map((item) => (
                      <OrdersCard
                        title={item.name}
                        status={item.status}
                        username={item.username ?? ""}
                        id={item.id}
                        date={item.date}
                        image={item.image}
                      />
                    ))}
                  </SimpleGrid>
                </Box>
              </MotionBox>
            ) : isLoading && groceryList ? (
              <Text textAlign={"center"}>Não há resultados</Text>
            ) : (
              <SimpleGrid columns={4} spacing={10}>
                <Skeleton height="200px" />
                <Skeleton height="200px" />
                <Skeleton height="200px" />
                <Skeleton height="200px" />
                <Skeleton height="200px" />
                <Skeleton height="200px" />
                <Skeleton height="200px" />
                <Skeleton height="200px" />
              </SimpleGrid>
            )}
          </Box>
        </TabPanel>
        <TabPanel>
          <Box w="100%">
            {isLoading && groceryList.length > 0 ? (
              <MotionBox variants={itemAnimation} margin="0 auto">
                <Box mx={"auto"} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
                  <SimpleGrid
                    columns={1}
                    spacing={{ base: 5 }}
                    minChildWidth="300px"
                  >
                    {groceryList.map((item) => (
                      <OrdersCard
                        title={item.name}
                        status={item.status}
                        username={item.username ?? ""}
                        id={item.id}
                        date={item.date}
                        image={item.image}
                      />
                    ))}
                  </SimpleGrid>
                </Box>
              </MotionBox>
            ) : isLoading && groceryList ? (
              <Text textAlign={"center"}>Não há resultados</Text>
            ) : (
              <SimpleGrid columns={4} spacing={10}>
                <Skeleton height="200px" />
                <Skeleton height="200px" />
                <Skeleton height="200px" />
                <Skeleton height="200px" />
                <Skeleton height="200px" />
                <Skeleton height="200px" />
                <Skeleton height="200px" />
                <Skeleton height="200px" />
              </SimpleGrid>
            )}
          </Box>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default MainOrders;
function useCookies() {
  throw new Error("Function not implemented.");
}
