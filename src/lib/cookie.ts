import Cookies from "js-cookie";

const ACCESS = "sessionAdmin";
const REFRESH = "sessionRefresh";

export const getToken = () => Cookies.get(ACCESS) ?? null;
export const getRefreshToken = () => Cookies.get(REFRESH) ?? null;


export function setSession(access: string, refresh: string,) {
  const opts = { expires: 1, sameSite: "strict" as const };
  Cookies.set(ACCESS, access, opts);
  Cookies.set(REFRESH, refresh, opts);
  
}

export function removeTokens() {
  Cookies.remove(ACCESS);
  Cookies.remove(REFRESH);
  
}
