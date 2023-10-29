import { useState, useCallback } from "react";

import CancelFileUploadForm from "../../components/CancelFileUploadForm";
import { Message } from "../../components/Message";
import { postFormData } from "../../utils";
import { CancelFileUploadServiceName } from "../../utils/consts";

const CancelFileUpload: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [successResponse, setSuccessResponse] = useState(false);
  const [message, setMessage] = useState<string | undefined>();

  const onSubmitHandler = useCallback((formData: FormData) => {
    setLoading(true);
    postFormData(CancelFileUploadServiceName, formData)
      .then((response) => {
        console.log({ response1: response });

        if (response.result === "Ok") {
          setSuccessResponse(true);

          const { totalRows, totalAmount } = response.data;
          const formatAmount = new Intl.NumberFormat("es-DO", {
            style: "currency",
            currency: "DOP",
          });

          const message = `Archivo Enviado correctamente: Monto total a cancelar: ${formatAmount.format(
            totalAmount
          )} - Cantidad remesas a cancelar: ${totalRows}`;

          setMessage(message);
        } else {
          setSuccessResponse(false);
          setMessage(response.data?.Message || response.message);
        }
      })
      .catch((error) => {
        setSuccessResponse(false);
        setMessage(error.data?.Message || error.message);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <CancelFileUploadForm
        title="Cancelación de Remesas"
        onSubmit={onSubmitHandler}
        loading={loading}
      />
      {message !== undefined && (
        <Message
          variant={successResponse ? "success" : "danger"}
          onClose={() => setMessage(undefined)}
        >
          {message}
        </Message>
      )}
    </>
  );
};

export default CancelFileUpload;
