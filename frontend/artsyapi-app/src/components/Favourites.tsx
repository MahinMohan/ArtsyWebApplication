import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { useNavigate } from "react-router-dom";

function Favourites(props) {
  const [favourites, setFavourites] = useState([]);
  const [tick, setTick] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // useEffect(() => {
  //   getFavourites();
  // }, []);

  const getFavourites = async () => {
    try {
      const res = await fetch("/api/getfavourites", {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setFavourites(data || []);
      } else {
        console.error("Failed to fetch favourites");
      }
    } catch (err) {
      console.error("Error fetching favourites:", err);
    }
  };

  const handleRemove = async (e, artistId) => {
    try {
      e.stopPropagation();
      const res = await fetch("/api/deletefavourites", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id: artistId }),
      });
      const data = await res.json();

      if (res.ok) {
        // setFavourites((prev) =>
        //   prev.filter((fav) => fav.artistId !== artistId)
        // );
        props.handlenotification({
          message: "Removed from favourites",
          variant: "danger",
        });
        props.setFavourites(data.user);
      }
    } catch (err) {
      console.error("Error removing favourite:", err);
    }
  };

  const getLiveTimeAgo = (timestamp) => {
    const now = dayjs();
    const added = dayjs(timestamp);
    const diffInSeconds = now.diff(added, "second");
    const diffInMinutes = now.diff(added, "minute");
    const diffInHours = now.diff(added, "hour");
    const diffInDays = now.diff(added, "day");

    if (diffInSeconds < 60) {
      return `${diffInSeconds} ${
        diffInSeconds === 1 ? "second" : "seconds"
      } ago`;
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} ${
        diffInMinutes === 1 ? "minute" : "minutes"
      } ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
    } else {
      return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
    }
  };

  const openartistcard = (artistid) => {
    navigate("/search/" + artistid);
  };

  return (
    <Container className="mt-4">
      <Row className="g-4">
        {props.Favourites.map((fav, idx) => (
          <Col key={idx} md={6} lg={4} xl={3}>
            <Card
              className="text-white shadow-sm border-0 bg-dark position-relative"
              style={{ height: "200px", cursor: "pointer" }}
              onClick={() => {
                openartistcard(fav.artistId);
              }}
            >
              <Card.Img
                src={
                  fav.image != "/assets/shared/missing_image.png"
                    ? fav.image
                    : "/artsy_logo.svg"
                }
                alt={fav.title}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  top: 0,
                  left: 0,
                  zIndex: 0,
                  filter: "blur(4px) brightness(0.6)",
                }}
              />

              <Card.Body className="d-flex flex-column justify-content-between position-relative z-1">
                <div>
                  <Card.Title className="fs-5 mb-0">{fav.title}</Card.Title>
                  <Card.Text className="mb-0">
                    {fav.birthyear} - {fav.deathyear}
                  </Card.Text>
                  <Card.Text className="mb-2">{fav.nationality}</Card.Text>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-white">
                    {getLiveTimeAgo(fav.addedAt)}
                  </small>
                  <Button
                    variant="link"
                    className="text-white p-0 text-decoration-underline"
                    onClick={(e) => handleRemove(e, fav.artistId)}
                  >
                    Remove
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Favourites;

// import React, { useEffect, useState } from "react";
// import { Container, Card, Row, Col, Button } from "react-bootstrap";
// import dayjs from "dayjs";
// import relativeTime from "dayjs/plugin/relativeTime";
// dayjs.extend(relativeTime);

// function Favourites() {
//   const [favourites, setFavourites] = useState([]);
//   const [tick, setTick] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => setTick((t) => t + 1), 1000);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     getFavourites();
//   }, []);

//   const getFavourites = async () => {
//     try {
//       const res = await fetch("/api/getfavourites", {
//         credentials: "include",
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setFavourites(data || []);
//       } else {
//         console.error("Failed to fetch favourites");
//       }
//     } catch (err) {
//       console.error("Error fetching favourites:", err);
//     }
//   };

//   const handleRemove = async (artistId) => {
//     try {
//       const res = await fetch("/api/deletefavourites", {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify({ id: artistId }),
//       });

//       if (res.ok) {
//         setFavourites((prev) =>
//           prev.filter((fav) => fav.artistId !== artistId)
//         );
//       }
//     } catch (err) {
//       console.error("Error removing favourite:", err);
//     }
//   };

//   const getLiveTimeAgo = (timestamp) => {
//     const now = dayjs();
//     const added = dayjs(timestamp);
//     const diffInSeconds = now.diff(added, "second");
//     const diffInMinutes = now.diff(added, "minute");

//     if (diffInSeconds < 60) {
//       return `${diffInSeconds} ${
//         diffInSeconds === 1 ? "second" : "seconds"
//       } ago`;
//     } else {
//       return `${diffInMinutes} ${
//         diffInMinutes === 1 ? "minute" : "minutes"
//       } ago`;
//     }
//   };

//   return (
//     <Container className="mt-4">
//       <Row className="g-4">
//         {favourites.map((fav, idx) => (
//           <Col key={idx} md={6} lg={4} xl={3}>
//             <Card
//               className="text-white shadow-sm border-0 bg-dark position-relative"
//               style={{ height: "200px" }}
//             >
//               {/* Background image with overlay */}
//               <Card.Img
//                 src={fav.image}
//                 alt={fav.title}
//                 style={{
//                   position: "absolute",
//                   width: "100%",
//                   height: "100%",
//                   objectFit: "cover",
//                   top: 0,
//                   left: 0,
//                   zIndex: 0,
//                   filter: "blur(4px) brightness(0.6)",
//                 }}
//               />
//               {/* Content */}
//               <Card.Body className="d-flex flex-column justify-content-between position-relative z-1">
//                 <div>
//                   <Card.Title className="fs-5 mb-0">{fav.title}</Card.Title>
//                   <Card.Text className="mb-0">
//                     {fav.birthyear} - {fav.deathyear}
//                   </Card.Text>
//                   <Card.Text className="mb-2">{fav.nationality}</Card.Text>
//                 </div>

//                 <div className="d-flex justify-content-between align-items-center">
//                   <small className="text-white">
//                     {getLiveTimeAgo(fav.addedAt)}
//                   </small>
//                   <Button
//                     variant="link"
//                     className="text-white p-0 text-decoration-underline"
//                     onClick={() => handleRemove(fav.artistId)}
//                   >
//                     Remove
//                   </Button>
//                 </div>
//               </Card.Body>
//             </Card>
//           </Col>
//         ))}
//       </Row>
//     </Container>
//   );
// }

// export default Favourites;
