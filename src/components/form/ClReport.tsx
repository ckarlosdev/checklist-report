import {
  Card,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
} from "react-bootstrap";
import Title from "./Title";
import ClOption from "./ClOption";
import useChecklistStore, { ITEMS } from "../../stores/useChecklistStore";
import type { Item } from "../../types";
import ClData from "./ClData";
import ClFormButtons from "./ClFormButtons";
import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import "../../styles/buttons.css";
import useEquipmentClStore from "../../stores/useEquipmentClStore";
import { useParams } from "react-router-dom";

type Props = {};

function ClReport({}: Props) {
  const { idCl } = useParams<{ idCl: string }>();
  const isEditMode = Boolean(idCl);

  const { checklist, setChecklistData, setFullChecklist } =
    useEquipmentClStore();
  const { report } = useChecklistStore();
  const componenteRef = useRef(null);

  useEffect(() => {
    if (isEditMode) {
      const clSelected = report.checklists.find((cl) => cl.temporalId === idCl);
      // console.log("Cargando datos del checklist con ID:", clSelected);
      if (clSelected) {
        setFullChecklist(clSelected);
      }
    }
  }, [idCl]);

  const pageStyle = `
    @page {
      size: auto;
      margin: 10mm;
    }
    @media print {
      body {
        -webkit-print-color-adjust: exact;
      }
    }
  `;

  const handlePrint = useReactToPrint({
    contentRef: componenteRef,
    documentTitle: "Checklist",
    pageStyle: pageStyle,
  });

  return (
    <>
      <Container ref={componenteRef} className="print-container">
        <Row className=" justify-content-md-center">
          <Col>
            <Title onPrint={handlePrint} />
          </Col>
        </Row>
        <Row>
          <Col>
            <ClData />
          </Col>
        </Row>
        <Row className=" justify-content-md-center">
          <Col>
            <Card className="mt-1 mb-1">
              <Card.Body>
                <Row className="justify-content-center" xs={1} md={2} lg={3}>
                  {ITEMS.map((item: Item) => (
                    <Col
                      xs="auto"
                      key={item.id}
                      className="d-flex justify-content-center"
                    >
                      <ClOption item={item} />
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card className="mb-1">
              <Card.Body>
                <Row>
                  <Col>
                    <FloatingLabel
                      controlId="floatingTextarea2"
                      label="Comments"
                    >
                      <Form.Control
                        as="textarea"
                        placeholder="Leave a comment here"
                        style={{ height: "100px" }}
                        value={checklist.comment}
                        onChange={(e) =>
                          setChecklistData("comment", e.target.value)
                        }
                      />
                    </FloatingLabel>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className=" justify-content-md-center">
          <Col>
            <Card className="no-print mb-2">
              <Card.Body>
                <ClFormButtons />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ClReport;
