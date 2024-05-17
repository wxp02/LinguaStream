import React from "react";
import { Box, Text, Input, Select, Button } from "@chakra-ui/react";

export default function HomePageInputs({
  youtubeLink,
  setYoutubeLink,
  language,
  setLanguage,
  celebrityVoice,
  setCelebrityVoice,
  handleTranslate,
}) {
  return (
    <Box width="full" maxW="2xl" p="8" borderRadius="lg">
      {/* Enter Youtube link */}
      <Text fontSize="lg" color="white" textAlign="left">
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
        mb="6"
        style={{ color: "white", fontFamily: "Poppins" }}
      />

      {/* Select language */}
      <Text fontSize="lg" color="white" textAlign="left" mb="4">
        Language
      </Text>
      <Select
        placeholder="Select Language"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        color="white"
        mb="6"
      >
        <option value="English">English</option>
        <option value="Chinese">Chinese</option>
        <option value="French">French</option>
      </Select>

      {/* Conditional rendering of Celebrity Voice based on language selection */}
      {language === "English" && (
        <>
          <Text fontSize="lg" color="white" textAlign="left" mb="4">
            Celebrity Voice
          </Text>
          <Select
            placeholder="No Celebrity Voice"
            value={celebrityVoice}
            onChange={(e) => setCelebrityVoice(e.target.value)}
            color="white"
            mb="8"
          >
            <option value="Obama">Obama</option>
            <option value="Gordon Ramsay">Gordon Ramsay</option>
          </Select>
        </>
      )}

      <Button
        colorScheme="blue"
        size="lg"
        width="full"
        onClick={handleTranslate}
      >
        Translate
      </Button>
    </Box>
  );
}
