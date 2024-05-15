import React, { useState } from "react";
import {
  Input,
  Select,
  Button,
  Box,
  Heading,
  Text,
  useDisclosure,
  IconButton,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";

export default function HomePage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [language, setLanguage] = useState("");

  const handleTranslate = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          youtube_link: youtubeLink,
          language: language,
        }),
      });
      const data = await response.json();
      console.log("Translation complete:", data);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

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
            <Heading as="h1" size="2xl" color="white" mb="4">
              Welcome back Andrew!
            </Heading>
            <Text fontSize="xl" color="white">
              Insert YouTube Link To Translate Audio
            </Text>
          </Box>
        </motion.div>
        {!loading ? (
          <Box width="full" maxW="2xl" p="8" borderRadius="lg">
            <Text fontSize="lg" color="white">
              YouTube Link
            </Text>
            <Input
              placeholder="Type in YouTube Link"
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              _placeholder={{
                opacity: 1,
                color: "white",
                fontFamily: "Poppins",
              }}
              mb="4"
              style={{ color: "white", fontFamily: "Poppins" }}
            />
            <Text fontSize="lg" mb="4" color="white">
              Language
            </Text>
            <Select
              placeholder="Select Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              color="white"
              mb="8"
            >
              <option value="English">English</option>
              <option value="Chinese">Chinese</option>
              <option value="French">French</option>
              <option value="Korean">Korean</option>
            </Select>
            <Button
              colorScheme="blue"
              size="lg"
              width="full"
              onClick={handleTranslate}
            >
              Translate
            </Button>
          </Box>
        ) : (
          <Center w="full" h="full" position="absolute" top="0" left="0">
            <Spinner
              size="xl"
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
            />
          </Center>
        )}
      </Box>
    </div>
  );
}
