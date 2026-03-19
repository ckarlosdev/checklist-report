import { Button, Table } from "react-bootstrap";
import useChecklistStore from "../stores/useChecklistStore";
import useEmployees from "../hooks/useEmployees";
import useEquipments from "../hooks/useEquipments";
import { useNavigate } from "react-router-dom";

type Props = {};

function List({}: Props) {
  const { report, removeChecklist } = useChecklistStore();
  const { data: employees } = useEmployees();
  const { data: equipments } = useEquipments();
  const navigate = useNavigate();

  const clSorted = report.checklists.sort(
    (a, b) => (a.equipmentsId ?? 0) - (b.equipmentsId ?? 0),
  );


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

          let equipName = "Other";
          if (equipment !== undefined) {
            equipName = equipment?.number + " " + equipment?.name;
          }

          const employee = employees?.find(
            (emp) => emp.employeesId === cl.employeesId,
          );
          return (
            <tr key={cl.temporalId}>
              <td>{equipName}</td>
              <td>{employee?.firstName + " " + employee?.lastName}</td>
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
