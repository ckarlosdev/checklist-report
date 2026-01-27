import { Button, Col, Row } from "react-bootstrap";
import useEquipmentClStore from "../../stores/useEquipmentClStore";
import { useNavigate } from "react-router-dom";
import useChecklistStore from "../../stores/useChecklistStore";

type Props = {};

function ClFormButtons({}: Props) {
  const { checklist, resetChecklist } = useEquipmentClStore();
  const { addChecklist } = useChecklistStore();
  const navigate = useNavigate();

  const validateChecklist = () => {
    if (
      checklist.equipmentsId === null ||
      checklist.equipmentsId === undefined
    ) {
      alert("Please select an equipment.");
      return false;
    }
    if (checklist.employeesId === null || checklist.employeesId === undefined) {
      alert("Please select an operator.");
      return false;
    }
    if (checklist.equipmentsId === 0 && checklist.comment.trim() === "") {
      alert("Please provide a equipment name for 'Other' equipment type.");
      return false;
    }
    if (
      checklist.odometer === null ||
      checklist.odometer === undefined ||
      checklist.odometer === ""
    ) {
      alert("Please provide a value for Odometer/Hrs.");
      return false;
    }
    if (checklist.selectedOptions.some((opt) => opt.selectedValue === "")) {
      alert("Please answer all checklist items.");
      return false;
    }

    return true;
  };

  const handleAddChecklist = () => {
    if (validateChecklist()) {
      // console.log("comment", checklist);
      addChecklist({ ...checklist });
      resetChecklist();
      navigate("/");
    }
  };

  return (
    <>
      <Row className="justify-content-center">
        <Col xs="auto" className="d-flex justify-content-center">
          <Button
            variant="outline-primary"
            style={{ fontWeight: "bold", fontSize: "20px" }}
            onClick={handleAddChecklist}
          >
            <i
              className="bi bi-file-earmark-plus"
              style={{ margin: "6px" }}
            ></i>
            Add checklist
          </Button>
        </Col>
      </Row>
    </>
  );
}

export default ClFormButtons;
