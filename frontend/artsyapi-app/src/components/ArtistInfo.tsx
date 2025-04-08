import React from "react";
import { Container, Row, Col, Button, Alert, Spinner } from "react-bootstrap";

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
  console.log(clickedartist);
  const artistId = clickedartist?._links?.self?.href.split("/").pop();

  const isFavorited = favourites?.some((fav) => fav.artistId === artistId);

  const addToFavourites = async (artist) => {
    try {
      console.log(artist);
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
      console.log("favs data", artistdata);

      // setFavourites((prev) => [
      //   ...prev,
      //   { artistId, title: clickedartist.name },
      // ]);
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

      // setFavourites((prev) => prev.filter((fav) => fav.artistId !== artistId));
      setFavourites(data.user);
    } catch (error) {
      console.error("Error deleting from favourites:", error);
    }
  };

  const handlefavourities = async (artist) => {
    try {
      const artistId = artist._links?.self?.href.split("/").pop();
      const isFavorited = favourites?.some((fav) => fav.artistId === artistId);
      console.log(artist);

      if (isFavorited) {
        // setFavourites((prev) =>
        //   prev.filter((fav) => fav.artistId !== artistId)
        // );
        handlenotification({
          message: "Removed from favourites",
          variant: "danger",
        });
        await deleteFromFavourites(artist);
      } else {
        // setFavourites((prev) => [...prev, { artistId, title: artist.name }]);
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 16 16"
                        fill="#FFD700"
                      >
                        <path d="M8 0.95l2.16 4.38 4.84.7-3.5 3.41.83 4.83L8 11.95l-4.33 2.3.83-4.83-3.5-3.41 4.84-.7L8 0.95z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="black"
                        strokeWidth="1.5"
                      >
                        <path d="M8 0.95l2.16 4.38 4.84.7-3.5 3.41.83 4.83L8 11.95l-4.33 2.3.83-4.83-3.5-3.41 4.84-.7L8 0.95z" />
                      </svg>
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
                  ?.replace(/[‐‑‒–—―]/g, "-") // Normalize all Unicode dashes to '-'
                  .replace(/(\w+)-\s*(\w+)/g, "$1$2") // Merge hyphenated words + optional whitespace
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

// import React, { useState } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Button,
//   Card,
//   Alert,
//   Spinner,
// } from "react-bootstrap";

// function ArtistInfo({ clickedartist, loginstate, loggedinuser, artistdata }) {
//   const [favorites, setFavorites] = useState([]);

//   const isFavorited = loggedinuser?.favourites?.some(
//     (fav) => fav.artistId === clickedartist?._links?.self?.href.split("/").pop()
//   );

//   const addToFavourites = async (artist) => {
//     const id = artist._links?.self?.href.split("/").pop();
//     console.log("Artist=", artist);
//     try {
//       const artistdata = {
//         artistId: id,
//         title: artist.name,
//         birthyear: artist.birthday,
//         deathyear: artist.deathday,
//         nationality: artist.nationality,
//       };
//       const res = await fetch("api/addtofavourites", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(artistdata),
//       });

//       const data = await res.json();
//       console.log("Added to favourites:", data);

//       loggedinuser.favourites.push({
//         artistId: id,
//         title: artist.name,
//       });
//     } catch (error) {
//       console.error("Error adding to favourites:", error);
//     }
//   };

//   const deleteFromFavourites = async (artist) => {
//     try {
//       const artistId = artist._links?.self?.href.split("/").pop();

//       const res = await fetch("api/deletefavourites", {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ id: artistId }),
//       });

//       const data = await res.json();
//       console.log("Deleted from favourites:", data);

//       loggedinuser.favourites = loggedinuser.favourites.filter(
//         (fav) => fav.artistId !== artistId
//       );
//     } catch (error) {
//       console.error("Error deleting from favourites:", error);
//     }
//   };

//   const handlefavourities = async (artist) => {
//     try {
//       const artistId = artist._links?.self?.href.split("/").pop();

//       const isFavorited = loggedinuser?.favourites?.some(
//         (fav) => fav.artistId === artistId
//       );

//       if (isFavorited) {
//         await deleteFromFavourites(artist);
//       } else {
//         await addToFavourites(artist);
//       }
//     } catch (error) {
//       console.error("Error updating favorites:", error);
//     }
//   };

//   return (
//     <Container className="text-center mt-4">
//       <Row className="justify-content-center">
//         <Col xs={12} md={12} lg={10}>
//           {clickedartist ? (
//             <>
//               <h2
//                 className="fw-bold d-flex justify-content-center align-items-baseline"
//                 style={{ gap: "4px" }}
//               >
//                 {clickedartist.name}
//                 {loginstate === true && (
//                   <Button
//                     variant="link"
//                     className="p-0 m-0 border-0"
//                     style={{
//                       backgroundColor: "transparent",
//                       width: "24px",
//                       height: "24px",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       marginLeft: "4px",
//                       paddingBottom: "2px",
//                     }}
//                     onClick={() => handlefavourities(clickedartist)}
//                   >
//                     {isFavorited ? (
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="22"
//                         height="22"
//                         viewBox="0 0 16 16"
//                         fill="#FFD700"
//                       >
//                         <path d="M8 0.95l2.16 4.38 4.84.7-3.5 3.41.83 4.83L8 11.95l-4.33 2.3.83-4.83-3.5-3.41 4.84-.7L8 0.95z" />
//                       </svg>
//                     ) : (
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="22"
//                         height="22"
//                         viewBox="0 0 16 16"
//                         fill="none"
//                         stroke="black"
//                         strokeWidth="1.5"
//                       >
//                         <path d="M8 0.95l2.16 4.38 4.84.7-3.5 3.41.83 4.83L8 11.95l-4.33 2.3.83-4.83-3.5-3.41 4.84-.7L8 0.95z" />
//                       </svg>
//                     )}
//                   </Button>
//                 )}
//               </h2>

//               <h3 className="text-muted fs-5" style={{ marginTop: "-5px" }}>
//                 {clickedartist.nationality}, {clickedartist.birthday} -{" "}
//                 {clickedartist.deathday}
//               </h3>

//               <Container
//                 className="p-4 text-justify"
//                 style={{
//                   maxWidth: "1000px",
//                   fontFamily: "Arial, sans-serif",
//                   fontSize: "1rem",
//                   lineHeight: "1.4",
//                   wordSpacing: "0.1rem",
//                   textAlign: "justify",
//                 }}
//               >
//                 {clickedartist.biography
//                   ?.replace(/(\w+)-(\n|\s)?(\w+)/g, "$1$3")
//                   .split(/\n+/)
//                   .map((para, index) => (
//                     <p key={index} className="mb-3">
//                       {para}
//                     </p>
//                   ))}
//               </Container>
//             </>
//           ) : (
//             <Alert variant="danger">Artist data could not be loaded.</Alert>
//           )}
//         </Col>
//       </Row>
//     </Container>
//   );
// }

// export default ArtistInfo;
//*************************************************************************************** */
// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Button,
//   Card,
//   Alert,
//   Spinner,
// } from "react-bootstrap";

// function ArtistInfo({ clickedartist, loginstate, loggedinuser, artistdata }) {
//   const [favorites, setFavorites] = useState([]);
//   const isFavorited = loggedinuser?.favourites?.some(
//         (fav) => fav.artistId === artistdata.artistId

//   const addToFavourites = async (artist) => {
//     const id = artist._links?.self?.href.split("/").pop();
//     console.log("Artist=", artist);
//     try {
//       const res = await fetch("api/addtofavourites", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(artistdata),
//       });

//       const data = await res.json();
//       console.log("Added to favourites:", data);
//     } catch (error) {
//       console.error("Error adding to favourites:", error);
//     }
//   };

//   const deleteFromFavourites = async (artist) => {
//     try {
//       const artistId = artist._links?.self?.href.split("/").pop();

//       const res = await fetch("api/deletefavourites", {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ id: artistId }),
//       });

//       const data = await res.json();
//       console.log("Deleted from favourites:", data);
//     } catch (error) {
//       console.error("Error deleting from favourites:", error);
//     }
//   };

//   const handlefavourities = async (artist) => {
//     try {
//       const artistId = artist._links?.self?.href.split("/").pop();

//       const isFavorited = loggedinuser?.favourites?.some(
//         (fav) => fav.artistId === artistId
//       );

//       if (isFavorited) {
//         await deleteFromFavourites(artist);

//         loggedinuser.favourites = loggedinuser.favourites.filter(
//           (fav) => fav.artistId !== artistId
//         );
//       } else {
//         await addToFavourites(artist);
//         loggedinuser.favourites.push({
//           artistId: artistId,
//           title: artist.title,
//         });
//       }

//       setHoveredIndex(null);
//     } catch (error) {
//       console.error("Error updating favorites:", error);
//     }
//   };

//   return (
//     <Container className="text-center mt-4">
//       <Row className="justify-content-center">
//         <Col xs={12} md={12} lg={10}>
//           {clickedartist ? (
//             <>
//               <h2
//                 className="fw-bold d-flex justify-content-center align-items-baseline"
//                 style={{ gap: "4px" }}
//               >
//                 {clickedartist.name}
//                 {loginstate === true && (
//                   <Button
//                     variant="link"
//                     className="p-0 m-0 border-0"
//                     style={{
//                       backgroundColor: "transparent",
//                       width: "24px",
//                       height: "24px",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       marginLeft: "4px",
//                       paddingBottom: "2px",
//                     }}
//                     onClick={() => handlefavourities(clickedartist)}
//                   >
//                     {isFavorited?
//                     (
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="22"
//                         height="22"
//                         viewBox="0 0 16 16"
//                         fill="#FFD700"
//                       >
//                         <path d="M8 0.95l2.16 4.38 4.84.7-3.5 3.41.83 4.83L8 11.95l-4.33 2.3.83-4.83-3.5-3.41 4.84-.7L8 0.95z" />
//                       </svg>
//                     ) : (
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="22"
//                         height="22"
//                         viewBox="0 0 16 16"
//                         fill="none"
//                         stroke="black"
//                         strokeWidth="1.5"
//                       >
//                         <path d="M8 0.95l2.16 4.38 4.84.7-3.5 3.41.83 4.83L8 11.95l-4.33 2.3.83-4.83-3.5-3.41 4.84-.7L8 0.95z" />
//                       </svg>
//                     )}
//                   </Button>
//                 )}
//               </h2>

//               <h3 className="text-muted fs-5" style={{ marginTop: "-5px" }}>
//                 {clickedartist.nationality}, {clickedartist.birthday} -{" "}
//                 {clickedartist.deathday}
//               </h3>

//               <Container
//                 className="p-4 text-justify"
//                 style={{
//                   maxWidth: "1000px",
//                   fontFamily: "Arial, sans-serif",
//                   fontSize: "1rem",
//                   lineHeight: "1.4",
//                   wordSpacing: "0.1rem",
//                   textAlign: "justify",
//                 }}
//               >
//                 {clickedartist.biography
//                   ?.replace(/(\w+)-(\n|\s)?(\w+)/g, "$1$3")
//                   .split(/\n+/)
//                   .map((para, index) => (
//                     <p key={index} className="mb-3">
//                       {para}
//                     </p>
//                   ))}
//               </Container>
//             </>
//           ) : (
//             <Alert variant="danger">Artist data could not be loaded.</Alert>
//           )}
//         </Col>
//       </Row>
//     </Container>
//   );
// }

// export default ArtistInfo;

//----------------------------------------------------------------------------------------

// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Button,
//   Card,
//   Alert,
//   Spinner,
// } from "react-bootstrap";

// function ArtistInfo({ selectedartist, loginstate }) {
//   const [clickedartist, setClickedArtist] = useState(null);
//   const [loadingArtist, setLoadingArtist] = useState(true);
//   const [favorites, setFavorites] = useState([]);

//   const handlefavourities = async (clickedartist) => {};

//   useEffect(() => {
//     if (!selectedartist) return;

//     const id = selectedartist._links.self.href.split("/").pop();

//     const fetchArtistInfo = async () => {
//       try {
//         setLoadingArtist(true);
//         const response = await fetch(
//           `http://localhost:3000/artistdata?id=${id}`
//         );
//         if (!response.ok) throw new Error("Failed to fetch artist info");
//         const data = await response.json();
//         setClickedArtist(data);
//       } catch (error) {
//         console.error(error);
//         setClickedArtist(null);
//       } finally {
//         setLoadingArtist(false);
//       }
//     };
//     fetchArtistInfo();
//   }, [selectedartist]);

//   return (
//     <Container className="text-center mt-4">
//       <Row className="justify-content-center">
//         <Col xs={12} md={12} lg={10}>
//           {loadingArtist ? (
//             <Spinner animation="border" className="mt-3" />
//           ) : clickedartist ? (
//             <>
//               <h2
//                 className="fw-bold d-flex justify-content-center align-items-baseline"
//                 style={{ gap: "4px" }} // smaller gap
//               >
//                 {clickedartist.name}
//                 {loginstate === true && (
//                   <Button
//                     variant="link"
//                     className="p-0 m-0 border-0"
//                     style={{
//                       backgroundColor: "transparent",
//                       width: "24px",
//                       height: "24px",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       marginLeft: "4px", // moves icon closer to text
//                       paddingBottom: "2px", // slight vertical nudge
//                     }}
//                     onClick={handlefavourities(clickedartist)}
//                   >
//                     {favorites.includes(clickedartist.id) ? (
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="22"
//                         height="22"
//                         viewBox="0 0 16 16"
//                         fill="#FFD700"
//                       >
//                         <path d="M8 0.95l2.16 4.38 4.84.7-3.5 3.41.83 4.83L8 11.95l-4.33 2.3.83-4.83-3.5-3.41 4.84-.7L8 0.95z" />
//                       </svg>
//                     ) : (
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="22"
//                         height="22"
//                         viewBox="0 0 16 16"
//                         fill="none"
//                         stroke="black"
//                         strokeWidth="1.5"
//                       >
//                         <path d="M8 0.95l2.16 4.38 4.84.7-3.5 3.41.83 4.83L8 11.95l-4.33 2.3.83-4.83-3.5-3.41 4.84-.7L8 0.95z" />
//                       </svg>
//                     )}
//                   </Button>
//                 )}
//               </h2>

//               <h3 className="text-muted fs-5" style={{ marginTop: "-5px" }}>
//                 {clickedartist.nationality}, {clickedartist.birthday} -{" "}
//                 {clickedartist.deathday}
//               </h3>

//               <Container
//                 className="p-4 text-justify"
//                 style={{
//                   maxWidth: "1000px",
//                   fontFamily: "Arial, sans-serif",
//                   fontSize: "1rem",
//                   lineHeight: "1.4",
//                   wordSpacing: "0.1rem",
//                   textAlign: "justify",
//                 }}
//               >
//                 {clickedartist.biography
//                   ?.replace(/(\w+)-(\n|\s)?(\w+)/g, "$1$3")
//                   .split(/\n+/)
//                   .map((para, index) => (
//                     <p key={index} className="mb-3">
//                       {para}
//                     </p>
//                   ))}
//               </Container>
//             </>
//           ) : (
//             <Alert variant="danger">Artist data could not be loaded.</Alert>
//           )}
//         </Col>
//       </Row>
//     </Container>
//   );
// }

// export default ArtistInfo;
