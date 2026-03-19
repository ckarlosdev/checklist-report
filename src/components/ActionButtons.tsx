import { Button, Card, Col, Spinner } from "react-bootstrap";
import useChecklistStore from "../stores/useChecklistStore";
import useEquipments from "../hooks/useEquipments";
import useEmployees from "../hooks/useEmployees";
import { useContextStore } from "../stores/useContextStore";
import useUser from "../hooks/useUser";
import { useSaveChecklist } from "../hooks/useChecklist";
import useEquipmentClStore from "../stores/useEquipmentClStore";
import { useAuthStore } from "../hooks/authStore";

type Props = {};

function ActionButtons({}: Props) {
  const { report, resetReport } = useChecklistStore();
  const { jobId, setIsLoaded } = useContextStore();
  const { data: equipment } = useEquipments();
  const { data: employees } = useEmployees();
  const { data: userData } = useUser();
  const { mutate, isPending: isSaving } = useSaveChecklist();
  const { resetChecklist } = useEquipmentClStore();
  const { user: userAuth } = useAuthStore();

  const handleReset = () => {
    resetReport();
    resetChecklist();
    setIsLoaded(false);
  };

  const handleSave = () => {
    // console.log("userData", userData);
    const flattenedChecklists = report.checklists.map((check) => {
      const equip = equipment?.find(
        (e) => e.equipmentsId === check.equipmentsId,
      );

      const emp = employees?.find(
        (empl) => empl.employeesId === check.employeesId,
      );

      const options: Record<string, string> = {};
      check.selectedOptions.forEach((opt) => {
        options[opt.name.toLowerCase()] = opt.selectedValue;
      });

      return {
        googleChecklistsId: check.googleChecklistsId,
        equipmentNumber: equip?.number || "",
        equipmentName: check.equipmentName || "",
        operator: emp?.firstName + " " + emp?.lastName || "",
        odometer: parseFloat(check.odometer) || 0,
        oil: options["oil"] || "",
        hydraulic: options["hydraulic"] || "",
        filter: options["filter"] || "",
        radiator: options["radiator"] || "",
        track: options["track"] || "",
        attachment: options["attachment"] || "",
        leaking: options["leaking"] || "",
        diesel: options["diesel"] || "",
        clean: options["clean"] || "",
        comment: check.comment,
        otherType: check.otherType,
      };
    });

    const reportUpdated = {
      ...report,
      jobsId: jobId,
      userName: userData ? userData.email : "userName",
      checklists: flattenedChecklists,
    };

    // Lógica para guardar los cambios
    // console.log("Saving changes...", reportUpdated);
    mutate({
      reportData: reportUpdated!,
    });
  };

  const isAuthorized = userAuth?.roles?.some(
    (role) =>
      role.name === "ROLE_SUPERVISOR" || role.name === "ROLE_SUPERINTENDENT",
  );

  return (
    <>
      <Col>
        <Card style={{ marginBottom: "2px" }} className="no-print">
          <Card.Body>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                height: "50px",
              }}
            >
              <Button
                style={{
                  width: "200px",
                  height: "60px",
                  fontWeight: "bold",
                  fontSize: "25px",
                  marginRight: "20px",
                }}
                onClick={() => {
                  handleReset();
                  window.location.href = `https://ckarlosdev.github.io/binder-webapp/#/binder/${jobId}`;
                }}
                variant="outline-primary"
                className="no-print"
              >
                <i className="bi bi-backspace" style={{ margin: "6px" }}></i>
                Back
              </Button>
              <Button
                style={{
                  width: "200px",
                  height: "60px",
                  fontWeight: "bold",
                  fontSize: "25px",
                  marginLeft: "20px",
                }}
                variant="outline-primary"
                onClick={() => {
                  handleSave();
                }}
                disabled={isSaving || !isAuthorized}
                className="no-print"
              >
                {isSaving ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      style={{ marginRight: "10px" }}
                    />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
                <i className="bi bi-floppy" style={{ margin: "6px" }}></i>
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}

export default ActionButtons;
