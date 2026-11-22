import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { getToken, removeTokens } from "../../lib/cookie";
import { api } from "../../service/apiClient";
import { ModalLoading } from "../loadingComponent/LoadingComponent";
import { ModalErro } from "../erroComponete/ErroComponent";
import { useApp } from "../../context/Context";

export function PrivateRoute() {
  const [status, setStatus] = useState<"loading" | "valid" | "invalid" | "">(
    "loading"
  );

  const {setLoggedIn} = useApp()

  useEffect(() => {
  const token = getToken();
  

  if (token) {
    api
      .get(`/auth/valid/client`)
      .then(() => {
          setLoggedIn(true)
          setStatus("valid")
      })
      .catch(() => {
        removeTokens();
        setLoggedIn(false)
        setStatus("invalid");
      });
  }
  

  setStatus("")
  
  return 

}, []);

  if (status === "loading") return <ModalLoading aberto={status === "loading" ? true : false} mensagem="Carredando informaçoes"/>;

  if (status === "invalid") return <ModalErro
                                    aberto={status === "invalid" ? true : false}
                                    mensagem="Usuario inexistente"
                                    titulo="Erro Usuairo"
                                    onFechar = {()=> setStatus("")}
                                    />;

  return <Outlet />;
}