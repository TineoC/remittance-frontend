import { useCallback, useState } from "react";

import FileUploadForm from "../../components/FileUploadForm";
import { Message } from "../../components/Message";
import { get, postFormData } from "../../utils";
import { FileUploadServiceName, SenderFileName } from "../../utils/consts";
import { Sender } from "./types";
import { useFetch } from "../../hooks/useFetch";
import useSenders from "../../hooks/use-senders";

const FileUpload: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [successResponse, setSuccessResponse] = useState(false);
  const [message, setMessage] = useState<string | undefined>();
  const { getActivePrograms } = useSenders();
  const {
    loading: senderLoading,
    success: senderSuccessResponse,
    errorMessage: senderErrorMessage,
    data: programs,
    setErrorMessage: senderSetErrorMessage,
  } = useFetch<Array<Sender>>({
    functionToExecute: () => get(SenderFileName),
  });
  const onSubmitHandler = useCallback(
    (formData: FormData) => {
      setLoading(true);
      postFormData(FileUploadServiceName, formData)
        .then((response) => {
          if (response.result === "Ok") {
            setSuccessResponse(true);

            const { totalRows, totalAmount } = response.data;
            const formatAmount = new Intl.NumberFormat("es-DO", {
              style: "currency",
              currency: "DOP",
            });

            const message = `Archivo enviado correctamente: Monto total: ${formatAmount.format(
              totalAmount
            )} 
            – Cantidad Registros: ${totalRows}. Se enviará por correo electrónico el resultado al finalizar el proceso de la carga.`;

            setMessage(message);
          } else {
            setSuccessResponse(false);
            setMessage(response.data?.Message || response.message);
            return;
          }
        })
        .catch((error) => {
          setSuccessResponse(false);
          setMessage(error.data?.Message || error.message);
        })
        .finally(() => setLoading(false));
    },
    [setLoading, setMessage, setSuccessResponse]
  );

  const activePrograms = getActivePrograms(programs!);

  return (
    <>
      <FileUploadForm
        title="Envío de Remesas"
        onSubmit={onSubmitHandler}
        loading={loading || senderLoading}
        disabled={activePrograms === undefined}
        programs={activePrograms}
      />
      {(message !== undefined || senderErrorMessage !== undefined) && (
        <Message
          variant={
            successResponse && senderSuccessResponse ? "success" : "danger"
          }
          onClose={() => {
            setMessage(undefined);
            senderSetErrorMessage(undefined);
          }}
        >
          {message || senderErrorMessage}
        </Message>
      )}
    </>
  );
};

export default FileUpload;
