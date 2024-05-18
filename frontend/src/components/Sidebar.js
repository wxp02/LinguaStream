import React from "react";
import {
  Avatar,
  Box,
  Button,
  Text,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Flex,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { RepeatClockIcon } from "@chakra-ui/icons";
import { MdExitToApp } from "react-icons/md";
import { motion} from "framer-motion";

export default function Sidebar({ isOpen, onClose }) {
  let navigate = useNavigate();

  const handleHistory = () => {
    navigate("/history");
  };

  const handleLogout = () => {
    navigate("/");
  };

  const returnHome = ()=>{
    navigate("/home");
  };

  const variants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity:1, x: 0}
  };

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader sx={{ fontSize: "24px" }} onClick = {returnHome} style={{ cursor: 'pointer' }}>LinguaStream</DrawerHeader>
        <DrawerBody>
          <List spacing={5}>
            <ListItem display="flex" alignItems="center">
              <Button onClick={handleHistory} variant="ghost">
                <motion.div 
                  initial = "hidden"
                  animate = "visible"
                  variants = {variants}
                  transition={{delay: 0.2, duration: 0.5}}
                >
                  <Flex alignItems="center">  {/* Ensures icon and text are on the same line and centered vertically */}
                    <ListIcon as={RepeatClockIcon} color="gray.500" />
                    <Text fontWeight="normal" ml="2">History</Text>  {/* Added margin left for spacing */}
                  </Flex>
                </motion.div>
                
              </Button>
            </ListItem>
            <ListItem display="flex" alignItems="center">
              <Button onClick={handleLogout} variant="ghost">
                <motion.div 
                  initial = "hidden"
                  animate = "visible"
                  variants = {variants}
                  transition={{delay: 0.3, duration: 0.5}}
                >
                <Flex alignItems="center"> 
                  <ListIcon as={MdExitToApp} color="gray.500" />
                  <Text fontWeight="normal" ml="2">Logout</Text>
                </Flex>
                </motion.div>
                
              </Button>
            </ListItem>
          </List>
        </DrawerBody>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={variants}
          transition={{  duration: 0.5 }}
        >
        <Box 
          position="absolute" 
          bottom="0" 
          left="0" 
          right="0" p="5" 
          bgGradient="linear(to-t, green.300, white)" 
          
          boxShadow="xl" 
          >
          <Flex alignItems="center" justifyContent="flex-start">
            <Avatar name="Andrew" src="https://bit.ly/broken-link" />
            <Text ml="3" color="black" >Andrew</Text>
          </Flex>
        </Box>
        </motion.div>
      </DrawerContent>
    </Drawer>
  );
}

/*
suggestion: pull user's name to use as the avatar name, to put next to the avatar*/