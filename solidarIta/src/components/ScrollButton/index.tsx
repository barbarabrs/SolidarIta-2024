import {  IconButton, useColorModeValue } from '@chakra-ui/react';
import React, { useState } from 'react';
import { FiChevronUp } from 'react-icons/fi';

const ScrollButton = () => {

  const [visible, setVisible] = useState(false)

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
  
    if (scrolled > 80) {
      setVisible(true)
    }
    else if (scrolled <= 80) {
      setVisible(false)
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
      /* you can also use 'auto' behaviour
         in place of 'smooth' */
    });
  };

  window.addEventListener('scroll', toggleVisible);

  return (
    <>
      <IconButton 
      position='fixed'
      right='20px'
      bottom='20px'
      border='1px solid'
      background={useColorModeValue('gray.200', 'gray.900')}
      style={{ display: visible ? 'inline-flex' : 'none' }}
      aria-label='scroll top' 
      icon={<FiChevronUp
        onClick={scrollToTop}
      size='2rem'/>} />
    </>
  );
}

export default ScrollButton;