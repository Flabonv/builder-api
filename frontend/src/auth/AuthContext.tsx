import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { login as apiLogin, getMe } from "../api";
import { AuthContext } from "./useAuth";
import type { AuthState } from "./useAuth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() =>
    localStorage.getItem("token") ? {status: "checking"} : { status : "anonymous"}
  );

  useEffect(() => {
    let ignore = false;
    const token = localStorage.getItem("token");
    if (!token)
        return;

    getMe(token)
    .then((result) =>
        { if (!ignore)
            setState({
                status: "authenticated", token, user: result
            });
        })
    .catch(() => {
        if (!ignore) {
            localStorage.removeItem("token");
            setState({status: "anonymous"});
        }
    });
    return () => { ignore = true; };
    }, []);

  async function login(email: string, password: string) {
    const { token } = await apiLogin({email, password});
    const me = await getMe(token);
    localStorage.setItem("token", token);
    setState({status: "authenticated", token: token, user: me})
  }

  function logout() {
    localStorage.removeItem("token");
    setState({status: "anonymous"});
  }

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
