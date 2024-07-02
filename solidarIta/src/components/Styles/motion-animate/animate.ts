import { Box, BoxProps, Flex, FlexProps } from '@chakra-ui/react';
import { motion } from "framer-motion";

export const animationFlex = {
  hidden: { opacity: 0, scale: 1 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.4,
      staggerChildren: 0.2
    }
  }
}

export const itemAnimation = {
  hidden: { y: -60 , opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
}

// Frame-motion container
export const container = {
  hidden: { opacity: 0 },
  show: {
    rotate: 360,
    opacity: 1,
    transition: {
      delayChildren: 0.5,
      type: "spring",
      duration: 5,
      bounce: 0.6
    }
  }
}


export const MotionFlex = motion<FlexProps>(Flex);

export const MotionBox = motion<BoxProps>(Box);


