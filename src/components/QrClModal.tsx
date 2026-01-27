import {
  Badge,
  Button,
  Col,
  Modal,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import useQrChecklistStore from "../stores/useQrChecklistStore";
import useQrChecklists from "../hooks/useQrChecklists";
import { useContextStore } from "../stores/useContextStore";
import useChecklistStore from "../stores/useChecklistStore";
import useEquipments from "../hooks/useEquipments";
import useEmployees from "../hooks/useEmployees";
import type { QrChecklist } from "../types";

type Props = {};

export default function QrClModal({}: Props) {
  const {
    qrClAdded,
    qrClDeleted,
    showQrClModal,
    setShowQrClModal,
    addQrChecklist,
    deleteQrChecklists,
    reset,
  } = useQrChecklistStore();
  const { jobId } = useContextStore();
  const { report, addChecklist } = useChecklistStore();
  const { data: qrChecklistsData } = useQrChecklists(jobId!, report.date);
  const { data: equipments } = useEquipments();
  const { data: employees } = useEmployees();

  const deleteTooltip = (props: any) => (
    <Tooltip id="button-tooltip" {...props}>
      Delete Checklist
    </Tooltip>
  );

  const addTooltip = (props: any) => (
    <Tooltip id="button-tooltip" {...props}>
      Add Checklist
    </Tooltip>
  );

  const handleAddQrCl = (qrCl: QrChecklist) => {
    if (
      report.checklists.some((item) => item.equipmentsId === qrCl.equipmentsId)
    ) {
      alert("Equipment already added");
      return;
    }

    addQrChecklist(qrCl);
    const equip = equipments?.find(
      (equip) => equip.equipmentsId === qrCl.equipmentsId,
    );

    const newChecklist = {
      temporalId: crypto.randomUUID(),
      googleChecklistsId: null,
      equipmentsId: qrCl.equipmentsId,
      equipmentName: equip?.name ?? "",
      employeesId: qrCl.employeesId,
      odometer: qrCl.odometer,
      selectedOptions: [
        { name: "Oil", selectedValue: qrCl.oil },
        { name: "Hydraulic", selectedValue: qrCl.hydraulic },
        { name: "Filter", selectedValue: qrCl.filter },
        { name: "Radiator", selectedValue: qrCl.radiator },
        { name: "Track", selectedValue: qrCl.track },
        { name: "Attachment", selectedValue: qrCl.attachment },
        { name: "Leaking", selectedValue: qrCl.leaking },
        { name: "Diesel", selectedValue: qrCl.diesel },
        { name: "Clean", selectedValue: qrCl.clean },
      ],
      comment: qrCl.comment,
      otherType: "Owner",
    };

    addChecklist(newChecklist);
  };

  const qrClRemoved = qrChecklistsData?.filter(
    (qrCl) => !qrClDeleted.includes(qrCl.checklistsId),
  );

  const qrClFiltered = qrClRemoved?.filter(
    (qrCl) => !qrClAdded.includes(qrCl.checklistsId),
  );

  //   console.log("test", report.checklists);

  return (
    <>
      <Modal
        show={showQrClModal}
        size="lg"
        onHide={() => setShowQrClModal(false)}
        backdrop="static"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">
            <i className="bi bi-qr-code-scan" style={{ margin: "6px" }}></i>
            Checklists created by QR code
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <Table bordered hover>
                <thead>
                  <tr style={{ textAlign: "center" }}>
                    <th>Delete</th>
                    <th>ID</th>
                    <th>Number</th>
                    <th>Name</th>
                    <th>Operator</th>
                    <th>Status</th>
                    <th>Add</th>
                  </tr>
                </thead>
                <tbody style={{ textAlign: "center" }}>
                  {qrClFiltered?.map((qrCl) => {
                    let equipment = equipments?.find(
                      (equi) => equi.equipmentsId === qrCl.equipmentsId,
                    );

                    let employee = employees?.find(
                      (emp) => emp.employeesId === qrCl.employeesId,
                    );

                    return (
                      <tr key={qrCl.checklistsId}>
                        <td>
                          <OverlayTrigger
                            placement="right"
                            delay={{ show: 250, hide: 400 }}
                            overlay={deleteTooltip}
                          >
                            <Button
                              variant="outline-danger"
                              onClick={() => deleteQrChecklists(qrCl)}
                            >
                              <i className="bi bi-x-circle-fill"></i>
                            </Button>
                          </OverlayTrigger>
                        </td>
                        <td style={{ fontWeight: "bold" }}>
                          {qrCl.checklistsId}
                        </td>
                        <td>{equipment?.number}</td>
                        <td>{equipment?.name}</td>
                        <td>
                          {employee?.firstName + " " + employee?.firstName}
                        </td>
                        <td>
                          {qrCl.status === "1" ? (
                            <>
                              <Badge bg="secondary">New</Badge>
                            </>
                          ) : qrCl.status === "2" ? (
                            <>
                              <Badge bg="primary">Added</Badge>
                            </>
                          ) : (
                            <>
                              <Badge bg="danger">Deleted</Badge>
                            </>
                          )}
                        </td>
                        <td>
                          <OverlayTrigger
                            placement="right"
                            delay={{ show: 250, hide: 400 }}
                            overlay={addTooltip}
                          >
                            <Button
                              variant="outline-primary"
                              onClick={() => handleAddQrCl(qrCl)}
                              //   disabled={report.checklists.some(
                              //     (item) =>
                              //       item.equipmentsId === qrCl.equipmentsId,
                              //   )}
                            >
                              <i className="bi bi-plus-square-fill"></i>
                            </Button>
                          </OverlayTrigger>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button
            variant="outline-primary"
            onClick={() => {
              //   setShowQrClModal(false);
              reset();
            }}
            style={{ width: "100px", fontWeight: "bold" }}
          >
            Finish
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
