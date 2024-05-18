<Button
            onClick={() => navigate("/signup")}
            colorScheme="white"
            size="md"
            variant="ghost"
            mr={4}
          >
            <Text fontWeight="normal">Sign up</Text>
          </Button>
          <Button
            onClick={() => navigate("/login")}
            colorScheme="green"
            size="md"
          >
            <Text fontWeight="normal">Login</Text>
          </Button>

<div className="flex flex-row items-center justify-center w-full">
<div className="flex flex-col mr-40">
  <h1 className="text-5xl font-bold mb-4">Not a fan of subtitles?</h1>
  <p className="mb-8 text-sm text-lightgrey">
    LinguaStream translates audio from YouTube videos into desired
    languages and accents
  </p>
  <button
    onClick={handleGetStarted}
    className="bg-yellow-500 hover:bg-yellow-600 text-black py-3 w-40 rounded-lg"
  >
    Get started
  </button>
</div>

</div>


<img
src="./landing-page.png"
alt="Translate"
style={{ width: "500px", height: "500px" }}
/>