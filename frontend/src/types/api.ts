export interface Tag {
    id: number;
    name: string;
    amount_work_done_minutes: number;
}

export interface TrailDig {
    id: number;
    title: string;
    time_minutes: number;
    number_people: number;
    link: string;
    tags: Tag[];
    date_time: string;
}

export interface TrailDigDetail extends TrailDig {
    description: string;
}

export type NewTrailDig =
  Omit<TrailDigDetail, "link" | "tags" | "id" | "description"> &
  Partial<Pick<TrailDigDetail, "link" | "description">> &
  { tags?: Pick<Tag, "name">[]; };
