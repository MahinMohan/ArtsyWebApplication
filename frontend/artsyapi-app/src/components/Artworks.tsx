import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Spinner,
  Button,
  Modal,
} from "react-bootstrap";

const Artworks = ({ artworks, isLoading }) => {
  const [modaldata, setModalData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [loadingModal, setLoadingModal] = useState(false);

  const handleShowModal = async (artwork) => {
    setSelectedArtwork(artwork);
    setShowModal(true);
    setLoadingModal(true);

    try {
      const id = artwork.id;
      const response = await fetch(`api/genesdata?id=${id}`);
      if (!response.ok) throw new Error("Failed to fetch modal info");
      const data = await response.json();
      setModalData(data);
    } catch (error) {
      console.error(error);
      setModalData(null);
    } finally {
      setLoadingModal(false);
    }
  };

  return (
    <>
      <Container className="text-center mt-3" style={{ maxWidth: "1000px" }}>
        {isLoading ? (
          <Spinner
            animation="border"
            role="status"
            style={{
              color: "#004AAD",
              width: "40px",
              height: "40px",
              marginTop: "20px",
            }}
          />
        ) : artworks._embedded.artworks.length > 0 ? (
          <Row className="justify-content-center">
            {artworks._embedded.artworks.map((artwork, index) => (
              <Col key={index} md={6} lg={3} className="mb-4 d-flex">
                <Card
                  className="shadow-sm border-0 rounded"
                  style={{
                    width: "260px",
                    height: index % 2 === 0 ? "460px" : "380px",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                  }}
                >
                  <Card.Img
                    variant="top"
                    src={artwork._links.thumbnail.href}
                    alt={artwork.title}
                    className="img-fluid"
                    style={{
                      height: index % 2 === 0 ? "70%" : "60%",
                      objectFit: "cover",
                    }}
                  />
                  <Card.Body
                    className="d-flex flex-column justify-content-center text-center p-1"
                    style={{ minHeight: "40px", paddingBottom: "5px" }}
                  >
                    <Card.Title
                      className="fw-normal"
                      style={{
                        fontSize: "14px",
                        whiteSpace: "normal",
                        overflow: "visible",
                        textAlign: "center",
                        marginBottom: "0px",
                      }}
                    >
                      {artwork.title}, {artwork.date}
                    </Card.Title>
                  </Card.Body>
                  <Button
                    variant="light"
                    className="w-100 border-0 transition-all"
                    style={{ fontSize: "14px", padding: "8px 0" }}
                    onClick={() => handleShowModal(artwork)}
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
          <Alert variant="danger" className="text-center mx-auto w-100">
            No artworks are present.
          </Alert>
        )}
      </Container>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="xl"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Modal.Header closeButton className="d-flex align-items-center">
          {selectedArtwork && (
            <div className="d-flex align-items-center">
              <img
                src={selectedArtwork._links.thumbnail.href}
                alt={selectedArtwork.title}
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                  marginRight: "10px",
                  borderRadius: "5px",
                }}
              />
              <div>
                <h5 className="mb-0 fw-bold">{selectedArtwork.title}</h5>
                <p className="text-muted mb-0">{selectedArtwork.date}</p>
              </div>
            </div>
          )}
        </Modal.Header>
        <Modal.Body>
          {loadingModal ? (
            <div className="text-center my-4">
              <Spinner
                animation="border"
                role="status"
                style={{ color: "#004AAD", width: "40px", height: "40px" }}
              />
            </div>
          ) : modaldata && modaldata._embedded.genes.length > 0 ? (
            <Container fluid>
              <Row className="justify-content-center">
                {modaldata._embedded.genes.map((gene, index) => (
                  <Col key={index} md={6} lg={3} className="mb-3">
                    <Card
                      className="shadow-sm border-0"
                      style={{
                        width: "220px",
                        height: "280px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        textAlign: "center",
                      }}
                    >
                      <Card.Img
                        variant="top"
                        src={gene._links.thumbnail.href}
                        alt={gene.name}
                        className="img-fluid"
                        style={{
                          height: "200px",
                          objectFit: "cover",
                          borderTopLeftRadius: "8px",
                          borderTopRightRadius: "8px",
                        }}
                      />
                      <Card.Body className="text-center p-2">
                        <Card.Title className="fs-6 fw-semibold">
                          {gene.name}
                        </Card.Title>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Container>
          ) : (
            <Alert variant="warning" className="text-center">
              No categories available.
            </Alert>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Artworks;

// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Alert,
//   Spinner,
//   Button,
//   Modal,
// } from "react-bootstrap";

// const Artworks = ({ artworks }) => {
//   const [modaldata, setModalData] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedArtwork, setSelectedArtwork] = useState(null);

//   const handleShowModal = async (artwork) => {
//     setSelectedArtwork(artwork);
//     setShowModal(true);

//     try {
//       const id = artwork.id;
//       const response = await fetch(`api/genesdata?id=${id}`);
//       if (!response.ok) throw new Error("Failed to fetch modal info");
//       const data = await response.json();
//       setModalData(data);
//     } catch (error) {
//       console.error(error);
//       setModalData(null);
//     }
//   };

//   return (
//     <>
//       <Container className="text-center mt-3" style={{ maxWidth: "1000px" }}>
//         {artworks._embedded.artworks.length > 0 ? (
//           <Row className="justify-content-center">
//             {artworks._embedded.artworks.map((artwork, index) => (
//               <Col key={index} md={6} lg={3} className="mb-4 d-flex">
//                 <Card
//                   className="shadow-sm border-0 rounded"
//                   style={{
//                     width: "260px",
//                     height: index % 2 === 0 ? "460px" : "380px",
//                     display: "flex",
//                     flexDirection: "column",
//                     overflow: "hidden",
//                   }}
//                 >
//                   <Card.Img
//                     variant="top"
//                     src={artwork._links.thumbnail.href}
//                     alt={artwork.title}
//                     className="img-fluid"
//                     style={{
//                       height: index % 2 === 0 ? "70%" : "60%",
//                       objectFit: "cover",
//                     }}
//                   />
//                   <Card.Body
//                     className="d-flex flex-column justify-content-center text-center p-1"
//                     style={{ minHeight: "40px", paddingBottom: "5px" }}
//                   >
//                     <Card.Title
//                       className="fw-normal"
//                       style={{
//                         fontSize: "14px",
//                         whiteSpace: "normal",
//                         overflow: "visible",
//                         textAlign: "center",
//                         marginBottom: "0px",
//                       }}
//                     >
//                       {artwork.title}, {artwork.date}
//                     </Card.Title>
//                   </Card.Body>
//                   <Button
//                     variant="light"
//                     className="w-100 border-0 transition-all"
//                     style={{ fontSize: "14px", padding: "8px 0" }}
//                     onClick={() => handleShowModal(artwork)}
//                     onMouseEnter={(e) =>
//                       e.target.classList.add("bg-primary", "text-white")
//                     }
//                     onMouseLeave={(e) =>
//                       e.target.classList.remove("bg-primary", "text-white")
//                     }
//                   >
//                     View categories
//                   </Button>
//                 </Card>
//               </Col>
//             ))}
//           </Row>
//         ) : (
//           <Alert variant="danger" className="text-center mx-auto w-100">
//             No artworks are present.
//           </Alert>
//         )}
//       </Container>

//       <Modal
//         show={showModal}
//         onHide={() => setShowModal(false)}
//         centered
//         size="xl"
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <Modal.Header closeButton className="d-flex align-items-center">
//           {selectedArtwork && (
//             <div className="d-flex align-items-center">
//               <img
//                 src={selectedArtwork._links.thumbnail.href}
//                 alt={selectedArtwork.title}
//                 style={{
//                   width: "50px",
//                   height: "50px",
//                   objectFit: "cover",
//                   marginRight: "10px",
//                   borderRadius: "5px",
//                 }}
//               />
//               <div>
//                 <h5 className="mb-0 fw-bold">{selectedArtwork.title}</h5>
//                 <p className="text-muted mb-0">{selectedArtwork.date}</p>
//               </div>
//             </div>
//           )}
//         </Modal.Header>
//         <Modal.Body>
//           {modaldata && modaldata._embedded.genes.length > 0 ? (
//             <Container fluid>
//               <Row className="justify-content-center">
//                 {modaldata._embedded.genes.map((gene, index) => (
//                   <Col key={index} md={6} lg={3} className="mb-3">
//                     <Card
//                       className="shadow-sm border-0"
//                       style={{
//                         width: "220px",
//                         height: "280px",
//                         display: "flex",
//                         flexDirection: "column",
//                         justifyContent: "space-between",
//                         textAlign: "center",
//                       }}
//                     >
//                       <Card.Img
//                         variant="top"
//                         src={gene._links.thumbnail.href}
//                         alt={gene.name}
//                         className="img-fluid"
//                         style={{
//                           height: "200px",
//                           objectFit: "cover",
//                           borderTopLeftRadius: "8px",
//                           borderTopRightRadius: "8px",
//                         }}
//                       />
//                       <Card.Body className="text-center p-2">
//                         <Card.Title className="fs-6 fw-semibold">
//                           {gene.name}
//                         </Card.Title>
//                       </Card.Body>
//                     </Card>
//                   </Col>
//                 ))}
//               </Row>
//             </Container>
//           ) : (
//             <Alert variant="warning" className="text-center">
//               No categories available.
//             </Alert>
//           )}
//         </Modal.Body>
//       </Modal>
//     </>
//   );
// };

// export default Artworks;
