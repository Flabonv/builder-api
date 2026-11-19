import { useState } from "react";
import { ApiError, getTags } from "../api";
import { useApi } from "../hooks/useApi";
import type { SubmitEvent } from "react";
import type { NewTrailDig } from "../types/api";
import { digFormToPayload } from "../mappers";

export interface DigFormValues {
    title: string;
    time_minutes: string;
    number_people: string;
    tags: string[];
    date_time: string;
    description: string;
}

const empty: DigFormValues = {
    title: "",
    time_minutes:  "",
    number_people: "",
    tags: [],
    date_time: "",
    description: "",
};

interface DigFormProps {
    initial?: DigFormValues;
    onSubmit: (payload: NewTrailDig) => Promise<void>
}

export default function DigForm({initial, onSubmit}: DigFormProps) {
    const [form, setForm] = useState<DigFormValues>(initial ?? empty);
    const [error, setError] = useState<string | null>(null)
    const tags = useApi(getTags);

    function update<K extends keyof DigFormValues>(key: K, value: DigFormValues[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }
    function toggleTag(name: string, checked: boolean) {
        const newTags = checked ?
            [...form.tags, name] :
            form.tags.filter((t) => (t !== name));

        update("tags", newTags);
    }
    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        const payload = digFormToPayload(form);
        try {
           await onSubmit(payload)
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                const message = err.fields.non_field_errors?.[0] ?? err.detail ?? "Enregistrement refusé.";
                setError(message);
            } else {
                setError("Impossible de joindre le serveur.");
            }
        }
    }

    return (
    <form onSubmit={handleSubmit}>
        <input value={form.title}
               required
               placeholder="Titre"
               aria-label="Titre"
               onChange={(e) => update("title", e.target.value)}
        />
        <input value={form.time_minutes}
               required
               min="1"
               type="number"
               placeholder="Durée (minutes)"
               aria-label="Durée"
               onChange={(e) => update("time_minutes", e.target.value)}
        />
        <input value={form.number_people}
               required
               min="1"
               type="number"
               placeholder="Nombre de bénévoles"
               aria-label="Nombre de bénévoles"
               onChange={(e) => update("number_people", e.target.value)}
        />
        {tags.status === "loading" && <p>Chargement</p>}
        {tags.status === "error" && <p>{tags.message}</p>}
        {tags.status === "success" &&
            <fieldset>
                <legend>Projets</legend>
                {tags.data.map((tag) => (
                <label key={tag.id}>
                    <input
                            type="checkbox"
                            checked={form.tags.includes(tag.name)}
                            onChange={(e) => toggleTag(tag.name, e.target.checked)}
                    />
                    {tag.name}
                </label>
                ))}
            </fieldset>
        }
        <input value={form.date_time}
               required
               type="datetime-local"
               placeholder="Quand?"
               aria-label="Quand?"
               onChange={(e) => update("date_time", e.target.value)}
        />
        <textarea value={form.description}
                  placeholder="Description..."
                  aria-label="Description"
                  onChange={(e) => update("description", e.target.value)}
        />
       <button className="btn" type="submit">Soumettre</button>
       {error && <p role="alert">{error}</p>}
    </form>
    );
};
