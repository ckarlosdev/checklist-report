import { Card, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import useEmployees from "../../hooks/useEmployees";
import useEquipments from "../../hooks/useEquipments";
import useEquipmentClStore from "../../stores/useEquipmentClStore";
import useChecklistStore from "../../stores/useChecklistStore";

type Props = {};

function ClData({}: Props) {
  const { data: employees } = useEmployees();
  const { data: equipments } = useEquipments();
  const { report } = useChecklistStore();
  const { checklist, setChecklistData } = useEquipmentClStore();

  const employeesFiltered = employees?.filter(
    (emp) =>
      emp.status === "Active" &&
      (emp.title === "Labor" || emp.title === "Supervisor"),
  );

  const employeesSorted = employeesFiltered?.sort((a, b) => {
    return a.firstName > b.firstName ? 1 : -1;
  });

  const equipmentFiltered = equipments?.filter((equip) => {
    const isAssigned = report.checklists?.some(
      (check) => check.equipmentsId === equip.equipmentsId,
    );
    const isCurrentSelection = equip.equipmentsId === checklist.equipmentsId;
    return !isAssigned || isCurrentSelection;
  });

  const handleEquipment = (value: number) => {
    if (isNaN(value)) {
      setChecklistData("equipmentsId", null);
      setChecklistData("odometer", "0");
      return;
    }
    setChecklistData("equipmentsId", value);

    if (value === 0) {
      setChecklistData("equipmentName", "");
      setChecklistData("odometer", "0");
      return;
    }

    const equipmentSelected = equipments?.find(
      (eq) => eq.equipmentsId === value,
    );
    if (equipmentSelected) {
      setChecklistData("equipmentName", equipmentSelected.name);
      setChecklistData("otherType", "Owner");
      setChecklistData("odometer", equipmentSelected.hour);
    }
  };

  // console.log("ClData - checklist:", checklist);

  return (
    <div>
      <Row className="justify-content-center" xs={1} md={2} lg={2}>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title style={{ textAlign: "center", fontWeight: "bold" }}>
                Equipment
              </Card.Title>
              <Form.Select
                aria-label="Default select example"
                style={{ fontWeight: "bold", textAlign: "center" }}
                value={checklist.equipmentsId ?? ""}
                onChange={(e) => handleEquipment(Number(e.target.value))}
              >
                <option>Select equipment</option>
                <option
                  value={0}
                  style={{ fontWeight: "bold", textAlign: "center" }}
                >
                  Other
                </option>
                {equipmentFiltered?.map((eq) => (
                  <option
                    key={eq.equipmentsId}
                    style={{ fontWeight: "bold", textAlign: "center" }}
                    value={eq.equipmentsId}
                  >{`${eq.number} ${eq.name}`}</option>
                ))}
              </Form.Select>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card style={{ height: "104px" }}>
            <Card.Body>
              <Card.Title style={{ textAlign: "center", fontWeight: "bold" }}>
                Type
              </Card.Title>
              <Row className="justify-content-center">
                <Col xs="auto">
                  <Form.Group className="mb-3" controlId="formCbHMBrandt">
                    <Form.Check
                      type={"radio"}
                      name="equipmentType"
                      label={"HM Brandt"}
                      id="radio-brandt"
                      style={{ fontWeight: "bold" }}
                      checked={checklist.otherType === "Owner"}
                      onChange={() => setChecklistData("otherType", "Owner")}
                      disabled={checklist.equipmentsId !== 0}
                    />
                  </Form.Group>
                </Col>
                <Col xs="auto">
                  <Form.Group className="mb-3" controlId="formCbRented">
                    <Form.Check
                      type={"radio"}
                      name="equipmentType"
                      label={"Rented"}
                      id="radio-rented"
                      style={{ fontWeight: "bold" }}
                      checked={checklist.otherType === "Rental"}
                      onChange={() => setChecklistData("otherType", "Rental")}
                      disabled={checklist.equipmentsId !== 0}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card style={{ marginTop: "4px" }}>
            <Card.Body>
              <Row className="justify-content-center" xs={1} lg={3}>
                <Col>
                  <FloatingLabel
                    controlId="floatingOperator"
                    label="Operator"
                    className="mt-1"
                  >
                    <Form.Select
                      aria-label="Default select example"
                      style={{ fontWeight: "bold", textAlign: "center" }}
                      value={checklist.employeesId ?? ""}
                      onChange={(e) =>
                        setChecklistData("employeesId", Number(e.target.value))
                      }
                    >
                      <option value="">Select operator</option>
                      <option
                        value={51}
                        style={{ fontWeight: "bold", textAlign: "center" }}
                      >
                        No Operator
                      </option>
                      {employeesSorted?.map((emp) => (
                        <option
                          key={emp.employeesId}
                          style={{ fontWeight: "bold", textAlign: "center" }}
                          value={emp.employeesId}
                        >{`${emp.firstName} ${emp.lastName}`}</option>
                      ))}
                    </Form.Select>
                  </FloatingLabel>
                </Col>
                <Col>
                  <FloatingLabel
                    controlId="floatingEquipmentName"
                    label="Equipment Name"
                    className="mt-1"
                  >
                    <Form.Control
                      type="text"
                      placeholder="Enter equipment name"
                      style={{ fontWeight: "bold", textAlign: "center" }}
                      value={checklist.equipmentName || ""}
                      onChange={(e) =>
                        setChecklistData("equipmentName", e.target.value)
                      }
                      disabled={checklist.equipmentsId !== 0}
                    />
                  </FloatingLabel>
                </Col>
                <Col>
                  <FloatingLabel
                    controlId="floatingOdometerHrs"
                    label="Odometer/Hrs"
                    className="mt-1"
                  >
                    <Form.Control
                      type="number"
                      placeholder="Enter odometer or hours"
                      style={{ fontWeight: "bold", textAlign: "center" }}
                      value={checklist.odometer ?? 0}
                      onChange={(e) =>
                        setChecklistData("odometer", e.target.value)
                      }
                    />
                  </FloatingLabel>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ClData;
