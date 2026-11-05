import type {Tag, TrailDig, NewTrailDig, TrailDigDetail} from "./api";

export const sampleTag: Tag = {
    "id": 1,
    "name": "Chomeuse",
    "amount_work_done_minutes": 120
  }

export const sampleTrailDig: TrailDig = {
    "id": 1,
    "title": "Gros jump dans la chomeuse",
    "time_minutes": 120,
    "number_people": 10,
    "link": "",
    "tags": [
      {
        "id": 1,
        "name": "Chomeuse",
        "amount_work_done_minutes": 120
      }
    ],
    "date_time": "2025-02-11T12:00:00"
  }

export const sampleNewTrailDig: NewTrailDig = {
    "title": "Gros jump dans la chomeuse",
    "time_minutes": 120,
    "number_people": 10,
    "link": "",
    "tags": [
      {
        "name": "Chomeuse",
      }
    ],
    "date_time": "2025-02-11T12:00:00",
    "description": "A description",
  }

export const sampleTrailDigDetail: TrailDigDetail = {
  "id": 1,
  "title": "Gros jump dans la chomeuse",
  "time_minutes": 120,
  "number_people": 10,
  "link": "",
  "tags": [
    {
      "id": 1,
      "name": "Chomeuse",
      "amount_work_done_minutes": 120
    }
  ],
  "date_time": "2025-02-11T12:00:00",
  "description": ""
}

export const minimal: NewTrailDig = {
  title: "x", time_minutes: 60, number_people: 2, date_time: "2025-02-11T12:00:00",
};

// Should NOT compile: a tag with extra fields
export const badTag: NewTrailDig = {
  ...minimal,
  // @ts-expect-error tags only take a name
  tags: [{ id: 1, name: "Chomeuse" }],
};
