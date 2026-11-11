import type { ItemProps } from "./components/Item";
import type { Tag, TrailDig } from "./types/api";

export function tagToItem(tag: Tag): ItemProps {
  return {
      id: tag.id,
      title: tag.name,
      meta: `${(Math.round(tag.amount_work_done_minutes / 60))} heures complétées.`
  }
}

export function digToItem(dig: TrailDig): ItemProps {
 const digDate = new Date(dig.date_time).toLocaleDateString("fr-CA", { weekday: "long", day: "numeric", month: "long" })
 const item: ItemProps = {
    id: dig.id,
    title: dig.title,
    meta: `${dig.number_people} bénévole(s)`,
    detail: digDate,
 };
 return item;
}

export function upcomingDigs(digs: TrailDig[], today: Date): TrailDig[] {
    return digs.filter((d) => new Date(d.date_time) >= today)
               .sort((a, b) => a.date_time.localeCompare(b.date_time))
               .slice(0, 5);
}
