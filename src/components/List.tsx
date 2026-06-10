import { Button, Table } from "react-bootstrap";
import useChecklistStore from "../stores/useChecklistStore";
import useEmployees from "../hooks/useEmployees";
import useEquipments from "../hooks/useEquipments";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

type Props = {};

function List({}: Props) {
  const { report, removeChecklist } = useChecklistStore();
  const { data: employees, isLoading: loadingEmployees } = useEmployees();
  const { data: equipments, isLoading: loadingEquipments } = useEquipments();
  const navigate = useNavigate();

  const clSorted = useMemo(() => {
    if (!report?.checklists) return [];
    return [...report.checklists].sort(
      (a, b) => (a.equipmentsId ?? 0) - (b.equipmentsId ?? 0),
    );
  }, [report.checklists]);

  if (loadingEmployees || loadingEquipments) {
    return <div className="text-center my-4">Loading data...</div>;
  }

  return (
    <Table striped bordered hover style={{ marginTop: "20px" }}>
      <thead style={{ textAlign: "center" }}>
        <tr>
          <th style={{ width: "45%" }}>Equipment</th>
          <th style={{ width: "25%" }}>Operator</th>
          <th style={{ width: "15%" }}>Update</th>
          <th style={{ width: "15%" }}>Delete</th>
        </tr>
      </thead>
      <tbody style={{ textAlign: "center" }}>
        {clSorted.map((cl) => {
          const equipment = equipments?.find(
            (eq) => eq.equipmentsId === cl.equipmentsId,
          );

          const equipName = equipment
            ? `${equipment.number} ${equipment.name}`
            : "Other";

          const employee = employees?.find(
            (emp) => emp.employeesId === cl.employeesId,
          );

          const employeeName = employee
            ? `${employee.firstName} ${employee.lastName}`
            : "Unknown Operator";

          return (
            <tr key={cl.temporalId}>
              <td>{equipName}</td>
              <td>{employeeName}</td>
              <td>
                <Button
                  variant="outline-warning"
                  size="sm"
                  style={{ fontWeight: "bold" }}
                  onClick={() => navigate(`/checklist/${cl.temporalId}`)}
                >
                  <i
                    className="bi bi-pencil-square"
                    style={{ margin: "2px" }}
                  ></i>
                  Update
                </Button>
              </td>
              <td>
                <Button
                  variant="outline-danger"
                  size="sm"
                  style={{ fontWeight: "bold" }}
                  onClick={() => {
                    const confirmDelete = window.confirm(
                      `Are you sure you want to delete the checklist for: ${equipName}?`,
                    );

                    if (confirmDelete) {
                      removeChecklist(cl.temporalId);
                    }
                  }}
                >
                  <i className="bi bi-trash" style={{ margin: "2px" }}></i>
                  Delete
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default List;
