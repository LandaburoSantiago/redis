import NavBar from "./components/Navbar/Navbar";
import Title from "./components/Title/Title";
import { Routes, Route, useLocation } from "react-router-dom";
import { Animated } from "react-animated-css";
import InterestGroups from "./components/InterestGroups/InterestGrups";
import FormAddInterestGruop from "./components/FormAddInterestGroup/FormAddInterestGruop";

function App() {
  const location = useLocation();
  return (
    <div className="App">
      <main className="general-container">
        <Title />

        <>
          <Animated
            animationIn="bounceIn"
            animationOut="bounceOut"
            isVisible={location.pathname !== "/"}
            className={"navbar-top"}
          >
            {location.pathname !== "/" ? (
              <div>
                <NavBar />
              </div>
            ) : null}
          </Animated>
          {location.pathname === "/" ? (
            <Animated
              animationIn="bounceIn"
              animationOut="bounceOut"
              isVisible={location.pathname === "/"}
              className={"navbar-center"}
            >
              {location.pathname === "/" ? (
                <div>
                  <NavBar />
                </div>
              ) : null}
            </Animated>
          ) : null}
          {location.pathname === "/" ? (
            <div style={{ margin: "0 auto", maxHeight: "30px" }}>
              <span
                style={{
                  color: "white",
                  fontSize: "2rem",
                  fontFamily: "monospace",
                }}
              >
                By:{" "}
                <a
                  className="nostyle"
                  style={{ textDecoration: "underline" }}
                  href="https://santiagolandaburo.com/"
                  type="text"
                >
                  Santiago Landaburo
                </a>
              </span>
            </div>
          ) : null}
        </>

        <Routes>
          <Route path="/" element={<></>} />
          <Route path="/interestGroups" element={<InterestGroups />} />
          <Route path="/addMember/:group" element={<FormAddInterestGruop />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
