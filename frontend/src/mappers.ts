import type { DigFormValues } from "./components/DigForm";
import type { ItemProps } from "./components/Item";
import type { NewTrailDig, Tag, TrailDig, TrailDigDetail } from "./types/api";

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
    href: `/digs/${dig.id}`
 };
 return item;
}

export function digFormToPayload(form: DigFormValues) : NewTrailDig {
  return {
    title: form.title,
    time_minutes: Number(form.time_minutes),
    number_people: Number(form.number_people),
    date_time: form.date_time,
    tags: form.tags.map((n) => ({name: n})),
    description: form.description
  };
}

export function digToDigForm(dig: TrailDigDetail): DigFormValues {
  return {
    title: dig.title,
    time_minutes: String(dig.time_minutes),
    number_people: String(dig.number_people),
    date_time: dig.date_time.slice(0, 16),
    description: dig.description,
    tags: dig.tags.map((t) => (t.name))
  };
}

// Digs from today on, soonest first.
export function upcomingDigs(digs: TrailDig[], today: Date): TrailDig[] {
    return digs.filter((d) => new Date(d.date_time) >= today)
               .sort((a, b) => a.date_time.localeCompare(b.date_time));
}

// Digs before today, most recent first.
export function pastDigs(digs: TrailDig[], today: Date): TrailDig[] {
    return digs.filter((d) => new Date(d.date_time) < today)
               .sort((a, b) => b.date_time.localeCompare(a.date_time));
}
