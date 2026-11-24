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
    <form className="dig-form" onSubmit={handleSubmit}>
        <label className="field">
            <span className="field__label">Titre</span>
            <input className="field__input"
                   value={form.title}
                   required
                   onChange={(e) => update("title", e.target.value)}
            />
        </label>
        <div className="field-row">
            <label className="field">
                <span className="field__label">Durée (minutes)</span>
                <input className="field__input"
                       value={form.time_minutes}
                       required
                       min="1"
                       type="number"
                       onChange={(e) => update("time_minutes", e.target.value)}
                />
            </label>
            <label className="field">
                <span className="field__label">Nombre de bénévoles</span>
                <input className="field__input"
                       value={form.number_people}
                       required
                       min="1"
                       type="number"
                       onChange={(e) => update("number_people", e.target.value)}
                />
            </label>
        </div>
        <label className="field">
            <span className="field__label">Quand</span>
            <input className="field__input"
                   value={form.date_time}
                   required
                   type="datetime-local"
                   onChange={(e) => update("date_time", e.target.value)}
            />
        </label>
        <fieldset className="field">
            <legend className="field__label">Projets</legend>
            {tags.status === "loading" && <p className="field__hint">Chargement</p>}
            {tags.status === "error" && <p className="field__hint">{tags.message}</p>}
            {tags.status === "success" &&
                <div className="tag-list">
                    {tags.data.map((tag) => (
                    <label className="tag-option" key={tag.id}>
                        <input
                                type="checkbox"
                                checked={form.tags.includes(tag.name)}
                                onChange={(e) => toggleTag(tag.name, e.target.checked)}
                        />
                        {tag.name}
                    </label>
                    ))}
                </div>
            }
        </fieldset>
        <label className="field">
            <span className="field__label">Description</span>
            <textarea className="field__input field__input--textarea"
                      value={form.description}
                      onChange={(e) => update("description", e.target.value)}
            />
        </label>
        <div className="dig-form__actions">
            <button className="btn" type="submit">Soumettre</button>
            {error && <p className="dig-form__error" role="alert">{error}</p>}
        </div>
    </form>
    );
};
