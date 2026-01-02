import { useState } from "react";
import { useDebounce } from "use-debounce";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

import css from "./App.module.css";

import { fetchNotes, createNote, deleteNote } from "../../services/noteService";

import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";

const PER_PAGE = 12;

export default function App() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [debouncedSearch] = useDebounce(searchQuery, 300);

  const queryClient = useQueryClient();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { data, isFetching, isError } = useQuery({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search: debouncedSearch,
      }),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchQuery} onChange={handleSearchChange} />

        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}

        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      {isFetching && <div>Loading...</div>}
      {isError && <div>Something went wrong</div>}

      {notes.length > 0 && (
        <NoteList notes={notes} onDelete={(id) => deleteMutation.mutate(id)} />
      )}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm
            onCancel={closeModal}
            isSubmitting={createMutation.isPending}
            onSubmit={(values) => createMutation.mutate(values)}
          />
        </Modal>
      )}
    </div>
  );
}
