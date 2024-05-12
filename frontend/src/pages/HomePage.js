import React from "react";
import {
  Input,
  Select,
  Button,
  Box,
  Heading,
  Text,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import Sidebar from "../components/Sidebar";

export default function HomePage() {
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
        <Heading as="h1" size="2xl" color="white" mb="8">
          Insert YouTube Link To Translate Audio
        </Heading>
        <Box
          width="full"
          maxW="2xl"
          p="8"
          bg="white"
          borderRadius="lg"
          boxShadow="xl"
        >
          <Text fontSize="lg" mb="4">
            YouTube Link
          </Text>
          <Input placeholder="Type in YouTube Link" mb="4" />
          <Text fontSize="lg" mb="4">
            Language
          </Text>
          <Select placeholder="Select Language" mb="8">
            <option>English</option>
            <option>Chinese</option>
            <option>French</option>
            <option>Korean</option>
          </Select>
          <Button colorScheme="blue" size="lg" width="full">
            Translate
          </Button>
        </Box>
      </Box>
    </div>
  );
}
