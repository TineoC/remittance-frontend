import React, { useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Spinner from "react-bootstrap/Spinner";

import {
  INVALID_FILE_BY_NAME as INVALID_FILE_BY_NAME_MESSAGE,
  INVALID_FILE_BY_SIZE as INVALID_FILE_BY_SIZE_MESSAGE,
  MEGABYTE,
} from "../../utils/consts";
import classes from "./FileUploadForm.module.css";
import { Sender, Subsidy } from "../../pages/FileUpload/types";

interface Option {
  key: number;
  value: string;
  code: string;
}

interface Props {
  title?: string;
  onSubmit: (formData: FormData) => void;
  loading: boolean;
  disabled?: boolean;
  programs?: Array<Sender>;
}

type InvalidFileError = {
  error: boolean;
  message: string;
};

const INVALID_FILE_INITIAL_STATE = { error: false, message: "" };

const FileUploadForm: React.FC<Props> = ({
  title,
  onSubmit,
  loading,
  disabled = false,
  programs = [],
}) => {
  const [validated, setValidated] = useState(false);
  const [isInvalidFile, setIsInvalidFile] = useState<InvalidFileError>(
    INVALID_FILE_INITIAL_STATE
  );
  const [selectedProgram, setSelectedProgram] = useState<Sender>();
  const [selectedSubsidy, setSelectedSubsidy] = useState<Subsidy>();

  const programsOptions = useMemo<Array<Option>>(
    () =>
      programs.map((program) => ({
        key: program.id,
        value: program.name,
        code: program.code,
      })),
    [programs]
  );

  const subsidiesOptions = useMemo<Array<Option> | undefined>(
    () =>
      selectedProgram?.subsidies.map((subsidy) => ({
        key: subsidy.id,
        value: subsidy.name,
        code: subsidy.code,
      })),
    [selectedProgram]
  );

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const formData = new FormData(event.currentTarget);
    const file = formData.get("file") as File;

    const FORM_IS_VALID = event.currentTarget.checkValidity() === false;

    if (!FORM_IS_VALID) {
      setValidated(true);
    }

    if (!isFileValid(file)) {
      return;
    }

    setIsInvalidFile(INVALID_FILE_INITIAL_STATE);
    onSubmit(formData);
  };

  function isFileValid(file: File): boolean {
    const FILE_SIZE_LIMIT = 30 * MEGABYTE; // 30 MB

    if (file.name.trim() === "") {
      setValidated(true);
      setIsInvalidFile({
        error: true,
        message: "Favor seleccionar un archivo.",
      });
      return false;
    }

    if (file.size <= 0 || file.size > FILE_SIZE_LIMIT) {
      setValidated(true);
      setIsInvalidFile({
        error: true,
        message: INVALID_FILE_BY_SIZE_MESSAGE,
      });
      return false;
    }

    if (!isFilenameRelatedToSubsidy(file)) {
      setValidated(true);
      setIsInvalidFile({
        error: true,
        message: INVALID_FILE_BY_NAME_MESSAGE,
      });
      return false;
    }

    return true;
  }

  const onProgramChangeHandler = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const valSelected = event.currentTarget.value;
    const programSelected = programs.find(
      (program) => program.id === parseInt(valSelected)
    );
    setSelectedProgram(programSelected);
  };

  const onSubsidyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (!selectedProgram) return;

    const selectedSubsidyId = event.currentTarget.value;
    const selectedSubsidy = selectedProgram.subsidies.find(({ id }) => {
      return id === parseInt(selectedSubsidyId);
    });
    setSelectedSubsidy(selectedSubsidy);
  };

  function isFilenameRelatedToSubsidy(file: File): boolean {
    if (!file || !selectedSubsidy || !selectedProgram) return false;

    const { code: selectedSubsidyCode } = selectedSubsidy;

    const REGEX = `^${selectedSubsidyCode}\\x*`;
    const regExpression = new RegExp(REGEX);

    const filenameWithoutExtension = file.name.substring(
      0,
      file.name.lastIndexOf(".")
    );

    return regExpression.test(filenameWithoutExtension);
  }

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

      <Form.Group className="mb-3" controlId="senderId">
        <Form.Label>Organización:</Form.Label>
        <Form.Select
          aria-label="Default select example"
          name="senderId"
          disabled={disabled}
          onChange={onProgramChangeHandler}
          required
        >
          <option value="">Seleccione la organización</option>
          {programsOptions.map((pOption) => (
            <option key={pOption.key} value={pOption.key}>
              {pOption.value}
            </option>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          Favor seleccionar una organización.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="subsidyId">
        <Form.Label>Subsidio:</Form.Label>
        <Form.Select
          aria-label="Default select example"
          name="subsidyId"
          disabled={disabled}
          onChange={onSubsidyChange}
          required
        >
          <option value="">Seleccione el subsidio</option>
          {subsidiesOptions?.map((sOption) => (
            <option key={sOption.key} value={sOption.key}>
              {sOption.value}
            </option>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          Favor seleccionar un subsidio.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="file">
        <Form.Label className={classes["lbl-file-upload"]}>
          Seleccionar archivo:
        </Form.Label>
        <Form.Control
          name="file"
          className={classes["btn-file-upload"]}
          type="file"
          accept=".csv"
          disabled={loading || disabled}
          isInvalid={isInvalidFile.error}
          required
        />
        <Form.Control.Feedback type="invalid">
          {isInvalidFile.message}
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
          disabled={loading || disabled}
        />
        <Form.Control.Feedback type="invalid">
          Favor escribir una descripción al archivo.
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
export default FileUploadForm;
