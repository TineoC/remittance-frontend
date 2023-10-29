import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Spinner from "react-bootstrap/Spinner";

import { MEGABYTE } from "../../utils/consts";
import classes from "./CancelFileUploadForm.module.css";

interface Props {
  title?: string;
  onSubmit: (formData: FormData) => void;
  loading: boolean;
  disabled?: boolean;
}

const CancelFileUploadForm: React.FC<Props> = ({ title, onSubmit, loading, disabled = false }) => {
  const [validated, setValidated] = useState(false);
  const [isInvalidFile, setIsInvalidFile] = useState(false);

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const formData = new FormData(event.currentTarget);
    const file = formData.get("file") as File;

    if (event.currentTarget.checkValidity() === false) {
      setValidated(true);
    } else if (
      file.name.trim() !== "" &&
      (file.size <= 0 || file.size > MEGABYTE * 30)
    ) {
      setValidated(true);
      setIsInvalidFile(true);
    } else {
      formData.append("subsidyId", "1");
      formData.append("senderId", "1");
      onSubmit(formData);
    }
  };

  return (
    <Form
      noValidate
      validated={validated}
      className="file-upload-form"
      onSubmit={onSubmitHandler}
    >
      {title && (
        <h1 className={classes.title}>
          <strong>{title}</strong>
        </h1>
      )}
      
      <Form.Group className="mb-3" controlId="file">
        <Form.Label className={classes["lbl-file-upload"]}>
          Seleccionar archivo:
        </Form.Label>
        <Form.Control
          name="file"
          className={classes["btn-file-upload"]}
          type="file"
          accept=".csv"
          disabled={loading}
          required
          isInvalid={isInvalidFile}
        />
        <Form.Control.Feedback type="invalid">
          {isInvalidFile
            ? "El archivo no puede estar vacío ni exceder los 30 megabytes."
            : "Favor seleccionar un archivo."}
        </Form.Control.Feedback>
      </Form.Group>

      <InputGroup>
        <InputGroup.Text>Comentario</InputGroup.Text>
        <Form.Control
          as="textarea"
          aria-label="Comentario"
          name="concept"
          placeholder="Descripción del archivo"
          rows={3}
          cols={30}
          required
          disabled={loading}
        />
        <Form.Control.Feedback type="invalid">
          Campo requerido
        </Form.Control.Feedback>
      </InputGroup>
      <div className={classes["btn-submit"]}>
        <Button type="submit" disabled={loading || disabled}>
          Enviar
        </Button>
        {loading && <Spinner animation="border" variant="primary" />}
      </div>
    </Form>
  );
};
export default CancelFileUploadForm;
