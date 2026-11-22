import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const ACCESS = "sessionClient";
const REFRESH = "sessionClientRefresh";

type TokenPayload = {
  sub: string; 
};

export const getToken = () => Cookies.get(ACCESS) ?? null;
export const getRefreshToken = () => Cookies.get(REFRESH) ?? null;

export function getUserId(): string | null {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode<TokenPayload>(token).sub;
  } catch {
    return null; // token inválido
  }
}

export function setSession(access: string, refresh: string,) {
  const opts = { expires: 1, sameSite: "strict" as const };
  Cookies.set(ACCESS, access, opts);
  Cookies.set(REFRESH, refresh, opts);
  
}

export function removeTokens() {
  Cookies.remove(ACCESS);
  Cookies.remove(REFRESH);
  
}
