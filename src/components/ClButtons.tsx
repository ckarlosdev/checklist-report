import { Button, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import QrClModal from "./QrClModal";
import useQrChecklistStore from "../stores/useQrChecklistStore";

type Props = {};

function ClButtons({}: Props) {
  const navigate = useNavigate();
  const { setShowQrClModal } = useQrChecklistStore();

  return (
    <>
      <Col>
        <Button
          variant="outline-primary"
          style={{ margin: "2px", fontWeight: "bold" }}
          onClick={() => navigate("/checklist")}
          className="no-print"
        >
          <i className="bi bi-plus-square" style={{ marginRight: "8px" }} />
          New Checklist
        </Button>
      </Col>

      {/* Cambiamos 'margin-end' por 'text-end' */}
      <Col className="text-end">
        <Button
          variant="outline-primary"
          style={{ margin: "2px", fontWeight: "bold" }}
          className="no-print"
          onClick={() => setShowQrClModal(true)}
        >
          <i className="bi bi-qr-code-scan" style={{ marginRight: "8px" }} />
          Created by QR
        </Button>
      </Col>
      <QrClModal />
    </>
  );
}

export default ClButtons;
