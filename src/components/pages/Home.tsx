import { Container, Row, Spinner } from "react-bootstrap";
import Title from "../Title";
import Job from "../Job";
import { useSearchParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useContextStore } from "../../stores/useContextStore";
import ChecklistTable from "../ChecklistTable";
import ActionButtons from "../ActionButtons";
import { useReactToPrint } from "react-to-print";
import { useChecklist } from "../../hooks/useChecklist";
import useEquipments from "../../hooks/useEquipments";
import useEmployees from "../../hooks/useEmployees";
import type { apiClReport, Checklist, ClReport } from "../../types";
import useChecklistStore from "../../stores/useChecklistStore";
import { useMutationState } from "@tanstack/react-query";
import useEquipmentClStore from "../../stores/useEquipmentClStore";

type Props = {};

function Home({}: Props) {
  const [searchParams] = useSearchParams();
  const componenteRef = useRef(null);
  const { setIds, checklistId, isLoaded, setIsLoaded, jobId } =
    useContextStore();
  const { data: equipments } = useEquipments();
  const { data: employees } = useEmployees();

  const { data: reportData } = useChecklist(
    checklistId ? Number(checklistId) : 0,
  );

  const { fillReportByApi, resetReport } = useChecklistStore();
  const { resetChecklist } = useEquipmentClStore();

  const isSaving = useMutationState({
    filters: { mutationKey: ["save-report"], status: "pending" },
    select: (mutation) => mutation.state.status === "pending",
  }).some(Boolean);

  const pageStyle = `
      @page {
        size: auto;
        margin: 10mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
      }
    `;

  const handlePrint = useReactToPrint({
    contentRef: componenteRef,
    documentTitle: "Checklist Gral",
    pageStyle: pageStyle,
  });

  useEffect(() => {
    const jobIdParam = searchParams.get("jobId");
    const checklistIdParam = searchParams.get("checklistId");
    // console.log("Search Params:", { jobId, checklistId });
    const isNewAction = searchParams.get("action") === "new";

    const isDifferentJob = jobId && Number(jobIdParam) !== jobId;

    if (isNewAction || (jobIdParam && isDifferentJob && !checklistIdParam)) {
      handleReset();
    }

    if (jobIdParam || checklistIdParam) {
      const storedJobId = Number(jobIdParam);
      const storedChecklistId = Number(checklistIdParam);
      if (!isNaN(storedJobId) || !isNaN(storedChecklistId)) {
        if (storedChecklistId !== checklistId) {
          setIsLoaded(false); // <--- ESTO ES CLAVE
        }
        setIds(storedJobId, storedChecklistId);
      }
    }
  }, [searchParams]);

  const handleReset = () => {
    resetReport();
    resetChecklist();
    setIsLoaded(false);
  };

  useEffect(() => {
    const equipmentsReady = equipments && equipments.length > 0;
    const employeesReady = employees && employees.length > 0;

    if (reportData && !isLoaded && equipmentsReady && employeesReady) {
      const apiData = mapApiToClReport(reportData);
      fillReportByApi(apiData);
      setIsLoaded(true);
    }
  }, [reportData, equipments, employees, isLoaded]);

  const mapApiToClReport = (apiData: apiClReport): ClReport => {
    return {
      equipmentsGoogleChecklistsId: apiData.equipmentsGoogleChecklistsId,
      jobsId: apiData.jobsId,
      userName: apiData.userName,
      date: apiData.date,
      checklists: apiData.checklists.map((apiCl): Checklist => {
        const foundEquip = equipments?.find(
          (e) => e.number === apiCl.equipmentNumber,
        );
        const foundEmp = employees?.find(
          (emp) =>
            `${emp.firstName} ${emp.lastName}`.trim().toLowerCase() ===
            apiCl.operator?.trim().toLowerCase(),
        );

        console.log("map api data");

        return {
          temporalId: crypto.randomUUID(),
          googleChecklistsId: apiCl.googleChecklistsId,
          equipmentName: apiCl.equipmentName || apiCl.equipmentNumber,
          equipmentsId: foundEquip?.equipmentsId ?? null,
          employeesId: foundEmp?.employeesId ?? null,
          odometer: String(apiCl.odometer),
          comment: apiCl.comment,
          otherType: apiCl.otherType,
          selectedOptions: [
            { name: "Oil", selectedValue: apiCl.oil },
            { name: "Hydraulic", selectedValue: apiCl.hydraulic },
            { name: "Filter", selectedValue: apiCl.filter },
            { name: "Radiator", selectedValue: apiCl.radiator },
            { name: "Track", selectedValue: apiCl.track },
            { name: "Attachment", selectedValue: apiCl.attachment },
            { name: "Leaking", selectedValue: apiCl.leaking },
            { name: "Diesel", selectedValue: apiCl.diesel },
            { name: "Clean", selectedValue: apiCl.clean },
          ],
        };
      }),
    };
  };

  return (
    <>
      <Container ref={componenteRef} className="print-container">
        <Row className="justify-content-md-center">
          <Title onPrint={handlePrint} />
        </Row>
        <Row>
          <Job />
        </Row>
        <Row>
          <ChecklistTable />
        </Row>
        <Row>
          <ActionButtons />
        </Row>
      </Container>
      {isSaving && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner
            animation="border"
            variant="primary"
            style={{ width: "4rem", height: "4rem" }}
          />
          <h4 className="mt-3">Saving Report...</h4>
        </div>
      )}
    </>
  );
}

export default Home;
