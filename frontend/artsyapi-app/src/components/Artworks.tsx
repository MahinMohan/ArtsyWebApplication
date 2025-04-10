import React, { useState, useEffect } from "react";
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

const Artworks = ({ artworks, isLoading }: any) => {
  const [modaldata, setModalData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<any>(null);
  const [loadingModal, setLoadingModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 576);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 576);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Inline style for gene cards based on mobile status
  const geneCardStyle = {
    width: isMobile ? "370px" : "250px",
    height: isMobile ? "320px" : "280px",
    borderRadius: "5px",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between",
    textAlign: "center" as const,
  };

  const handleShowModal = async (artwork: any) => {
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
          <Row className="g-4 justify-content-start">
            {artworks._embedded.artworks.map((artwork: any, index: number) => (
              <Col key={index} md={6} lg={3} className="mb-4">
                <Card
                  className="shadow-sm border-0 rounded"
                  style={{
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
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                    }}
                  />
                  <Card.Body
                    className="d-flex align-items-center justify-content-center text-center p-1"
                    style={{ minHeight: "60px", padding: "0.5rem 0" }}
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
                      e.currentTarget.classList.add("bg-primary", "text-white")
                    }
                    onMouseLeave={(e) =>
                      e.currentTarget.classList.remove(
                        "bg-primary",
                        "text-white"
                      )
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
            className="w-100 text-start"
            style={{ padding: "0.7rem 0.6rem" }}
          >
            No artworks.
          </Alert>
        )}
      </Container>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="xl"
        fullscreen="sm-down"
      >
        <Modal.Header
          closeButton
          className="d-flex flex-column flex-md-row align-items-center"
        >
          {selectedArtwork && (
            <>
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
                className="mb-3 mb-md-0"
              />
              <div>
                <h5 className="mb-0">{selectedArtwork.title}</h5>
                <p className="text-muted mb-0">{selectedArtwork.date}</p>
              </div>
            </>
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
              <Row className="g-4">
                {modaldata._embedded.genes.map((gene: any, index: number) => (
                  <Col key={index} md={6} lg={3} className="mb-3">
                    <Card className="shadow-sm border-0" style={geneCardStyle}>
                      <Card.Img
                        variant="top"
                        src={gene._links.thumbnail.href}
                        alt={gene.name}
                        className="img-fluid"
                        style={{
                          height: "280px", // Changed here: card image height is now 300px
                          objectFit: "cover",
                          borderTopLeftRadius: "8px",
                          borderTopRightRadius: "8px",
                        }}
                      />
                      <Card.Body className="text-center p-2">
                        <Card.Title
                          className="fs-6 fw-normal"
                          style={{ marginBottom: "0" }}
                        >
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
