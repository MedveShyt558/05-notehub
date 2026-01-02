import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import css from "./NoteForm.module.css";
import type { NoteTag } from "../../types/note";

interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

interface NoteFormProps {
  onCancel: () => void;
  onSubmit: (values: NoteFormValues) => void;
  isSubmitting: boolean;
}

const schema = Yup.object({
  title: Yup.string().min(3).max(50).required("Title is required"),
  content: Yup.string().max(500, "Max 500 characters"),
  tag: Yup.mixed<NoteTag>()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Tag is required"),
});

export default function NoteForm({ onCancel, onSubmit, isSubmitting }: NoteFormProps) {
  const initialValues: NoteFormValues = {
    title: "",
    content: "",
    tag: "Todo",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={(values) => onSubmit(values)}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" name="title" type="text" className={css.input} />
          <span className={css.error}>
            <ErrorMessage name="title" />
          </span>
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            as="textarea"
            id="content"
            name="content"
            rows={8}
            className={css.textarea}
          />
          <span className={css.error}>
            <ErrorMessage name="content" />
          </span>
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field as="select" id="tag" name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <span className={css.error}>
            <ErrorMessage name="tag" />
          </span>
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={isSubmitting}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
