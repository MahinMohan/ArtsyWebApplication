import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Alert,
  Spinner,
} from "react-bootstrap";

function Cardcontent({ selectedartist }) {
  const [clickedartist, setClickedArtist] = useState(null);
  const [artworks, setArtworks] = useState({ _embedded: { artworks: [] } });
  const [activeTab, setActiveTab] = useState("info");
  const [loadingArtist, setLoadingArtist] = useState(true);
  const [loadingArtworks, setLoadingArtworks] = useState(true);

  useEffect(() => {
    if (!selectedartist) return;

    const id = selectedartist._links.self.href.split("/").pop();

    const fetchArtistInfo = async () => {
      try {
        setLoadingArtist(true);
        const response = await fetch(
          `http://localhost:3000/artistdata?id=${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch artist info");
        const data = await response.json();
        setClickedArtist(data);
      } catch (error) {
        console.error(error);
        setClickedArtist(null);
      } finally {
        setLoadingArtist(false);
      }
    };

    const fetchArtworks = async () => {
      try {
        setLoadingArtworks(true);
        const response = await fetch(
          `http://localhost:3000/artworksdata?id=${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch artworks");
        const data = await response.json();
        setArtworks(data || { _embedded: { artworks: [] } });
      } catch (error) {
        console.error(error);
        setArtworks({ _embedded: { artworks: [] } });
      } finally {
        setLoadingArtworks(false);
      }
    };

    fetchArtistInfo();
    fetchArtworks();
  }, [selectedartist]);

  return (
    <Container className="mt-4 pb-5">
      <Row className="justify-content-center">
        <Col md={10} lg={9} xl={8} className="d-flex p-0">
          <Button
            variant={activeTab === "info" ? "primary" : "light"}
            className="flex-fill border rounded-0"
            onClick={() => setActiveTab("info")}
          >
            Artist Info
          </Button>
          <Button
            variant={activeTab === "artworks" ? "primary" : "light"}
            className="flex-fill border rounded-0"
            onClick={() => setActiveTab("artworks")}
          >
            Artworks
          </Button>
        </Col>
      </Row>

      {/* Artist Info */}
      {activeTab === "info" && (
        <Container className="text-center mt-4">
          <Row className="justify-content-center">
            <Col xs={12} md={12} lg={10}>
              {loadingArtist ? (
                <Spinner animation="border" className="mt-3" />
              ) : clickedartist ? (
                <>
                  <h2 className="fw-bold">{clickedartist.name}</h2>
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
                      ?.replace(/(\w+)-(\n|\s)?(\w+)/g, "$1$3")
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
      )}

      {/* Artworks Section */}
      {activeTab === "artworks" && (
        <Container className="text-center mt-3" style={{ maxWidth: "900px" }}>
          {loadingArtworks ? (
            <Spinner animation="border" className="mt-3" />
          ) : artworks._embedded.artworks.length > 0 ? (
            <Row className="justify-content-center">
              {artworks._embedded.artworks.map((artwork, index) => (
                <Col key={index} md={6} lg={3} className="mb-4 d-flex">
                  <Card className="w-100 shadow-sm border-0 rounded">
                    <Card.Img
                      variant="top"
                      src={artwork._links.thumbnail.href}
                      alt={artwork.title}
                      className="img-fluid rounded-top"
                      style={{
                        height: index % 2 === 0 ? "65%" : "55%",
                        objectFit: "cover",
                      }}
                    />
                    <Card.Body className="d-flex flex-column justify-content-between text-center p-2">
                      <div>
                        <Card.Title
                          className="fw-normal text-truncate"
                          style={{ fontSize: "16px" }}
                        >
                          {artwork.title}
                        </Card.Title>
                        <Card.Text
                          className="text-muted"
                          style={{ fontSize: "14px" }}
                        >
                          {artwork.date}
                        </Card.Text>
                      </div>
                    </Card.Body>
                    <Button
                      variant="light"
                      className="w-100 border-0 transition-all"
                      onMouseEnter={(e) =>
                        e.target.classList.add("bg-primary", "text-white")
                      }
                      onMouseLeave={(e) =>
                        e.target.classList.remove("bg-primary", "text-white")
                      }
                    >
                      View categories
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Alert
              variant="danger"
              className="text-center mx-auto w-100"
              style={{ maxWidth: "900px" }}
            >
              No artworks are present.
            </Alert>
          )}
        </Container>
      )}
    </Container>
  );
}

export default Cardcontent;

// import React, { useState, useEffect } from "react";
// import { Container, Row, Col, Button, Card, Alert } from "react-bootstrap";

// function Cardcontent({ selectedartist }) {
//   const [clickedartist, setClickedArtist] = useState(null);
//   const [artworks, setArtworks] = useState([]);
//   const [activeTab, setActiveTab] = useState("info");

//   useEffect(() => {
//     if (!selectedartist) return;

//     const selfLink = selectedartist._links.self.href;
//     const id = selfLink.slice(selfLink.lastIndexOf("/") + 1);

//     const fetchData = async () => {
//       try {
//         const artistResponse = await fetch(
//           `http://localhost:3000/artistdata?id=${id}`
//         );
//         const artistData = await artistResponse.json();
//         setClickedArtist(artistData);

//         const artworksResponse = await fetch(
//           `http://localhost:3000/artworksdata?id=${id}`
//         );
//         const artworksData = await artworksResponse.json();
//         setArtworks(artworksData);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [selectedartist]);

//   return (
//     <Container className="mt-4 pb-5">
//       <Row className="justify-content-center">
//         <Col md={10} lg={9} xl={8} className="d-flex p-0">
//           <Button
//             variant={activeTab === "info" ? "primary" : "light"}
//             className="flex-fill border rounded-0"
//             onClick={() => setActiveTab("info")}
//           >
//             Artist Info
//           </Button>
//           <Button
//             variant={activeTab === "artworks" ? "primary" : "light"}
//             className="flex-fill border rounded-0"
//             onClick={() => setActiveTab("artworks")}
//           >
//             Artworks
//           </Button>
//         </Col>
//       </Row>

//       {activeTab === "info" && clickedartist && (
//         <Container className="text-center mt-4">
//           <Row className="justify-content-center">
//             <Col xs={12} md={12} lg={10}>
//               <h2 className="fw-bold">{clickedartist.name}</h2>
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
//                   .replace(/(\w+)-(\n|\s)?(\w+)/g, "$1$3")
//                   .split(/\n+/)
//                   .map((para, index) => (
//                     <p key={index} className="mb-3">
//                       {para}
//                     </p>
//                   ))}
//               </Container>
//             </Col>
//           </Row>
//         </Container>
//       )}

//       {activeTab === "artworks" && (
//         <Container className="text-center mt-3" style={{ maxWidth: "900px" }}>
//           {/* Check if there are artworks */}
//           {artworks && artworks._embedded?.artworks?.length > 0 ? (
//             <Row className="justify-content-center">
//               {artworks._embedded.artworks.map((artwork, index) => (
//                 <Col key={index} md={6} lg={3} className="mb-4 d-flex">
//                   <Card className="w-100 shadow-sm border-0 rounded">
//                     <Card.Img
//                       variant="top"
//                       src={artwork._links.thumbnail.href}
//                       alt={artwork.title}
//                       className="img-fluid rounded-top"
//                       style={{
//                         height: index % 2 === 0 ? "65%" : "55%",
//                         objectFit: "cover",
//                       }}
//                     />
//                     <Card.Body className="d-flex flex-column justify-content-between text-center p-2">
//                       <div>
//                         <Card.Title
//                           className="fw-normal text-truncate"
//                           style={{ fontSize: "16px" }}
//                         >
//                           {artwork.title}
//                         </Card.Title>
//                         <Card.Text
//                           className="text-muted"
//                           style={{ fontSize: "14px" }}
//                         >
//                           {artwork.date}
//                         </Card.Text>
//                       </div>
//                     </Card.Body>
//                     <Button
//                       variant="light"
//                       className="w-100 border-0 transition-all"
//                       onMouseEnter={(e) =>
//                         e.target.classList.add("bg-primary", "text-white")
//                       }
//                       onMouseLeave={(e) =>
//                         e.target.classList.remove("bg-primary", "text-white")
//                       }
//                     >
//                       View categories
//                     </Button>
//                   </Card>
//                 </Col>
//               ))}
//             </Row>
//           ) : (
//             /* Show alert if no artworks exist */
//             <Alert
//               variant="danger"
//               className="text-center mx-auto w-100"
//               style={{ maxWidth: "900px" }}
//             >
//               No artworks are present.
//             </Alert>
//           )}
//         </Container>
//       )}
//     </Container>
//   );
// }

// export default Cardcontent;
