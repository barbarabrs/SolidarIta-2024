import {
  Flex,
  Icon,
  Link,
  FlexProps,
  Text
} from "@chakra-ui/react";

import { IconType } from "react-icons";
import { Link as ReachLink } from "react-router-dom"
import { motion } from "framer-motion";

export const MotionFlex = motion<FlexProps>(Flex)

interface NavItemProps extends FlexProps {
  icon: IconType;
  route: string;
  name: string;
}
const NavItem = ({ icon, name, route }: NavItemProps) => {
  return (
    <Link as={ReachLink} to={route} style={{ textDecoration: "none" }} >
      <MotionFlex
        // boxShadow='rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;'
        borderBottom='1px solid #CBD5E0'
        borderRight='1px solid #CBD5E0'
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        align="center"
        px="3"
        pb="4"
        pt="3.5"
        mx="3"
        my="2"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          px:"1",
          mx:"4",
          bg: "blue.400",
          color: "white",
        }}

      >
        {icon && (
          <Icon
            fontWeight={'bold'}
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        <Text fontSize={'14px'} fontWeight={'bold'} textTransform={'uppercase'}>{name}</Text>
      </MotionFlex>
    </Link>
  );
};

export default NavItem;