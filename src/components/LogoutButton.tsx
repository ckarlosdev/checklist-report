import { useState } from "react";
import { Button } from "react-bootstrap";
import { useAuthStore } from "../hooks/authStore";
import { api } from "../hooks/apiConfig";
import useChecklistStore from "../stores/useChecklistStore";
import useEquipmentClStore from "../stores/useEquipmentClStore";
import { useContextStore } from "../stores/useContextStore";

type Props = {};

function LogoutButton({}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const refreshToken = useAuthStore((state) => state.refreshToken);

  const { resetReport } = useChecklistStore();
  const { resetChecklist } = useEquipmentClStore();
  const { setIsLoaded } = useContextStore();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      if (refreshToken) {
        await api.post("/auth/revoke", { refreshToken });
      }
    } catch (error) {
      console.error(
        "Error al revocar token, cerrando sesión localmente...",
        error,
      );
    } finally {
      handleReset();
      logout();
      window.location.href = "https://ckarlosdev.github.io/login/";
    }
  };

  const handleReset = () => {
    resetReport();
    resetChecklist();
    setIsLoaded(false);
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={isLoading}
      variant="outline-danger"
      style={{
        borderRadius: "10px",
        fontWeight: "bold",
        width: "120px",
        height: "40px",
      }}
      className="no-print"
    >
      {isLoading ? <span>Logging out</span> : <>Logout</>}
      <i className="bi bi-box-arrow-right" style={{ margin: "6px" }}></i>
    </Button>
  );
}

export default LogoutButton;
