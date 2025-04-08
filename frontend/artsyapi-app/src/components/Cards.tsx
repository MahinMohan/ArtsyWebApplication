import React, { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import ArtistInfo from "./ArtistInfo";
import Artworks from "./Artworks";
import Similarartists from "./Similarartists";
import { useEffect } from "react";
import { Star, StarFill } from "react-bootstrap-icons";

const Cards = ({
  artistdata,
  isLoggedIn,
  loggedinuser,
  artistid,
  setFavourites,
  handlenotification,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [artworks, setArtworks] = useState({ _embedded: { artworks: [] } });
  const [artistinfo, setartistinfo] = useState(null);
  const [selectedartist, setselectedartist] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const [artistdattoinfo, setartistdatatoinfo] = useState({});
  const [isLoadingArtistInfo, setIsLoadingArtistInfo] = useState(false);
  const [isLoadingArtworks, setIsLoadingArtworks] = useState(false);
  // const [favourites, setFavourites] = useState(loggedinuser?.favourites || []);

  // useEffect(() => {
  //   if (loggedinuser?.favourites) {
  //     setFavourites(loggedinuser.favourites);
  //   }
  // }, [loggedinuser?.favourites]);
  console.log("session=", sessionStorage.getItem("artist_id"));

  useEffect(() => {
    console.log(artistid);
    if (!artistid) return;

    const fetchData = async () => {
      const id = artistid;
      setIsLoadingArtistInfo(true);
      setIsLoadingArtworks(true);
      // setselectedartist({
      //   type: "artist",
      //   title: "Pablo Picasso",
      //   description: null,
      //   og_type: "artist",
      //   _links: {
      //     self: {
      //       href: "https://api.artsy.net/api/artists/4d8b928b4eb68a1b2c0001f2",
      //     },
      //     permalink: { href: "https://www.artsy.net/artist/pablo-picasso" },
      //     thumbnail: {
      //       href: "https://d32dm0rphc51dk.cloudfront.net/i3rCA3IaKE-cLBnc-U5swQ/square.jpg",
      //     },
      //   },
      // });
      try {
        const response1 = await fetch(`/api/artistdata?id=${id}`);
        console.log(response1);
        if (!response1.ok) throw new Error("Failed to fetch artist info");
        const data = await response1.json();
        console.log(data);
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
    fetchData();
  }, [artistid]);

  const handleCardClick = async (artist) => {
    setselectedartist(artist);
    console.log(JSON.stringify(artist));
    if (!artist) return;

    const id = artist._links.self.href.split("/").pop();
    sessionStorage.setItem("artist_id", id);
    setIsLoadingArtistInfo(true);
    setIsLoadingArtworks(true);
    try {
      const response1 = await fetch(`api/artistdata?id=${id}`);
      if (!response1.ok) throw new Error("Failed to fetch artist info");
      const data = await response1.json();
      setartistinfo(data);
      console.log(data);
      setIsLoadingArtistInfo(false);

      const response2 = await fetch(`api/artworksdata?id=${id}`);
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
    console.log(artist);
    const response1 = await fetch(`api/artistdata?id=${id}`);
    if (!response1.ok) throw new Error("Failed to fetch artist info");
    const artistdata1 = await response1.json();
    if (!artistdata1) {
      console.error("Artist info not loaded yet");
      return;
    }

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
      const res = await fetch("api/addtofavourites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(artistdata),
      });

      const data = await res.json();
      // setFavourites((prev) => [...prev, { artistId: id, title: artist.title }]);
      setFavourites(data.user);
    } catch (error) {
      console.error("Error adding to favourites:", error);
    }
  };

  const deleteFromFavourites = async (artist) => {
    try {
      const artistId = artist._links?.self?.href.split("/").pop();

      const res = await fetch("api/deletefavourites", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
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
      const isFavorited = loggedinuser?.favourites?.some(
        (fav) => fav.artistId === artistId
      );

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
        // setFavourites((prev) => [
        //   ...prev,
        //   { artistId: artistId, title: artist.title },
        // ]);
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

  return (
    <>
      <Container className="mt-4">
        <div
          className="d-flex gap-1 overflow-auto py-3 px-2"
          style={{
            whiteSpace: "nowrap",
            width: "950px",
            margin: "0 auto",
            paddingTop: "0",
          }}
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
                onClick={() => handleCardClick(artist)}
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="#FFD700"
                      >
                        <path d="M8 0.95l2.16 4.38 4.84.7-3.5 3.41.83 4.83L8 11.95l-4.33 2.3.83-4.83-3.5-3.41 4.84-.7L8 0.95z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="white"
                        strokeWidth="1.5"
                      >
                        <path d="M8 0.95l2.16 4.38 4.84.7-3.5 3.41.83 4.83L8 11.95l-4.33 2.3.83-4.83-3.5-3.41 4.84-.7L8 0.95z" />
                      </svg>
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
                      hoveredIndex === index ? "#17479E" : "#112B3C",
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

      {artistinfo && (
        <Container className="mt-4 pb-5">
          <Row className="justify-content-center">
            <Col md={10} lg={9} xl={8} className="d-flex p-0">
              <Button
                variant={activeTab === "info" ? "primary" : "light"}
                className="flex-fill border rounded-0"
                onClick={() => setActiveTab("info")}
                style={{
                  backgroundColor: activeTab === "info" ? "#17479E" : "#FFFFFF",
                  color: activeTab === "info" ? "#FFFFFF" : "#17479E",
                  borderRadius: "0px",
                }}
              >
                Artist Info
              </Button>
              <Button
                variant={activeTab === "artworks" ? "primary" : "light"}
                className="flex-fill border rounded-0"
                onClick={() => setActiveTab("artworks")}
                style={{
                  backgroundColor:
                    activeTab === "artworks" ? "#17479E" : "#FFFFFF",
                  color: activeTab === "artworks" ? "#FFFFFF" : "#17479E",
                  borderRadius: "0px",
                }}
              >
                Artworks
              </Button>
            </Col>
          </Row>

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
        </Container>
      )}

      {isLoggedIn === true ? (
        <Similarartists
          selectedartist={selectedartist}
          loggedinuser={loggedinuser}
          favourites={loggedinuser?.favourites}
          setFavourites={setFavourites}
          handlenotification={handlenotification}
        />
      ) : null}
    </>
  );
};

export default Cards;

//**************************************************************************************** */
// import React, { useState } from "react";
// import { Container, Row, Col, Card, Button } from "react-bootstrap";
// import ArtistInfo from "./ArtistInfo";
// import Artworks from "./Artworks";
// import Similarartists from "./Similarartists";

// const Cards = ({ artistdata, isLoggedIn, loggedinuser }) => {
//   const [hoveredIndex, setHoveredIndex] = useState(null);
//   const [artworks, setArtworks] = useState({ _embedded: { artworks: [] } });
//   const [artistinfo, setartistinfo] = useState(null);
//   const [selectedartist, setselectedartist] = useState(null);
//   const [activeTab, setActiveTab] = useState("info");
//   const [artistdattoinfo, setartistdatatoinfo] = useState({});

//   console.log("Loginstateinthecardscomponent=", isLoggedIn);

//   const handleCardClick = async (artist) => {
//     setselectedartist(artist);
//     if (!artist) return;

//     const id = artist._links.self.href.split("/").pop();
//     try {
//       const response1 = await fetch(`api/artistdata?id=${id}`);
//       if (!response1.ok) throw new Error("Failed to fetch artist info");
//       const data = await response1.json();
//       setartistinfo(data);

//       const response2 = await fetch(`api/artworksdata?id=${id}`);
//       if (!response2.ok) throw new Error("Failed to fetch artworks");
//       const data2 = await response2.json();
//       setArtworks(data2 || { _embedded: { artworks: [] } });
//     } catch (error) {
//       console.error(error);
//       setArtworks({ _embedded: { artworks: [] } });
//       setartistinfo(null);
//     } finally {
//     }
//   };

//   const addToFavourites = async (artist) => {
//     const id = artist._links?.self?.href.split("/").pop();
//     console.log("Artist=", artist);
//     try {
//       const artistdata = {
//         artistId: id,
//         title: artist.title,
//         birthyear: artistinfo.birthday,
//         deathyear: artistinfo.deathday,
//         nationality: artistinfo.nationality,
//       };
//       setartistdatatoinfo(artistdata);
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
//     <>
//       <Container className="mt-4">
//         <div
//           className="d-flex gap-1 overflow-auto py-3 px-2"
//           style={{
//             whiteSpace: "nowrap",
//             width: "950px",
//             margin: "0 auto",
//             paddingTop: "0",
//           }}
//         >
//           {artistdata.map((artist, index) => {
//             const artistId = artist._links?.self?.href.split("/").pop();
//             const isFavorited = loggedinuser?.favourites?.some(
//               (fav) => fav.artistId === artistId
//             );

//             return (
//               <Card
//                 key={index}
//                 className="text-white bg-dark position-relative"
//                 style={{
//                   width: "185px",
//                   height: "250px",
//                   flex: "0 0 auto",
//                   borderRadius: "5px",
//                   overflow: "hidden",
//                   cursor: "pointer",
//                 }}
//                 onMouseEnter={() => setHoveredIndex(index)}
//                 onMouseLeave={() => setHoveredIndex(null)}
//                 onClick={() => handleCardClick(artist)}
//               >
//                 {isLoggedIn && (
//                   <Button
//                     variant="link"
//                     className="position-absolute top-0 end-0 m-2 p-0 border-0"
//                     style={{
//                       width: "28px",
//                       height: "28px",
//                       borderRadius: "50%",
//                       backgroundColor: "#004AAD",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       zIndex: 2,
//                     }}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handlefavourities(artist);
//                     }}
//                   >
//                     {isFavorited ? (
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="16"
//                         height="16"
//                         viewBox="0 0 16 16"
//                         fill="#FFD700"
//                       >
//                         <path d="M8 0.95l2.16 4.38 4.84.7-3.5 3.41.83 4.83L8 11.95l-4.33 2.3.83-4.83-3.5-3.41 4.84-.7L8 0.95z" />
//                       </svg>
//                     ) : (
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="16"
//                         height="16"
//                         viewBox="0 0 16 16"
//                         fill="none"
//                         stroke="white"
//                         strokeWidth="1.5"
//                       >
//                         <path d="M8 0.95l2.16 4.38 4.84.7-3.5 3.41.83 4.83L8 11.95l-4.33 2.3.83-4.83-3.5-3.41 4.84-.7L8 0.95z" />
//                       </svg>
//                     )}
//                   </Button>
//                 )}

//                 <Card.Img
//                   src={artist._links.thumbnail.href}
//                   onError={(e) => (e.target.src = "/artsy_logo.svg")}
//                   className="w-100"
//                   style={{
//                     height: "240px",
//                     width: "150px",
//                     objectFit: "cover",
//                     borderRadius: "0px",
//                   }}
//                 />

//                 <Card.Body
//                   style={{
//                     backgroundColor:
//                       hoveredIndex === index ? "#0E5692" : "#112B3C",
//                     padding: "10px",
//                   }}
//                 >
//                   <h6 className="mb-0">{artist.title}</h6>
//                 </Card.Body>
//               </Card>
//             );
//           })}
//         </div>
//       </Container>

//       {artistinfo && (
//         <Container className="mt-4 pb-5">
//           <Row className="justify-content-center">
//             <Col md={10} lg={9} xl={8} className="d-flex p-0">
//               <Button
//                 variant={activeTab === "info" ? "primary" : "light"}
//                 className="flex-fill border rounded-0"
//                 onClick={() => setActiveTab("info")}
//               >
//                 Artist Info
//               </Button>
//               <Button
//                 variant={activeTab === "artworks" ? "primary" : "light"}
//                 className="flex-fill border rounded-0"
//                 onClick={() => setActiveTab("artworks")}
//               >
//                 Artworks
//               </Button>
//             </Col>
//           </Row>

//           {activeTab === "info" && (
//             <ArtistInfo
//               clickedartist={artistinfo}
//               loginstate={isLoggedIn}
//               loggedinuser={loggedinuser}
//               artistdata={artistdattoinfo}
//             />
//           )}
//           {activeTab === "artworks" && <Artworks artworks={artworks} />}
//         </Container>
//       )}

//       {isLoggedIn === true ? (
//         <Similarartists
//           selectedartist={selectedartist}
//           loggedinuser={loggedinuser}
//         />
//       ) : null}
//     </>
//   );
// };

// export default Cards;
//**************************************************************************************************** */

// import React, { useState, useEffect } from "react";
// import { Container, Row, Col, Card, Button } from "react-bootstrap";
// import ArtistInfo from "./ArtistInfo";
// import Artworks from "./Artworks";

// const Cards = ({ artistdata, isLoggedIn }) => {
//   const [hoveredIndex, setHoveredIndex] = useState(null);
//   const [selectedartist, setselectedartist] = useState(null);
//   const [activeTab, setActiveTab] = useState("info");
//   const [user, setUser] = useState(null);
//   const [favorites, setFavorites] = useState([]);

//   const loginState = isLoggedIn?.isLoggedIn === true;
//   console.log("user logged in?=", loginState);

//   const handleCardClick = (artist) => {
//     setselectedartist(artist);
//   };

//   const handlefavourities = async (artist) => {
//     try {
//     } catch (error) {
//       console.error("Error handling favorites:", error);
//     }
//   };

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await fetch("http://localhost:3000/me");
//         if (!response.ok) throw new Error("Failed to fetch user info");

//         const data = await response.json();
//         setUser(data.user);
//         console.log("Logged in user data", data);
//       } catch (error) {
//         console.error("Error fetching user:", error);
//         setUser(null);
//       }
//     };
//     fetchUser();
//   }, []);

//   return (
//     <>
//       <Container className="mt-4">
//         <div
//           className="d-flex gap-1 overflow-auto py-3 px-2"
//           style={{
//             whiteSpace: "nowrap",
//             width: "950px",
//             margin: "0 auto",
//             paddingTop: "0",
//           }}
//         >
//           {artistdata.map((artist, index) => (
//             <Card
//               key={index}
//               className="text-white bg-dark position-relative"
//               style={{
//                 width: "185px",
//                 height: "250px",
//                 flex: "0 0 auto",
//                 borderRadius: "5px",
//                 overflow: "hidden",
//                 cursor: "pointer",
//               }}
//               onMouseEnter={() => setHoveredIndex(index)}
//               onMouseLeave={() => setHoveredIndex(null)}
//               onClick={() => handleCardClick(artist)}
//             >
//               {loginState && (
//                 <Button
//                   variant="link"
//                   className="position-absolute top-0 end-0 m-2 p-0 border-0"
//                   style={{
//                     width: "28px",
//                     height: "28px",
//                     borderRadius: "50%",
//                     backgroundColor: "#004AAD",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     zIndex: 2,
//                   }}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handlefavourities(artist);
//                   }}
//                 >
//                   {favorites.includes(index) ? (
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="16"
//                       height="16"
//                       viewBox="0 0 16 16"
//                       fill="#FFD700"
//                     >
//                       <path d="M8 0.95l2.16 4.38 4.84.7-3.5 3.41.83 4.83L8 11.95l-4.33 2.3.83-4.83-3.5-3.41 4.84-.7L8 0.95z" />
//                     </svg>
//                   ) : (
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="16"
//                       height="16"
//                       viewBox="0 0 16 16"
//                       fill="none"
//                       stroke="white"
//                       strokeWidth="1.5"
//                     >
//                       <path d="M8 0.95l2.16 4.38 4.84.7-3.5 3.41.83 4.83L8 11.95l-4.33 2.3.83-4.83-3.5-3.41 4.84-.7L8 0.95z" />
//                     </svg>
//                   )}
//                 </Button>
//               )}

//               <Card.Img
//                 src={artist._links.thumbnail.href}
//                 onError={(e) => (e.target.src = "/artsy_logo.svg")}
//                 className="w-100"
//                 style={{
//                   height: "240px",
//                   width: "150px",
//                   objectFit: "cover",
//                   borderRadius: "0px",
//                 }}
//               />

//               <Card.Body
//                 style={{
//                   backgroundColor:
//                     hoveredIndex === index ? "#0E5692" : "#112B3C",
//                   padding: "10px",
//                 }}
//               >
//                 <h6 className="mb-0">{artist.title}</h6>
//               </Card.Body>
//             </Card>
//           ))}
//         </div>
//       </Container>

//       {selectedartist && (
//         <Container className="mt-4 pb-5">
//           <Row className="justify-content-center">
//             <Col md={10} lg={9} xl={8} className="d-flex p-0">
//               <Button
//                 variant={activeTab === "info" ? "primary" : "light"}
//                 className="flex-fill border rounded-0"
//                 onClick={() => setActiveTab("info")}
//               >
//                 Artist Info
//               </Button>
//               <Button
//                 variant={activeTab === "artworks" ? "primary" : "light"}
//                 className="flex-fill border rounded-0"
//                 onClick={() => setActiveTab("artworks")}
//               >
//                 Artworks
//               </Button>
//             </Col>
//           </Row>

//           {activeTab === "info" && (
//             <ArtistInfo
//               selectedartist={selectedartist}
//               loginstate={loginState}
//             />
//           )}
//           {activeTab === "artworks" && (
//             <Artworks selectedartist={selectedartist} />
//           )}
//         </Container>
//       )}
//     </>
//   );
// };

// export default Cards;
