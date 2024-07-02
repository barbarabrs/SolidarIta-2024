import React, { ReactNode } from "react";
import {
  useColorModeValue,
  Drawer,
  DrawerContent,
  useDisclosure,
  DrawerOverlay,
} from "@chakra-ui/react";
import MobileNav from "./HeaderNav/index";
import SidebarContent from "./SidebarContent/index";

import {  animationFlex, MotionBox } from '../../components/Styles/motion-animate/animate';
import ScrollButton from "../ScrollButton";

export default function SidebarWithHeader({
  children,
}: {
  children: ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <MotionBox
        variants={animationFlex}
        initial="hidden"
        animate="visible"
        minH="100vh"
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("#205d8b", "white")}
      >
        <SidebarContent
          onClose={() => onClose}
          display={{ base: "none", lg: "block" }}
          boxShadow='rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px'
        />
        <Drawer
          autoFocus={false}
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size="xs"
          >
          <DrawerOverlay />
          <DrawerContent>
            <SidebarContent onClose={onClose} />
          </DrawerContent>
        </Drawer>
        {/* mobilenav */}
        <MobileNav onOpen={onOpen} />
        <MotionBox
          ml={{ base: 0, lg: 60 }}
          p="4"
          
        >
          {children}
        </MotionBox>
        <ScrollButton />
      </MotionBox>
    </>
  );
}
