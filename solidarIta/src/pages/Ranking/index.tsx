import React, { useState } from "react";
import {
  Box,
  Text,
  Flex,
  Avatar,
  Badge,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Tooltip,
  Icon,
  Heading,
} from "@chakra-ui/react";
import { FiInfo } from "react-icons/fi";
import {
  itemAnimation,
  MotionBox,
} from "../../components/Styles/motion-animate/animate";
import TitlePage from "../../components/TitlePage";
import { FaCrown } from "react-icons/fa";

interface Action {
  type: string;
  company: string;
  date: string;
}

interface User {
  id: number;
  name: string;
  points: number;
  actions: Action[];
}

const users: User[] = [
  {
    id: 1,
    name: "John Doe",
    points: 100,
    actions: [
      { type: "Donation", company: "Anjo", date: "2024-02-29" },
      { type: "Volunteer", company: "Santana", date: "2024-02-28" },
    ],
  },
  {
    id: 1,
    name: "John Doe",
    points: 100,
    actions: [
      { type: "Donation", company: "Anjo", date: "2024-02-29" },
      { type: "Volunteer", company: "Santana", date: "2024-02-28" },
    ],
  },
  {
    id: 1,
    name: "John Doe",
    points: 100,
    actions: [
      { type: "Donation", company: "Anjo", date: "2024-02-29" },
      { type: "Volunteer", company: "Santana", date: "2024-02-28" },
    ],
  },
  {
    id: 1,
    name: "John Doe",
    points: 100,
    actions: [
      { type: "Donation", company: "Anjo", date: "2024-02-29" },
      { type: "Volunteer", company: "Santana", date: "2024-02-28" },
    ],
  },
  {
    id: 1,
    name: "John Doe",
    points: 100,
    actions: [
      { type: "Donation", company: "Anjo", date: "2024-02-29" },
      { type: "Volunteer", company: "Santana", date: "2024-02-28" },
    ],
  },
  // Add more users as needed
];

const UserRanking: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);

  const handleUserClick = (user: User) => {
    if (selectedUser === user && isPanelOpen) {
      setSelectedUser(user);
      setIsPanelOpen(false);
    } else {
      setSelectedUser(user);
      setIsPanelOpen(true);
    }
  };

  return (
    <>
      <MotionBox variants={itemAnimation} margin="0 auto" padding={"2rem"}>
        <Box>
          <Heading mb={3}>Raking da Soledariedade</Heading>
          <Text fontSize={"12px"}>
            Quanto mais ações você participa, mais pontos você ganha!
          </Text>
        </Box>
        <Divider borderColor="100" mb="1rem" />
        <Flex alignItems={"center"}>
          <Flex
            flexDirection={"initial"}
            position="relative"
            mr={"5px"}
            fontSize={"20px"}
          >
            <Box as="span" position="relative" zIndex="1">
              Destacando aqueles que consistentemente contribuem para a
              comunidade!
            </Box>
            <Box
              as="span"
              position="absolute"
              top="0"
              left="0"
              right="0%"
              bottom="0"
              bgGradient="linear(to-r, yellow.50, yellow.300)"
              zIndex="0"
              pointerEvents="none"
              animation="highlight 2s linear infinite"
              _hover={{ animationPlayState: "paused" }}
            />
          </Flex>
        </Flex>
        <Flex direction="column" alignItems="flex-start" p={4} w="100%">
          {users.map((user, index) => (
            <>
              <MotionBox width={"100%"} variants={itemAnimation}>
                <Box
                  key={user.id}
                  onClick={() => handleUserClick(user)}
                  cursor="pointer"
                  w="100%"
                >
                  <Flex align="center" justify="space-between" w="100%">
                    <Flex align="center">
                      <Box>
                        <Box
                          marginRight={"20px"}
                          fontWeight={"bold"}
                          fontSize={"18px"}
                          borderWidth="2px"
                          borderStyle="solid"
                          borderRadius="md"
                          padding="0.25rem 0.5rem"
                          display="inline-block"
                          borderColor={index < 3 ? "yellow.500" : "blue.500"}
                          color={index < 3 ? "yellow.500" : "blue.500"}
                          backgroundColor="white"
                        >
                          {index + 1}
                        </Box>
                      </Box>
                      <div
                        style={{
                          position: "relative",
                          display: "inline-block",
                        }}
                      >
                        <Avatar name={user.name} />
                        {index < 3 ? (
                          <Icon
                            as={FaCrown}
                            position="absolute"
                            top="0"
                            left="0"
                            transform="translate(-50%)"
                            backgroundColor="yellow.500"
                            color="white"
                            borderRadius="50%"
                            padding="2px"
                          />
                        ) : (
                          ""
                        )}
                      </div>
                      <Text ml={4}>{user.name}</Text>
                    </Flex>
                    <Badge colorScheme="green">{user.points} points</Badge>
                  </Flex>
                  <Divider my={2} />
                </Box>
              </MotionBox>

              {selectedUser === user && isPanelOpen && (
                <Accordion
                  allowToggle
                  w="100%"
                  defaultIndex={isPanelOpen ? [0] : []}
                >
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Divider
                          borderColor="grey.500"
                          orientation="vertical"
                          borderWidth="2px"
                          height={"30px"}
                          mr={"5px"}
                        />
                        <Box flex="1" textAlign="left">
                          <Text> Ações mais recentes</Text>
                        </Box>

                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      {selectedUser.actions.map((action, index) => (
                        <Flex
                          justifyContent={"space-between"}
                          key={index}
                          p={2}
                        >
                          <Text>
                            {action.type} para {action.company}
                          </Text>
                          <Text>{action.date}</Text>
                        </Flex>
                      ))}
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              )}
            </>
          ))}
        </Flex>
      </MotionBox>
    </>
  );
};

export default UserRanking;
