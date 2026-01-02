import axios from "axios";
import type { AxiosResponse } from "axios";
import type { Note, NoteTag } from "../types/note";

const api = axios.create({
  baseURL: import.meta.env.VITE_NOTEHUB_API,
});

api.interceptors.request.use((config) => {
  const token = import.meta.env.VITE_NOTEHUB_TOKEN;

  
  config.headers = config.headers ?? {};
  config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteRequest {
  title: string;
  content: string; 
  tag: NoteTag;
}

export const fetchNotes = async (params: {
  page: number;
  perPage: number;
  search?: string;
}): Promise<FetchNotesResponse> => {
  const res: AxiosResponse<FetchNotesResponse> = await api.get("/notes", {
    params: {
      page: params.page,
      perPage: params.perPage,
      search: params.search || undefined,
    },
  });

  return res.data;
};

export const createNote = async (payload: CreateNoteRequest): Promise<Note> => {
  const res: AxiosResponse<Note> = await api.post("/notes", payload);
  return res.data;
};


export const deleteNote = async (id: string): Promise<Note> => {
  const res: AxiosResponse<Note> = await api.delete(`/notes/${id}`);
  return res.data;
};
