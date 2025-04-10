import React from "react";
import { Container, Row, Col, Button, Alert, Spinner } from "react-bootstrap";
import { Star, StarFill } from "react-bootstrap-icons";

function ArtistInfo({
  clickedartist,
  loginstate,
  loggedinuser,
  artistdata,
  isLoading,
  favourites,
  setFavourites,
  handlenotification,
}) {
  const artistId = clickedartist?._links?.self?.href.split("/").pop();

  const isFavorited = favourites?.some((fav) => fav.artistId === artistId);

  const addToFavourites = async (artist) => {
    try {
      const artistdata = {
        artistId: artistId,
        title: clickedartist.name,
        birthyear: clickedartist.birthday,
        deathyear: clickedartist.deathday,
        nationality: clickedartist.nationality,
        image: artist._links.thumbnail?.href || "/artsy_logo.svg",
      };

      const res = await fetch("/api/addtofavourites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(artistdata),
      });

      const data = await res.json();

      setFavourites(data.user);
    } catch (error) {
      console.error("Error adding to favourites:", error);
    }
  };

  const deleteFromFavourites = async () => {
    try {
      const res = await fetch("/api/deletefavourites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: artistId }),
      });

      const data = await res.json();

      setFavourites(data.user);
    } catch (error) {
      console.error("Error deleting from favourites:", error);
    }
  };

  const handlefavourities = async (artist) => {
    try {
      const artistId = artist._links?.self?.href.split("/").pop();
      const isFavorited = favourites?.some((fav) => fav.artistId === artistId);

      if (isFavorited) {
        handlenotification({
          message: "Removed from favourites",
          variant: "danger",
        });
        await deleteFromFavourites(artist);
      } else {
        handlenotification({
          message: "Added to favourites",
          variant: "success",
        });
        await addToFavourites(artist);
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center mt-4">
        <Spinner
          animation="border"
          role="status"
          style={{ color: "#004AAD", width: "40px", height: "40px" }}
        />
      </div>
    );
  }

  return (
    <Container className="text-center mt-4">
      <Row className="justify-content-center">
        <Col xs={12} md={12} lg={10}>
          {clickedartist ? (
            <>
              <h2
                className="fw-bold d-flex justify-content-center align-items-baseline"
                style={{ gap: "4px" }}
              >
                {clickedartist.name}
                {loginstate && (
                  <Button
                    variant="link"
                    className="p-0 m-0 border-0"
                    style={{
                      backgroundColor: "transparent",
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: "4px",
                      paddingBottom: "2px",
                    }}
                    onClick={() => handlefavourities(clickedartist)}
                  >
                    {isFavorited ? (
                      <StarFill color="#FFD700" size={22} />
                    ) : (
                      <Star color="black" size={22} />
                    )}
                  </Button>
                )}
              </h2>

              <h3 className="text-muted fs-5" style={{ marginTop: "-5px" }}>
                {clickedartist.nationality}, {clickedartist.birthday} -{" "}
                {clickedartist.deathday}
              </h3>

              <Container
                className="p-4 text-justify"
                style={{
                  maxWidth: "1000px",
                  fontFamily: "Arial, sans-serif",
                  fontSize: "1rem",
                  lineHeight: "1.4",
                  wordSpacing: "0.1rem",
                  textAlign: "justify",
                }}
              >
                {clickedartist.biography
                  ?.replace(/[‐‑‒–—―]/g, "-")
                  .replace(/(\w+)-\s*(\w+)/g, "$1$2")
                  .split(/\n+/)
                  .map((para, index) => (
                    <p key={index} className="mb-3">
                      {para}
                    </p>
                  ))}
              </Container>
            </>
          ) : (
            <Alert variant="danger">Artist data could not be loaded.</Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default ArtistInfo;
