import type { Entry, EntryDto } from "../types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

async function get<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { signal });
  if (!res.ok) throw new Error(`Erreur ${res.status} sur ${path}`);
  return (await res.json()) as T;
}

// Map the backend DTO to the UI model. Edit here if field names differ.
const normalize = (e: EntryDto): Entry => ({
  id: e.id,
  title: e.title,
  description: e.description,
  volunteers: e.volunteers,
  schedule: e.schedule,
});

export const fetchProjects = (signal?: AbortSignal): Promise<Entry[]> =>
  get<EntryDto[]>("/projects", signal).then((list) => list.map(normalize));

export const fetchChores = (signal?: AbortSignal): Promise<Entry[]> =>
  get<EntryDto[]>("/chores", signal).then((list) => list.map(normalize));
