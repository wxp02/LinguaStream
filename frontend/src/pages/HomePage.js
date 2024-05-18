import React, { useState } from "react";
import {
  Box,
  useDisclosure,
  Spinner,
  Center,
  VStack,
  Text,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import CustomHamburgerIcon from "../components/CustomHamburgerIcon";
import HomePageInputs from "../components/HomePageInputs";
import HomePageVideo from "../components/HomePageVideo";
// import Chatbot from "../components/Chatbot";
import axios from "axios";

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
    try {
      const videoId = getYouTubeVideoId(youtubeLink);
      if (!videoId) {
        setError("Invalid YouTube link. Please check and try again.");
        setLoading(false);
        return;
      }
      const response = await axios.post("http://127.0.0.1:5000/translate", {
        youtube_link: youtubeLink,
        language: language,
        celebrity_voice: celebrityVoice,
      });
      console.log(response); // For testing in frontend

      if (response.status === 200) {
        const videoUrl = response.data.video_url;
        const title = response.data.youtube_title; // Ideally fetch this dynamically or from the response if your backend provides it

        setVideoDetails({
          videoUrl,
          title,
          language,
          celebrityVoice: language === "English" ? celebrityVoice : "",
        });
      } else {
        setError("Failed to translate. Please try again.");
      }
    } catch (error) {
      setError(
        "An error occurred while trying to translate. Please try again."
      );
      console.error("Error translating video:", error);
    } finally {
      setLoading(false);
    }
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
          <Box className="justify-center text-center">
            {loading ? (
              <Center height="100vh">
                {" "}
                {/* Adjust height as needed to center vertically in the view */}
                <VStack spacing={3}>
                  {" "}
                  {/* Vertical stack with spacing between items */}
                  <Text fontSize="xl" color="gray.600">
                    Translating...
                  </Text>{" "}
                  {/* Text component for the label */}
                  <Spinner
                    size="xl"
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="teal.500"
                  />
                </VStack>
              </Center>
            ) : videoDetails ? (
              <HomePageVideo
                videoDetails={videoDetails}
                handleReset={handleReset}
              />
            ) : (
              <HomePageInputs
                error={error}
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
      {/* <Chatbot /> */}
    </div>
  );
}
