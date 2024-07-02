import {
  Box,
  BoxProps,
  Button,
  CloseButton,
  Flex,
  HStack,
  Image,
  Menu,
  MenuButton,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useContext } from "react";
import { IconType } from "react-icons";
import {
  FaClipboardList,
  FaHistory,
  FaShoppingBasket,
  FaUsersCog,
} from "react-icons/fa";
import { FaHandsHelping } from "react-icons/fa";
import { CgOrganisation } from "react-icons/cg";
import { FiHome, FiSettings } from "react-icons/fi";
import { BiDonateHeart } from "react-icons/bi";
import { MdOutlineVolunteerActivism } from "react-icons/md";
import { GiTrophy } from "react-icons/gi";
import { IoIosDocument } from "react-icons/io";
import { VscOrganization } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import logoLogin from "../../../assets/images/logo-login.png";
import { AuthContext } from "../../../contexts/AuthContext";
import NavItem from "../NavItem";
import { parseCookies } from "nookies";

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

interface LinkItemProps {
  name: string;
  role: string;
  icon: IconType;
  route: string;
}

const LinkItems: Array<LinkItemProps> = [
  {
    name: "Meus produtos",
    role: "productList",
    icon: FaShoppingBasket,
    route: "/product/list",
  },
  {
    name: "Minhas listas de compras",
    role: "groceryList",
    icon: FaClipboardList,
    route: "/groceryList/all",
  },
  {
    name: "Minhas campanhas de doação",
    role: "donationCampaign",
    icon: BiDonateHeart,
    route: "/donationCampaign/all",
  },
  {
    name: "Minhas campanhas de voluntariado",
    role: "volunteerCampaign",
    icon: MdOutlineVolunteerActivism ,
    route: "/volunteerCampaign/all",
  },
  { name: "Pedidos", role: "orders", icon: FaClipboardList, route: "/orders" },
  {
    name: "Campanhas Interagidas",
    role: "historyUser",
    icon: FaHistory,
    route: "/history/campains",
  },
  {
    name: "Prestação de contas",
    role: "accountability",
    icon: IoIosDocument,
    route: "/accountability/campains",
  },
  {
    name: "Contas pendentes e excluídas",
    role: "verifyAccount",
    icon: FaUsersCog,
    route: "/accounts/verify",
  },
  {
    name: "Instituições",
    role: "usersList",
    icon: FaHandsHelping,
    route: "/institutions/all",
  },
  {
    name: "Parceiros",
    role: "usersList",
    icon: CgOrganisation,
    route: "/partners/all",
  },
  {
    name: "Doadores",
    role: "usersList",
    icon: VscOrganization,
    route: "/donors/all",
  },
  // {
  //   name: "ranking da solidariedade",
  //   role: "ranking",
  //   icon: GiTrophy,
  //   route: "/ranking",
  // },
];

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const cookies = parseCookies();
  const type = cookies["type"];
  const { user, signOut, rolesUser } = useContext(AuthContext);
  const navigate = useNavigate();
console.log(rolesUser)
  return (
    <Box
      bg={useColorModeValue("gray.100", "gray.900")}
      //borderRight="1px"
      //borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", lg: 56 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Image
          htmlWidth="80px"
          objectFit="cover"
          src={logoLogin}
          alt="SolidarIta"
          margin="0 auto"
        />
        <CloseButton display={{ base: "flex", lg: "none" }} onClick={onClose} />
      </Flex>
      <Box overflowY={"scroll"} height={"86vh"} pt={1}>
        <NavItem
          key={"feed"}
          icon={FiHome}
          route={"/feed"}
          name={type === '4' ? "Campanhas" : "feed"}
        ></NavItem>
        {LinkItems.filter((item) => rolesUser.includes(item.role)).map(
          (link) => (
            <NavItem
              key={link.name}
              icon={link.icon}
              route={link.route}
              name={link.name}
            ></NavItem>
          )
        )}
      </Box>
      <Box
        display={{ base: "flex", lg: "none" }}
        alignItems={"center"}
        mt={"20px"}
        ml={"20px"}
        maxWidth={"200px"}
        justifyContent={"space-between"}
      >
        <Menu>
          <MenuButton
            py={2}
            transition="all 0.3s"
            _focus={{ boxShadow: "none" }}
          >
            <HStack>
              <VStack alignItems="flex-start" spacing="1px" ml="2">
                <Text fontSize="sm">{user ? user : "Usuário"}</Text>
                <Text fontSize="xs" color="gray.600">
                  Admin
                </Text>
              </VStack>
            </HStack>
          </MenuButton>
          <Button colorScheme="blue" onClick={signOut}>
            Sair
          </Button>
        </Menu>
      </Box>
      {rolesUser.includes("profile") ? (
        <Box
          display={{ base: "flex", lg: "none" }}
          alignItems={"center"}
          mt={"20px"}
          ml={"20px"}
          maxWidth={"200px"}
        >
          <Button
            leftIcon={<FiSettings />}
            className="color_main"
            variant="solid"
            onClick={() => navigate("/users")}
          >
            Gerenciar Contas
          </Button>
        </Box>
      ) : (
        ""
      )}
    </Box>
  );
};

export default SidebarContent;
