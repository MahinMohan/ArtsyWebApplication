import {
  Form,
  Button,
  InputGroup,
  Container,
  Spinner,
  Alert,
} from "react-bootstrap";
import Cards from "./Cards";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useParams } from "react-router-dom";

function Searchbar({
  isLoggedIn,
  loggedinuser,
  setFavourites,
  handlenotification,
}) {
  const [searchinput, setsearchinput] = useState("");
  const [artistdata, setartistdata] = useState([]);
  const [searchload, setsearchload] = useState(false);
  const [searched, setSearched] = useState(false);
  const [artistinfo, setartistinfo] = useState(null);

  const params = useParams();

  const [artistIdFromUrl, setArtistIdFromUrl] = useState(
    params.id || sessionStorage.getItem("artist_id")
  );

  const id = useParams().id || sessionStorage.getItem("artist_id");

  const handleforminput = (e) => {
    setsearchinput(e.target.value);
  };

  const handlesearch = async () => {
    sessionStorage.removeItem("artist_id");
    if (!searchinput.trim()) {
      return;
    }
    try {
      setsearchload(true);
      setSearched(true);
      const response = await fetch(`/api/searchdata?q=${searchinput}`);
      if (!response.ok) {
        setsearchload(false);
        return;
      }
      const data = await response.json();
      setartistdata(data);
    } catch (error) {
      console.log("Backend server error", error);
    } finally {
      setsearchload(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handlesearch();
      sessionStorage.removeItem("artist_id");
    }
  };

  const handleClear = () => {
    setsearchinput("");
    setartistdata([]);
    setSearched(false);
    sessionStorage.removeItem("artist_id");
    setartistinfo(null);
  };

  return (
    <>
      <Container className="d-flex justify-content-center mt-5">
        <InputGroup style={{ maxWidth: "950px" }}>
          <Form.Control
            placeholder="Please enter an artist name."
            onChange={handleforminput}
            onKeyDown={handleKeyPress}
            value={searchinput}
          />
          <Button
            variant="primary"
            onClick={handlesearch}
            disabled={!searchinput.trim()}
            style={{ backgroundColor: "#17479E", borderColor: "#17479E" }}
          >
            Search
            {searchload ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : null}
          </Button>
          <Button variant="secondary" onClick={handleClear}>
            Clear
          </Button>
        </InputGroup>
      </Container>

      {searched && !searchload && artistdata.length === 0 && (
        <Container className="mt-3" style={{ maxWidth: "950px" }}>
          <Alert
            variant="danger"
            className="text-start"
            style={{
              padding: "0.5rem 1rem",
              marginBottom: "0.5rem",
            }}
          >
            No results.
          </Alert>
        </Container>
      )}

      <Cards
        artistdata={artistdata}
        isLoggedIn={isLoggedIn}
        loggedinuser={loggedinuser}
        artistid={artistIdFromUrl}
        setFavourites={setFavourites}
        handlenotification={handlenotification}
        showCards={searched}
        artistinfo={artistinfo}
        setartistinfo={setartistinfo}
      />
    </>
  );
}

export default Searchbar;
