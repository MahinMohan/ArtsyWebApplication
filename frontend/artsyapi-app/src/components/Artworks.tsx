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
        size="xl"
        dialogClassName="custom-modal-top"
      >
        <Modal.Header
          closeButton
          style={{ borderBottom: "none", paddingRight: "16px" }}
        >
          <Modal.Title>
            {selectedArtwork && (
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <img
                  src={selectedArtwork._links.thumbnail.href}
                  alt={selectedArtwork.title}
                  style={{
                    width: "65px",
                    height: "65px",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
                <div>
                  <h5
                    style={{
                      marginBottom: "2px",
                      fontSize: "1rem",
                      fontWeight: "normal",
                    }}
                  >
                    {selectedArtwork.title}
                  </h5>
                  <p style={{ fontSize: "0.85rem", marginBottom: 0 }}>
                    {selectedArtwork.date}
                  </p>
                </div>
              </div>
            )}
          </Modal.Title>
        </Modal.Header>

        <hr style={{ margin: 0 }} />

        <Modal.Body style={{ minHeight: "200px" }}>
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
                    {/* Updated card styling for the gene name */}
                    <Card
                      className="shadow-sm"
                      style={{
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                        overflow: "hidden",
                      }}
                    >
                      <Card.Img
                        variant="top"
                        src={gene._links.thumbnail.href}
                        alt={gene.name}
                        style={{
                          height: isMobile ? "400px" : "220px",
                          objectFit: "cover",
                        }}
                      />
                      <Card.Body
                        className="text-center"
                        style={{ padding: "10px" }}
                      >
                        <Card.Text
                          style={{
                            margin: 0,
                            fontSize: "0.9rem",
                            fontWeight: "normal",
                          }}
                        >
                          {gene.name}
                        </Card.Text>
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
