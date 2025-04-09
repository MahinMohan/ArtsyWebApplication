import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Star, StarFill } from "react-bootstrap-icons";

function Similarartists({
  selectedartist,
  loggedinuser,
  favourites,
  setFavourites,
  handlenotification,
  onSimilarArtistClick,
}) {
  const [similarartists, setsimilarartists] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);

  useEffect(() => {
    if (!selectedartist) return;

    const id = selectedartist._links.self.href.split("/").pop();

    const fetchsimilarartists = async () => {
      try {
        const response = await fetch(`api/similarartists?id=${id}`);
        if (!response.ok) throw new Error("Failed to fetch artist info");

        const data = await response.json();
        const artists = data._embedded?.artists || [];
        setsimilarartists(artists);
      } catch (error) {
        console.error(error);
        setsimilarartists([]);
      }
    };

    fetchsimilarartists();
  }, [selectedartist]);

  const handlefavourities = async (artist) => {
    const artistId = artist._links?.self?.href.split("/").pop();
    const isFavorited = favourites?.some((fav) => fav.artistId === artistId);

    try {
      if (isFavorited) {
        // setFavourites((prev) =>
        //   prev.filter((fav) => fav.artistId !== artistId)
        // );
        handlenotification({
          message: "Removed from favourites",
          variant: "danger",
        });
        const res = await fetch("api/deletefavourites", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: artistId }),
        });
        const data = await res.json();
        console.log(data);
        setFavourites(data.user);
      } else {
        // setFavourites((prev) => [...prev, { artistId, title: artist.name }]);
        const artistdata = {
          artistId,
          title: artist.name,
          birthyear: artist.birthday,
          deathyear: artist.deathday,
          nationality: artist.nationality,
          image: artist._links.thumbnail?.href,
        };

        handlenotification({
          message: "Added to favourites",
          variant: "success",
        });

        const res = await fetch("api/addtofavourites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(artistdata),
        });
        const data = await res.json();
        console.log(data);

        setFavourites(data.user);
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  return (
    <div className="container mt-0" style={{ paddingBottom: "50px" }}>
      {similarartists.length > 0 && (
        <div style={{ width: "950px", margin: "0 auto" }}>
          <h5 style={{ marginBottom: "0px" }}>Similar Artists</h5>
        </div>
      )}

      <div
        className="d-flex gap-2 overflow-auto py-2 px-2"
        style={{
          whiteSpace: "nowrap",
          width: "950px",
          margin: "0 auto",
          paddingTop: "0",
        }}
      >
        {similarartists.map((artist, index) => {
          const artistId = artist._links?.self?.href.split("/").pop();
          const isFavorited = loggedinuser?.favourites?.some(
            (fav) => fav.artistId === artistId
          );

          return (
            <div
              key={index}
              className="card text-white bg-dark position-relative"
              style={{
                width: "180px",
                height: "250px",
                flex: "0 0 auto",
                borderRadius: "5px",
                overflow: "hidden",
                cursor: "pointer",
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => {
                onSimilarArtistClick(artist);
                setSelectedCardIndex(index);
              }}
            >
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
                  <StarFill color="#FFD700" size={16} />
                ) : (
                  <Star color="#FFF" size={16} />
                )}
              </Button>

              <img
                src={artist._links.thumbnail?.href}
                onError={(e) => (e.target.src = "/artsy_logo.svg")}
                className="w-100"
                style={{
                  height: "260px",
                  width: "150px",
                  objectFit: "cover",
                }}
                alt={artist.name}
              />
              <div
                className="card-body"
                style={{
                  backgroundColor:
                    hoveredIndex === index ? "#17479E" : "#112B3C",
                  padding: "10px",
                  height: "40px",
                }}
              >
                <h6 className="mb-0">{artist.name}</h6>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Similarartists;
