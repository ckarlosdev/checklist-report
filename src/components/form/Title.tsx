import { Button } from "react-bootstrap";
import hmbLogo from "../../assets/hmbLogo.png";
import { useNavigate } from "react-router-dom";
type Props = {
  onPrint: () => void;
};

function Title({ onPrint }: Props) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "20px",
        marginBottom: "10px",
      }}
    >
      <div>
        <img style={{ width: "250px" }} src={hmbLogo} alt="" />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: " 200px 1fr 200px",
        }}
      >
        <div>
          <Button
            variant="outline-primary"
            onClick={() => navigate("/")}
            className="no-print"
            style={{
              fontWeight: "bold",
              marginTop: "18px",
              width: "150px",
            }}
          >
            <i className="bi bi-backspace" style={{ margin: "6px" }}></i>
            Go Back
          </Button>
        </div>
        <div>
          <h2
            style={{
              fontWeight: "bold",
              marginTop: "20px",
              marginBottom: "10px",
            }}
          >
            Checklist
          </h2>
        </div>
        <div>
          <Button
            variant="outline-danger"
            onClick={() => onPrint()}
            className="no-print"
            style={{
              fontWeight: "bold",
              marginTop: "18px",
              width: "200px",
            }}
          >
            Print Report
            <i className="bi bi-file-earmark-pdf" style={{ margin: "6px" }}></i>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Title;
