/** One project or one chore, as used by the UI. */
export interface Entry {
  id: number | string;
  title: string;
  description: string;
  volunteers: number;
  schedule: string;
}

/** Shape returned by the backend. Adjust to match your API. */
export interface EntryDto {
  id: number | string;
  title: string;
  description: string;
  volunteers: number;
  schedule: string;
}

export type FetchStatus = "loading" | "success" | "error";
