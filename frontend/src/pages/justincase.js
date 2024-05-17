import React, { useState } from "react";
import {
  Button,
  Box,
  Heading,
  Text,
  useDisclosure,
  Image,
  VStack,
  Spinner,
  Center,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import CustomHamburgerIcon from "../components/CustomHamburgerIcon";
import HomePageInputs from "../components/HomePageInputs";

export default function HomePage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [youtubeLink, setYoutubeLink] = useState("");
  const [language, setLanguage] = useState("");
  const [celebrityVoice, setCelebrityVoice] = useState("");
  const [videoDetails, setVideoDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getYouTubeVideoId = (url) => {
    const regex =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|\S*?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleTranslate = async () => {
    setError(""); // Clear any previous errors
    if (!youtubeLink) {
      setError("Please enter a YouTube link.");
      return;
    }
    if (!language) {
      setError("Please select a language before translating.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const videoId = getYouTubeVideoId(youtubeLink);
      if (!videoId) {
        setError("Invalid YouTube link. Please check and try again.");
        setLoading(false);
        return;
      }
      const thumbnail = `https://img.youtube.com/vi/${videoId}/0.jpg`;
      const title = "Dynamic Video Title"; // Placeholder, fetch this dynamically

      setVideoDetails({
        thumbnail,
        title,
        language,
        celebrityVoice: language === "English" ? celebrityVoice : "",
      });
      setLoading(false);
    }, 2000);
  };

  const handleReset = () => {
    setVideoDetails(null);
    setYoutubeLink("");
    setLanguage("");
    setCelebrityVoice("");
    setError(""); // Clear error on reset
  };

  return (
    <div className="min-h-screen bg-my-image bg-cover bg-center">
      <Box className="flex flex-col items-center justify-center p-4 bg-gray-900 bg-opacity-0 min-h-screen">
        <CustomHamburgerIcon onOpen={onOpen} />
        <Sidebar isOpen={isOpen} onClose={onClose} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Box className="mb-4">
            <Heading fontSize="3xl" color="white">
              Insert YouTube Link To Translate Audio
            </Heading>
          </Box>
          <Box className="justify-center text-center">
            {error && (
              <Alert status="error" mb="4">
                <AlertIcon />
                {error}
              </Alert>
            )}
            {loading ? (
              <Center>
                <Spinner
                  size="xl"
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                />
              </Center>
            ) : videoDetails ? (
              <VStack spacing={4}>
                <Image
                  src={videoDetails.thumbnail}
                  alt="Video Thumbnail"
                  boxSize="300px"
                  objectFit="cover"
                  borderRadius="lg"
                />
                <Text fontSize="lg" color="white">
                  Title: {videoDetails.title}
                </Text>
                <Text fontSize="lg" color="white">
                  Language: {videoDetails.language}
                </Text>
                {videoDetails.language === "English" &&
                  videoDetails.celebrityVoice && (
                    <Text fontSize="lg" color="white">
                      Celebrity Voice: {videoDetails.celebrityVoice}
                    </Text>
                  )}
                <Button colorScheme="blue" onClick={handleReset}>
                  Back
                </Button>
              </VStack>
            ) : (
              <HomePageInputs
                youtubeLink={youtubeLink}
                setYoutubeLink={setYoutubeLink}
                language={language}
                setLanguage={setLanguage}
                celebrityVoice={celebrityVoice}
                setCelebrityVoice={setCelebrityVoice}
                handleTranslate={handleTranslate}
              />
            )}
          </Box>
        </motion.div>
      </Box>
    </div>
  );
}
