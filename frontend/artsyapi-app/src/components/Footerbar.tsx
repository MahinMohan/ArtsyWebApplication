import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

const FooterBar = () => {
  return (
    <Navbar
      style={{
        backgroundColor: "#1e2a37",
        color: "white",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "35px",
        width: "100%",
        fontSize: "15px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <Container className="justify-content-center">
        <a
          href="https://www.artsy.net"
          rel="noopener noreferrer"
          style={{ color: "white", textDecoration: "none" }}
        >
          Powered by{" "}
          <img
            src="/artsy_logo.svg"
            alt="Artsy"
            style={{
              height: "16px",
              verticalAlign: "middle",
              marginLeft: "4px",
            }}
          />{" "}
          Artsy.
        </a>
      </Container>
    </Navbar>
  );
};

export default FooterBar;
