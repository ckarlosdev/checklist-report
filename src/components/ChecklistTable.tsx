import { Card, Col, Row } from "react-bootstrap";
import ClButtons from "./ClButtons";
import List from "./List";

type Props = {};

function ChecklistTable({}: Props) {
  return (
    <>
      <Col>
        <Card style={{ marginBottom: "2px" }}>
          <Card.Body>
            <Card.Title style={{ textAlign: "center", fontWeight: "bold" }}>
              Checklists
            </Card.Title>
            <Row>
              <ClButtons />
            </Row>
            <Row>
              <Col>
                <List />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}

export default ChecklistTable;
