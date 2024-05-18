import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Text } from "@chakra-ui/react";
import "./LandingPage.css";
import avl from "../assets/avltrees.png";
import dennis from "../assets/ddennis.png";
import algo from "../assets/dijstras.png";
import git from "../assets/github.png";

export default function LandingPage() {
  let navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/signup");
  };

  return (
    <div className="rooter">
      <header>
        <h1 className="lp-title">linguastream</h1>
        <div className="lp-header-navs">
          <p>Demo</p><span>&#8901;</span>
          <a href="#founders"><p>Founders</p></a>
        </div>
        <div className="lp-header-buttons">
          <Button
          backgroundColor={"#1A4D2E"}
          color={"white"}
          _hover={{backgroundColor: "white", color: "#1A4D2E"}}
          borderRadius={"1em"}
          marginInlineEnd={"1em"}
          width={"7em"}
            onClick={() => navigate("/login")}
          >
            <Text>Login</Text>
          </Button>
          <Button
          borderRadius={"1em"}
          color={"#1A4D2E"}
          width={"7em"}
            onClick={() => navigate("/signup")}
          >
            <Text>Sign up</Text>
          </Button>
        </div>
      </header>
      <main className="lp-main">
      <div>
        <div><h1 className="nafos">Not a fan of subtitles?</h1></div>
        <div><p className="lp-main-p-text">With linguastream, you can translate YouTube videos to your desired languages, removing the need for subtitles.</p></div>
        <div>
        <Button
          borderRadius={"1em"}
          color={"#1A4D2E"}
          width={"8em"}
            onClick={() => navigate("/signup")}
            marginBlockStart={"2em"}
          >
            <Text>Get started</Text>
          </Button>
        </div>
      </div>
      <div>
        <img className="lp-top-i i1" src={dennis} alt="Logo" />
        <img className="lp-top-i i2" src={avl} alt="Logo" />
        <img className="lp-top-i i4" src={algo} alt="Logo" />
      </div>
      </main>
      <div id="founders" className="founders">
        <h1 className="mtm">Meet the minds behind it all....</h1>
        <div className="founders-list">
          <div>
            <img className="my-pic" src={git} alt="Logo" />
          <p>Xin Huey</p>
          <p>about her..</p>
          <p>Github and resume</p>
          </div>
          <div>
            <img className="my-pic" src={git} alt="Logo" />
          <p>Jeremy Poh</p>
          <p>about him..</p>
          <p>Github and resume</p>
          </div>
          <div>
            <img className="my-pic" src={git} alt="Logo" />
          <p>Yen Zein </p>
          <p>about him..</p>
          <p>Github and resume</p>
          </div>
          <div>
            <img className="my-pic" src={git} alt="Logo" />
          <p>Andrew</p>
          <p>about him..</p>
          <p>Github and resume</p>
          </div>
        </div>
      </div>
      <footer>
        <p><span>&#169;</span> <a className="footer-name" target="_blank" href="https://www.linkedin.com/in/yenzein/">yz</a>, <a className="footer-name" target="_blank" href="https://www.linkedin.com/in/xhwong/">xh</a>, <a className="footer-name" target="_blank"  href="https://www.linkedin.com/in/jeremy-p-1833291ab/">jp</a> and <a className="footer-name" target="_blank" href="https://www.linkedin.com/in/acarochu/">aa</a> at hawkhacks 2024</p>
        <p><a href="#"></a></p>
      </footer>
    </div>
  );
}

/*want to add a sliding effect for the founders*/