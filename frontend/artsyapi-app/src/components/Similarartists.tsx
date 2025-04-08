import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

function Similarartists({
  selectedartist,
  loggedinuser,
  favourites,
  setFavourites,
  handlenotification,
}) {
  const [similarartists, setsimilarartists] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

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
        <div style={{ width: "925px", margin: "0 auto" }}>
          <h5 style={{ marginBottom: "0px" }}>Similar Artists</h5>
        </div>
      )}

      <div
        className="d-flex gap-2 overflow-auto py-2 px-2"
        style={{
          whiteSpace: "nowrap",
          width: "925px",
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
                    hoveredIndex === index ? "#0E5692" : "#112B3C",
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

// import React, { useEffect, useState } from "react";
// import { Button } from "react-bootstrap";

// function Similarartists({ selectedartist, loggedinuser }) {
//   const [similarartists, setsimilarartists] = useState([]);
//   const [hoveredIndex, setHoveredIndex] = useState(null);

//   useEffect(() => {
//     if (!selectedartist) return;

//     const id = selectedartist._links.self.href.split("/").pop();

//     const fetchsimilarartists = async () => {
//       try {
//         const response = await fetch(`api/similarartists?id=${id}`);
//         if (!response.ok) throw new Error("Failed to fetch artist info");

//         const data = await response.json();
//         const artists = data._embedded?.artists || [];
//         console.log("similarartists=", artists);
//         setsimilarartists(artists);
//       } catch (error) {
//         console.error(error);
//         setsimilarartists([]);
//       }
//     };

//     fetchsimilarartists();
//   }, [selectedartist]);

//   const addToFavourites = async (artist) => {
//     const id = artist._links?.self?.href.split("/").pop();
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
//     const artistId = artist._links?.self?.href.split("/").pop();
//     try {
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
//     const artistId = artist._links?.self?.href.split("/").pop();
//     const isFavorited = loggedinuser?.favourites?.some(
//       (fav) => fav.artistId === artistId
//     );

//     try {
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
//     <div className="container mt-0" style={{ paddingBottom: "50px" }}>
//       {similarartists.length > 0 && (
//         <div
//           style={{
//             width: "925px",
//             margin: "0 auto",
//           }}
//         >
//           <h5 style={{ marginBottom: "0px" }}>Similar Artists</h5>
//         </div>
//       )}

//       <div
//         className="d-flex gap-2 overflow-auto py-2 px-2"
//         style={{
//           whiteSpace: "nowrap",
//           width: "925px",
//           margin: "0 auto",
//           paddingTop: "0",
//         }}
//       >
//         {similarartists.length > 0 &&
//           similarartists.map((artist, index) => {
//             const artistId = artist._links?.self?.href.split("/").pop();
//             const isFavorited = loggedinuser?.favourites?.some(
//               (fav) => fav.artistId === artistId
//             );

//             return (
//               <div
//                 key={index}
//                 className="card text-white bg-dark position-relative"
//                 style={{
//                   width: "180px",
//                   height: "250px",
//                   flex: "0 0 auto",
//                   borderRadius: "5px",
//                   overflow: "hidden",
//                   cursor: "pointer",
//                 }}
//                 onMouseEnter={() => setHoveredIndex(index)}
//                 onMouseLeave={() => setHoveredIndex(null)}
//               >
//                 {/* Star button */}
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
//                   {isFavorited ? (
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

//                 <img
//                   src={artist._links.thumbnail?.href}
//                   onError={(e) => (e.target.src = "/artsy_logo.svg")}
//                   className="w-100"
//                   style={{
//                     height: "260px",
//                     width: "150px",
//                     objectFit: "cover",
//                   }}
//                   alt={artist.name}
//                 />
//                 <div
//                   className="card-body"
//                   style={{
//                     backgroundColor:
//                       hoveredIndex === index ? "#0E5692" : "#112B3C",
//                     padding: "10px",
//                     height: "40px",
//                   }}
//                 >
//                   <h6 className="mb-0">{artist.name}</h6>
//                 </div>
//               </div>
//             );
//           })}
//       </div>
//     </div>
//   );
// }

// export default Similarartists;

//************************************************************************************* */

// import React, { useEffect, useState } from "react";

// function Similarartists({ selectedartist, loggedinuser }) {
//   const [similarartists, setsimilarartists] = useState([]);
//   const [hoveredIndex, setHoveredIndex] = useState(null);

//   useEffect(() => {
//     if (!selectedartist) return;

//     const id = selectedartist._links.self.href.split("/").pop();

//     const fetchsimilarartists = async () => {
//       try {
//         const response = await fetch(`api/similarartists?id=${id}`);
//         if (!response.ok) throw new Error("Failed to fetch artist info");

//         const data = await response.json();
//         const artists = data._embedded?.artists || [];
//         console.log("similarartists=", artists);
//         setsimilarartists(artists);
//       } catch (error) {
//         console.error(error);
//         setsimilarartists([]);
//       }
//     };

//     fetchsimilarartists();
//   }, [selectedartist]);

//   return (
//     <div className="container mt-0" style={{ paddingBottom: "50px" }}>
//       {similarartists.length > 0 && (
//         <div
//           style={{
//             width: "925px",
//             margin: "0 auto",
//           }}
//         >
//           <h5 style={{ marginBottom: "0px" }}>Similar Artists</h5>
//         </div>
//       )}

//       <div
//         className="d-flex gap-2 overflow-auto py-2 px-2"
//         style={{
//           whiteSpace: "nowrap",
//           width: "925px",
//           margin: "0 auto",
//           paddingTop: "0",
//         }}
//       >
//         {similarartists.length > 0 &&
//           similarartists.map((artist, index) => (
//             <div
//               key={index}
//               className="card text-white bg-dark position-relative"
//               style={{
//                 width: "180px",
//                 height: "250px",
//                 flex: "0 0 auto",
//                 borderRadius: "5px",
//                 overflow: "hidden",
//                 cursor: "pointer",
//               }}
//               onMouseEnter={() => setHoveredIndex(index)}
//               onMouseLeave={() => setHoveredIndex(null)}
//             >
//               <img
//                 src={artist._links.thumbnail?.href}
//                 onError={(e) => (e.target.src = "/artsy_logo.svg")}
//                 className="w-100"
//                 style={{
//                   height: "260px",
//                   width: "150px",
//                   objectFit: "cover",
//                 }}
//                 alt={artist.name}
//               />
//               <div
//                 className="card-body"
//                 style={{
//                   backgroundColor:
//                     hoveredIndex === index ? "#0E5692" : "#112B3C",
//                   padding: "10px",
//                   height: "40px",
//                 }}
//               >
//                 <h6 className="mb-0">{artist.name}</h6>
//               </div>
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// }

// export default Similarartists;

// // import React, { useEffect, useState } from "react";

// // function Similarartists({ selectedartist }) {
// //   const [similarartists, setsimilarartists] = useState([]);
// //   const [hoveredIndex, setHoveredIndex] = useState(null);

// //   useEffect(() => {
// //     if (!selectedartist) return;

// //     const id = selectedartist._links.self.href.split("/").pop();

// //     const fetchsimilarartists = async () => {
// //       try {
// //         const response = await fetch(
// //           `http://localhost:3000/similarartists?id=${id}`
// //         );
// //         if (!response.ok) throw new Error("Failed to fetch artist info");

// //         const data = await response.json();
// //         const artists = data._embedded?.artists || [];
// //         console.log("similarartists=", artists);
// //         setsimilarartists(artists);
// //       } catch (error) {
// //         console.error(error);
// //         setsimilarartists([]);
// //       }
// //     };

// //     fetchsimilarartists();
// //   }, [selectedartist]);

// //   return (
// //     <div className="container mt-4">
// //       <div
// //         className="d-flex gap-1 overflow-auto py-3 px-2"
// //         style={{
// //           whiteSpace: "nowrap",
// //           width: "925px",
// //           margin: "0 auto",
// //           paddingTop: "0",
// //         }}
// //       >
// //         {similarartists.length > 0
// //           ? similarartists.map((artist, index) => (
// //               <div
// //                 key={index}
// //                 className="card text-white bg-dark position-relative"
// //                 style={{
// //                   width: "180px",
// //                   height: "250px",
// //                   flex: "0 0 auto",
// //                   borderRadius: "5px",
// //                   overflow: "hidden",
// //                   cursor: "pointer",
// //                 }}
// //                 onMouseEnter={() => setHoveredIndex(index)}
// //                 onMouseLeave={() => setHoveredIndex(null)}
// //               >
// //                 <img
// //                   src={artist._links.thumbnail?.href}
// //                   onError={(e) => (e.target.src = "/artsy_logo.svg")}
// //                   className="w-100"
// //                   style={{
// //                     height: "240px",
// //                     width: "150px",
// //                     objectFit: "cover",
// //                   }}
// //                   alt={artist.name}
// //                 />
// //                 <div
// //                   className="card-body"
// //                   style={{
// //                     backgroundColor:
// //                       hoveredIndex === index ? "#0E5692" : "#112B3C",
// //                     padding: "10px",
// //                     height: "70px",
// //                   }}
// //                 >
// //                   <h6 className="mb-0">{artist.name}</h6>
// //                 </div>
// //               </div>
// //             ))
// //           : null}
// //       </div>
// //     </div>
// //   );
// // }

// // export default Similarartists;
