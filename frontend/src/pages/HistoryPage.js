import React from "react";
import {
  Input,
  Select,
  Button,
  Box,
  Heading,
  Text,
  useDisclosure,
  InputGroup,
  IconButton,
  InputLeftElement,
  Icon,
  Flex
} from "@chakra-ui/react";
import { HamburgerIcon, SearchIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";

export default function HistoryPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div className="min-h-screen bg-my-image bg-cover bg-center">
      <Box className="flex flex-col items-center justify-center p-4 bg-gray-900 bg-opacity-0 min-h-screen">
        <IconButton
          icon={<HamburgerIcon />}
          aria-label="Open Menu"
          onClick={onOpen}
          color="white"
          backgroundColor="transparent"
          _hover={{ bg: "transparent", opacity: 0.8 }}
          _active={{ bg: "transparent" }}
          sx={{ fontSize: "36px", padding: "12px" }}
          position="absolute"
          top="4"
          left="4"
        />
        <Sidebar isOpen={isOpen} onClose={onClose} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Box className="justify-center text-center">
            <Heading as="h1" size="xl" color="white" mb="4">
              History Page
            </Heading>
            <Text fontSize="xl" color="white" mb="5">
              View your translation history
            </Text>
            <Icon as={SearchIcon} color="gray.500" marginRight="2" />
            <Input
              placeholder="Search History..."
              _placeholder={{ opacity: 1, color: "black" }}
              mb="4"
              mx="auto"
              borderColor="grey"
              width="90%"
            />
            
          </Box>
        </motion.div>
        <Box className="justify-center text-center">
          <Flex justifyContent="flex-end" align="center">
            <Text fontSize="lg" mb="4" color="grey" mr="40">
              Link
            </Text>

            <Text fontSize="lg" mb="4" color="grey" mr="1">
              Language translated to
            </Text>
          </Flex>
        </Box>
      </Box>
    </div>
          
  );
}
