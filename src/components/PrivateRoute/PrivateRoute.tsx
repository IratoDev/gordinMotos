import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getToken, removeTokens } from "../../lib/cookie";
import { api } from "../../service/apiClient";
import { ModalLoading } from "../loadingComponent/LoadingComponent";

export function PrivateRoute() {
  const [status, setStatus] = useState<"loading" | "valid" | "invalid">(
    "loading"
  );

  useEffect(() => {
  const token = getToken();
  

  if (!token) {
    setStatus("invalid");
    return
  }

  api
    .get(`/auth/valid`)
    .then(() => {
        //removeUserPublicId();
        setStatus("valid")
    })
    .catch(() => {
      removeTokens();
      setStatus("invalid");
    });
}, []);

console.log(status)

  if (status === "loading") return <ModalLoading aberto={status === "loading" ? true : false} mensagem="Carredando informaçoes"/>;
  if (status === "invalid") return <Navigate to="/" replace />;

  return <Outlet />;
}