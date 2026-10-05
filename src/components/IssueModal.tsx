import { Button, Col, FloatingLabel, Form, Modal, Row } from "react-bootstrap";
import useIssueStore from "../stores/useIssueStore";
import "../styles/modal.css";
import { useEffect } from "react";
import useEquipments from "../hooks/useEquipments";
import useEmployees from "../hooks/useEmployees";
import useUser from "../hooks/useUser";
import { useSaveIssue } from "../hooks/useIssue";
import type { EquipmentDataDto, EquipmentIssueCreateDto, EquipmentIssueRequestDto } from "../types";

type Props = {};

function IssueModal({}: Props) {
  const {
    setShowIssueModal,
    showIssueModal,
    qrChecklist,
    setIssueData,
    issue,
    reset,
  } = useIssueStore();
  const { data: equipments } = useEquipments();
  const { data: employees } = useEmployees();
  const { data: userData } = useUser();
  const { saveIssueProcess, isPending } = useSaveIssue();

  useEffect(() => {
    if (qrChecklist?.equipmentsId) {
      // console.log("from Modal", qrChecklist);
      setIssueData("checklistsId", qrChecklist.checklistsId);
      setIssueData("equipmentsId", qrChecklist.equipmentsId);

      const operator = employees?.find(
        (emp) => emp.employeesId === qrChecklist.employeesId,
      );
      let fullName = operator
        ? operator.firstName + " " + operator.lastName
        : "N/A";
      setIssueData("reportedBy", fullName);
      const dateForBackend = qrChecklist.date.split("T")[0];
      setIssueData("reportedDate", dateForBackend);
      setIssueData("descriptionIssue", qrChecklist.comment);
    }
  }, [qrChecklist]);

  const getEquipmentName = (equipId: number) => {
    const equipment = equipments?.find(
      (equip) => equip.equipmentsId === equipId,
    );
    return equipment ? equipment.name : "Not found";
  };

  const handleSave = async () => {
    // validate
    if (!validate()) return;
    // build payload
    const issuePayload = {
      ...issue,
      createdBy: userData.email,
      updatedBy: userData.email,
      flow: "Pending",
    };

    const issueDataPayload: EquipmentIssueRequestDto = {
      // Agrega los campos que requiere EquipmentIssueRequestDto
      equipmentId: issue.equipmentsId || 0,
      reportedBy: issue.reportedBy,
      issueDescription: issue.descriptionIssue,
      severity: issue.priorityIssue,
      userName: userData.email,
      issueType: issue.typeIssue,
      details: issue.details,
    };

    const equipmentSelected = equipments?.find(
      (equip) => equip.equipmentsId === issue.equipmentsId,
    );

    if (!equipmentSelected) {
      throw new Error(`equipment no found`);
    }

    const equipmentPayload: EquipmentDataDto = {
      number: equipmentSelected.number,
      type: "Equipment",
      name: equipmentSelected.name,
    };

    const maintenancePayload: EquipmentIssueCreateDto = {
        issueData: issueDataPayload,
        equipmentData: equipmentPayload,
      };

    // mutate
    try {
      // Ejecutar el proceso completo (Issue + Mantenimiento + Rollback si falla)
      await saveIssueProcess(issuePayload, maintenancePayload);

      // Si todo salió bien:
      alert("Issue created successfully.");
      reset();
      setShowIssueModal(false);
    } catch (error) {
      // Si algo falló en cualquiera de las dos llamadas o en el rollback:
      console.error("Error al procesar el issue:", error);
      alert("Error creating the issue.");
    }
  };

  const validate = () => {
    if (issue.typeIssue === "") {
      alert("Type issue missing.");
      return false;
    }
    if (issue.priorityIssue === "") {
      alert("Priority selection missing.");
      return false;
    }
    if (issue.details === "") {
      alert("Details field missing.");
      return false;
    }

    return true;
  };

  return (
    <>
      <Modal
        show={showIssueModal}
        onHide={() => setShowIssueModal(false)}
        backdrop="static"
        keyboard={false}
        centered
        size="lg"
        // contentClassName="custom-modal-style"
      >
        <Modal.Header closeButton={!isPending}>
          <Modal.Title
            className="w-100 text-center"
            style={{ fontWeight: "bold" }}
          >
            Issue
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-2">
            <Col>
              <FloatingLabel controlId="floatingEquipment" label="Equipment">
                <Form.Control
                  style={{ fontWeight: "bold", textAlign: "center" }}
                  value={
                    issue?.equipmentsId
                      ? getEquipmentName(issue.equipmentsId)
                      : ""
                  }
                  readOnly
                  disabled={isPending}
                />
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel controlId="floatingReportedBy" label="Reported By">
                <Form.Control
                  style={{ fontWeight: "bold", textAlign: "center" }}
                  readOnly
                  disabled={isPending}
                  value={issue?.reportedBy}
                />
              </FloatingLabel>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <FloatingLabel controlId="floatingType" label="Type">
                <Form.Select
                  aria-label="Floating label select example"
                  style={{ fontWeight: "bold", textAlign: "center" }}
                  value={issue.typeIssue}
                  disabled={isPending}
                  onChange={(e) => {
                    const val = e.target.value === "" ? "" : e.target.value;
                    setIssueData("typeIssue", val);
                  }}
                >
                  <option selected value="">
                    Select Type
                  </option>
                  <option value="Blown Hose">Blown Hose/Hydraulic Leak</option>
                  <option value="Oil Leak">Oil Leak</option>
                  <option value="Other Fluid Leak">Other Fluid Leak</option>
                  <option value="Overheating">Overheating</option>
                  <option value="Won't start">Won't start</option>
                  <option value="Physical damage">Physical damage</option>
                  <option value="Won't track/move">Won't track/move</option>
                  <option value="Low Power">Low Power</option>
                  <option value="Control/electrical issue">
                    Control/electrical issue
                  </option>
                  <option value="Smoke/smell">Smoke/smell</option>
                  <option value="Weird Sounds">Weird Sounds</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel controlId="floatingPriority" label="Priority">
                <Form.Select
                  aria-label="Floating label select example"
                  style={{ fontWeight: "bold", textAlign: "center" }}
                  value={issue.priorityIssue}
                  disabled={isPending}
                  onChange={(e) => {
                    const val = e.target.value === "" ? "" : e.target.value;
                    setIssueData("priorityIssue", val);
                  }}
                >
                  <option selected value="">
                    Select priority
                  </option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </Form.Select>
              </FloatingLabel>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
              <FloatingLabel controlId="floatingInputGrid" label="Report">
                <Form.Control
                  as="textarea"
                  placeholder="name@example.com"
                  style={{
                    height: "100px",
                    fontWeight: "bold",
                    textAlign: "center",
                    background: "#e9e9e9",
                  }}
                  readOnly
                  disabled={isPending}
                  value={issue.descriptionIssue}
                />
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <Col>
              <FloatingLabel controlId="floatingInputGrid" label="Details">
                <Form.Control
                  as="textarea"
                  placeholder="name@example.com"
                  style={{
                    height: "100px",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                  value={issue.details}
                  disabled={isPending}
                  onChange={(e) => setIssueData("details", e.target.value)}
                />
              </FloatingLabel>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button
            variant="outline-primary"
            style={{ fontWeight: "bold" }}
            onClick={() => handleSave()}
            disabled={isPending}
          >
            Save Issue
            {isPending ? "Saving..." : "Save Issue"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default IssueModal;
