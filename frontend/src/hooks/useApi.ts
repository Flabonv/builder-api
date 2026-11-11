import { useEffect, useState } from "react";
import { ApiError } from "../api";

export type Loadable<T> =
  | {status: "loading"}
  | {status: "error"; message: string}
  | {status: "success"; data: T};

export function useApi<T>(fetcher: () => Promise<T>): Loadable<T> {
    const [loaded, set] = useState<Loadable<T>>({status: "loading"});
    useEffect(() => {
      let ignore = false;
      fetcher()
        .then((result) => {
          if (!ignore) {
            set({status: "success", data: result});
          }
        })
        .catch((err: unknown) => {
          if (!ignore) {
            if (err instanceof ApiError) {
                set({status: "error", message: err.detail ?? `Erreur ${err.status}`})
            } else {
                set({status: "error", message: "Erreur lors du chargement des données..." })
            }
          }
        });
      return () => {ignore = true;};
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetcher must be stable (a module-level function)
    }, []);

    return loaded;
  }
