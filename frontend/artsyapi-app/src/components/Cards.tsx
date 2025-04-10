import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import ArtistInfo from "./ArtistInfo";
import Artworks from "./Artworks";
import Similarartists from "./Similarartists";
import { Star, StarFill } from "react-bootstrap-icons";

const Cards = ({
  artistdata,
  isLoggedIn,
  loggedinuser,
  artistid,
  setFavourites,
  handlenotification,
  showCards,
  artistinfo,
  setartistinfo,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [SelectedclickedArtistId, setSelectedclickedArtistId] = useState(null);
  const [artworks, setArtworks] = useState({ _embedded: { artworks: [] } });
  const [selectedartist, setselectedartist] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const [artistdattoinfo, setartistdatatoinfo] = useState({});
  const [isLoadingArtistInfo, setIsLoadingArtistInfo] = useState(false);
  const [isLoadingArtworks, setIsLoadingArtworks] = useState(false);

  const isMobile = window.innerWidth < 992;

  useEffect(() => {
    if (!artistid) return;

    const fetchData = async () => {
      setIsLoadingArtistInfo(true);
      setIsLoadingArtworks(true);

      try {
        const response1 = await fetch(`/api/artistdata?id=${artistid}`);
        if (!response1.ok) throw new Error("Failed to fetch artist info");
        const data = await response1.json();
        setartistinfo(data);
        setIsLoadingArtistInfo(false);
        setselectedartist(data);

        const response2 = await fetch(`/api/artworksdata?id=${artistid}`);
        if (!response2.ok) throw new Error("Failed to fetch artworks");
        const data2 = await response2.json();
        setArtworks(data2 || { _embedded: { artworks: [] } });
      } catch (error) {
        console.error(error);
        setArtworks({ _embedded: { artworks: [] } });
        setartistinfo(null);
      } finally {
        setIsLoadingArtworks(false);
      }
    };

    fetchData();
  }, [artistid]);

  const handleCardClick = async (artist) => {
    setselectedartist(artist);
    if (!artist) return;

    const id = artist._links.self.href.split("/").pop();
    sessionStorage.setItem("artist_id", id);
    setIsLoadingArtistInfo(true);
    setIsLoadingArtworks(true);

    try {
      const response1 = await fetch(`/api/artistdata?id=${id}`);
      if (!response1.ok) throw new Error("Failed to fetch artist info");
      const data = await response1.json();
      setartistinfo(data);
      setIsLoadingArtistInfo(false);

      const response2 = await fetch(`/api/artworksdata?id=${id}`);
      if (!response2.ok) throw new Error("Failed to fetch artworks");
      const data2 = await response2.json();
      setArtworks(data2 || { _embedded: { artworks: [] } });
    } catch (error) {
      console.error(error);
      setArtworks({ _embedded: { artworks: [] } });
      setartistinfo(null);
    } finally {
      setIsLoadingArtworks(false);
    }
  };

  const addToFavourites = async (artist) => {
    const id = artist._links?.self?.href.split("/").pop();
    const response1 = await fetch(`/api/artistdata?id=${id}`);
    if (!response1.ok) throw new Error("Failed to fetch artist info");
    const artistdata1 = await response1.json();

    try {
      const artistdata = {
        artistId: id,
        title: artist.title,
        birthyear: artistdata1.birthday,
        deathyear: artistdata1.deathday,
        nationality: artistdata1.nationality,
        image: artist._links.thumbnail?.href || "/artsy_logo.svg",
      };

      setartistdatatoinfo(artistdata);
      const res = await fetch("/api/addtofavourites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(artistdata),
      });

      const data = await res.json();
      setFavourites(data.user);
    } catch (error) {
      console.error("Error adding to favourites:", error);
    }
  };

  const deleteFromFavourites = async (artist) => {
    try {
      const artistId = artist._links?.self?.href.split("/").pop();
      const res = await fetch("/api/deletefavourites", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: artistId }),
      });

      const data = await res.json();
      setFavourites(data.user);
    } catch (error) {
      console.error("Error deleting from favourites:", error);
    }
  };

  const handlefavourities = async (artist) => {
    const artistId = artist._links?.self?.href.split("/").pop();
    const isFavorited = loggedinuser?.favourites?.some(
      (fav) => fav.artistId === artistId
    );

    try {
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
      setHoveredIndex(null);
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  const cardContainerStyle = isMobile
    ? {
        whiteSpace: "nowrap",
        width: "100%",
        margin: "0 auto",
        paddingTop: "0",
        paddingLeft: "1rem",
        paddingRight: "1rem",
        direction: "ltr",
        overflowX: "auto",
      }
    : {
        whiteSpace: "nowrap",
        width: "950px",
        margin: "0 auto",
        paddingTop: "0",
      };

  const tabsColStyle = isMobile
    ? {
        border: "none",
        borderRadius: "10px",

        width: "calc(100% - 2rem)",
        margin: "0 auto",
      }
    : {
        border: "none",
        borderRadius: "10px",
      };

  return (
    <>
      {showCards && (
        <Container className="mt-4">
          <div
            className="d-flex gap-1 overflow-auto py-3 px-2"
            style={cardContainerStyle}
          >
            {artistdata.map((artist, index) => {
              const artistId = artist._links?.self?.href.split("/").pop();
              const isFavorited = loggedinuser?.favourites?.some(
                (fav) => fav.artistId === artistId
              );

              return (
                <Card
                  key={index}
                  className="text-white bg-dark position-relative"
                  style={{
                    width: "185px",
                    height: "250px",
                    flex: "0 0 auto",
                    borderRadius: "5px",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => {
                    handleCardClick(artist);
                    const artistId = artist._links.self.href.split("/").pop();
                    setSelectedclickedArtistId(artistId);
                  }}
                >
                  {isLoggedIn && (
                    <Button
                      variant="link"
                      className="position-absolute top-0 end-0 m-2 p-0 border-0"
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        backgroundColor: "#004AAD",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 2,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlefavourities(artist);
                      }}
                    >
                      {isFavorited ? (
                        <StarFill color="#FFD700" />
                      ) : (
                        <Star color="#FFF" />
                      )}
                    </Button>
                  )}

                  <Card.Img
                    src={artist._links.thumbnail.href}
                    onError={(e) => (e.target.src = "/artsy_logo.svg")}
                    className="w-100"
                    style={{
                      height: "240px",
                      width: "150px",
                      objectFit: "cover",
                      borderRadius: "0px",
                    }}
                  />
                  <Card.Body
                    style={{
                      backgroundColor:
                        hoveredIndex === index ||
                        SelectedclickedArtistId === artistId
                          ? "#17479E"
                          : "#112B3C",
                      padding: "10px",
                    }}
                  >
                    <h6 className="mb-0">{artist.title}</h6>
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        </Container>
      )}

      {artistinfo && (
        <Container className="mt-4 pb-5">
          <Row className="justify-content-center">
            <Col md={10} lg={10} xl={9} className="d-flex" style={tabsColStyle}>
              <Button
                className="flex-fill "
                onClick={() => setActiveTab("info")}
                style={{
                  backgroundColor: activeTab === "info" ? "#17479E" : "#FFFFFF",
                  color: activeTab === "info" ? "#FFFFFF" : "#17479E",
                  border: "none",
                }}
              >
                Artist Info
              </Button>
              <Button
                className="flex-fill "
                onClick={() => setActiveTab("artworks")}
                style={{
                  backgroundColor:
                    activeTab === "artworks" ? "#17479E" : "#FFFFFF",
                  color: activeTab === "artworks" ? "#FFFFFF" : "#17479E",
                  border: "none",
                }}
              >
                Artworks
              </Button>
            </Col>
          </Row>
          {artistinfo ? (
            <>
              {activeTab === "info" && (
                <ArtistInfo
                  clickedartist={artistinfo}
                  loginstate={isLoggedIn}
                  loggedinuser={loggedinuser}
                  artistdata={artistdattoinfo}
                  isLoading={isLoadingArtistInfo}
                  favourites={loggedinuser?.favourites}
                  setFavourites={setFavourites}
                  handlenotification={handlenotification}
                />
              )}
              {activeTab === "artworks" && (
                <Artworks artworks={artworks} isLoading={isLoadingArtworks} />
              )}
            </>
          ) : null}
        </Container>
      )}

      {isLoggedIn && artistinfo ? (
        <Similarartists
          selectedartist={selectedartist}
          loggedinuser={loggedinuser}
          favourites={loggedinuser?.favourites}
          setFavourites={setFavourites}
          handlenotification={handlenotification}
          onSimilarArtistClick={handleCardClick}
        />
      ) : null}
    </>
  );
};

export default Cards;
