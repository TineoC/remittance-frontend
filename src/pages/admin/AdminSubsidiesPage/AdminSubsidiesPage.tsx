import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  TableContainer,
  TableData,
  TableHead,
} from "../../../components/Table";
import useSubsidies, {
  CreateSubsidyPayload,
  UpdateSubsidyPayload,
  SUBSIDY_MESSAGE_VALIDATION_REGEXP,
  DEFAULT_SUBSIDY_VALID_TIME_IN_HOURS,
} from "../../../hooks/use-subsidies";
import { Sender, Subsidy } from "../../FileUpload/types";
import { Button, Form, Spinner } from "react-bootstrap";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useModal, Modal } from "../../../components/Modal";
import { State, Actions } from "../../../components/Modal/Modal";
import * as z from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Error from "../../../components/Error";
import useSenders from "../../../hooks/use-senders";
import HelpText from "../../../components/HelpText";

const columns = [
  "Código",
  "Nombre",
  "Mensaje",
  "Vigencia (en horas)",
  "Editar",
  "Estado",
];

const createSubsidySchema = z.object({
  code: z.string().min(1, "El código es un campo requerido").max(50),
  name: z.string().min(1, "El nombre es un campo requerido").max(150),
  message: z
    .string()
    .min(1, "El mensaje es un campo requerido")
    .max(130, "El mensaje tiene un máximo de 130 caracteres")
    .regex(
      SUBSIDY_MESSAGE_VALIDATION_REGEXP,
      "El mensaje es inváldo. Los mensajes deben poseer todas las llaves dentro de corchetes y en secuencia."
    ),
  validTime: z.number().min(1, "La vigencia debe ser mayor o igual a uno"),
  active: z.string(),
});

const updateSubsidySchema = z.object({
  code: z.string().min(1, "El código es un campo requerido").max(50),
  name: z.string().min(1, "El nombre es un campo requerido").max(150),
  message: z
    .string()
    .min(1, "El mensaje es un campo requerido")
    .max(130, "El mensaje tiene un máximo de 130 caracteres")
    .regex(
      SUBSIDY_MESSAGE_VALIDATION_REGEXP,
      "El mensaje es inváldo. Los mensajes deben poseer todas las llaves dentro de corchetes y en secuencia."
    ),
  validTime: z.number().min(1, "La vigencia debe ser mayor o igual a uno"),
});

type CreateFormSchemaType = z.infer<typeof createSubsidySchema>;
type UpdateFormSchemaType = z.infer<typeof updateSubsidySchema>;

function Header(props: { senderName: string }) {
  const { state, actions } = useModal();

  const createSubsidyModalHeader = `Crear subsidio de ${props.senderName}`;

  return (
    <header className="w-100 d-flex align-items-center justify-content-between mb-3">
      <div>
        <Link to="/admin-sender">
          <Button size="sm" className="d-flex gap-2 fs-6" variant="primary">
            <span>Volver atrás</span>
            <i className="bi bi-arrow-return-left text-white"></i>
          </Button>
        </Link>
        <span className="fs-3 fw-bold">Subsidios de {props.senderName}</span>
      </div>

      <Button
        onClick={actions.open}
        size="sm"
        className="d-flex align-self-start gap-2 fs-6"
        variant="primary"
      >
        <i className="bi bi-plus-lg text-white" />
        <span>Crear Subsidio</span>
      </Button>

      <CreateModal
        header={createSubsidyModalHeader}
        state={state}
        actions={actions}
      />
    </header>
  );
}

export default function AdminSubsidiesPage() {
  const { senderId } = useParams();
  const { getSenderById } = useSenders();
  const sender = getSenderById(Number(senderId));

  if (!sender) return null;

  return (
    <>
      <Header senderName={sender.name} />
      <TableContainer>
        <TableHead columns={columns} />

        <TableBody />
      </TableContainer>
    </>
  );
}

function TableBody() {
  const { senderId } = useParams();
  const { getSubsidiesBySenderId } = useSubsidies();

  const subsidies = getSubsidiesBySenderId(Number(senderId));

  if (!subsidies) return null;

  return (
    <tbody>
      {subsidies.map((subsidy) => {
        return <SubsidyRow key={subsidy.code} {...subsidy} />;
      })}
    </tbody>
  );
}

function SubsidyRow(props: Subsidy) {
  const [subsidy, setSubsidy] = useState<Subsidy>(props);
  const { code, name, message, validTime, active } = subsidy;
  const { state, actions } = useModal();
  const { state: updateModalState, actions: updateModalActions } = useModal();

  return (
    <>
      <tr>
        <TableData>{code}</TableData>
        <TableData>{name}</TableData>
        <TableData>{message}</TableData>
        <TableData>{validTime}</TableData>
        <TableData>
          <Button onClick={updateModalActions.open} disabled={!active}>
            <i className="bi bi-pencil-fill" />
          </Button>
        </TableData>
        <TableData>
          <Form>
            <Form.Check
              checked={active}
              onChange={actions.open}
              type="switch"
            />
          </Form>
        </TableData>
      </tr>

      <StatusModal
        state={state}
        actions={actions}
        subsidy={subsidy}
        setSubsidy={setSubsidy}
      />

      <UpdateModal
        state={updateModalState}
        actions={updateModalActions}
        subsidy={subsidy}
        setSubsidy={setSubsidy}
      />
    </>
  );
}

function StatusModal(props: {
  state: State;
  actions: Actions;
  subsidy: Subsidy;
  setSubsidy: React.Dispatch<React.SetStateAction<Subsidy>>;
}) {
  const { subsidy, setSubsidy, state, actions: modal } = props;
  const { id: subsidyId, active: isActive, name: subsidyName } = subsidy;

  const actionString = !isActive ? "Habilitar" : "Deshabilitar";
  const title = `${actionString} ${subsidyName}`;
  const body = `¿Estás seguro de que quieres ${actionString.toLowerCase()} al subsidio ${subsidyName}?`;

  const { updateSubsidyActiveValue } = useSubsidies();

  const { refetch: updateStatus, isRefetching: isLoading } = useQuery({
    enabled: false,
    queryKey: ["subsidy-status", subsidyId],
    queryFn: () => updateSubsidyActiveValue(subsidyId),
  });

  const handleAction = () => {
    updateStatus();
    setSubsidy((oldSubsidy) => {
      return {
        ...oldSubsidy,
        active: !isActive,
      };
    });
    modal.close();
  };

  const footer = (
    <>
      <Button
        className="bg-secondary text-white"
        variant="secondary"
        onClick={modal.close}
      >
        Cancelar
      </Button>
      <Button
        className="bg-primary"
        variant="primary"
        onClick={handleAction}
        disabled={isLoading}
      >
        {actionString}
      </Button>
    </>
  );

  return (
    <Modal
      state={state}
      actions={modal}
      title={title}
      body={body}
      footer={footer}
    />
  );
}

function CreateModal(props: {
  header: string;
  actions: Actions;
  state: State;
}) {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting: loading },
  } = useForm<CreateFormSchemaType>({
    resolver: zodResolver(createSubsidySchema),
    defaultValues: {
      validTime: DEFAULT_SUBSIDY_VALID_TIME_IN_HOURS,
    },
  });
  const queryClient = useQueryClient();
  const { actions: modal, state, header } = props;
  const { createSubsidy } = useSubsidies();
  const { senderId } = useParams();

  const senders: Sender[] = queryClient.getQueryData(["senders"]) ?? [];

  const { mutateAsync } = useMutation({
    mutationFn: (newSubsidy: CreateSubsidyPayload) => {
      return createSubsidy(newSubsidy);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["senders"] });
    },
  });

  function handleCloseModal() {
    reset();
    modal.close();
  }

  const onSubmit: SubmitHandler<CreateFormSchemaType> = async ({
    name,
    code,
    message,
    validTime,
    active,
  }) => {
    const subsidyCodes: string[] = [];

    senders.forEach(({ subsidies }) => {
      if (subsidies.length === 0) return false;

      return subsidies.map(({ code }) => {
        return subsidyCodes.push(code);
      });
    });

    if (subsidyCodes.includes(code)) {
      setError("code", {
        message: "El código de subsidio ya existe.",
      });
      return;
    }

    try {
      const payload = {
        codigo: code,
        nombre: name,
        mensaje: message,
        remesador: Number(senderId),
        vigencia: validTime,
        activo: Boolean(active),
      };

      await mutateAsync(payload);

      handleCloseModal();
    } catch (error: any) {
      setError("root", {
        message: error.message,
      });
    }
  };

  const body = (
    <form
      id="create-subsidy"
      onSubmit={handleSubmit(onSubmit)}
      className="d-flex flex-column gap-3"
    >
      <div className="input-group">
        <i className="input-group-text bi bi-key-fill" />
        <input
          {...register("code")}
          className="form-control"
          type="text"
          id="code"
          placeholder="Código de subsidio"
          onChange={(event) => {
            event.target.value = event.target.value.toUpperCase();
          }}
        />
        <Error message={errors.code?.message} />
      </div>

      <div className="input-group">
        <i className="input-group-text bi bi-building-fill" />
        <input
          className="form-control"
          type="text"
          id="name"
          placeholder="Nombre de subsidio"
          {...register("name")}
        />
        <Error message={errors.name?.message} />
      </div>

      <div className="input-group">
        <i className="input-group-text bi bi-bank2" />
        <textarea
          className="form-control"
          id="message"
          placeholder="Hola {0} pasa por la sucursal más cercana con el pin {1} para redimir tu bono con el monto de {2}."
          {...register("message")}
        />
        <HelpText message="{0}: Nombre del Beneficiario" />
        <HelpText message="{1}: Pin." />
        <HelpText message="{2}: Monto de la transacción." />
        <Error message={errors.message?.message} />
      </div>

      <div className="input-group">
        <i className="input-group-text bi bi-alarm-fill" />
        <input
          className="form-control"
          {...register("validTime", { valueAsNumber: true })}
          type="number"
          id="validTime"
          placeholder="Vigencia (en horas)"
        />
        <Error message={errors.validTime?.message} />
      </div>

      <div className="input-group">
        <i className="input-group-text bi bi-check-circle-fill" />
        <select className="form-select" id="active" {...register("active")}>
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </select>
      </div>

      <Error message={errors.root?.message} />
    </form>
  );

  const footer = (
    <>
      <Button
        className="bg-secondary text-white"
        variant="secondary"
        onClick={handleCloseModal}
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        form="create-subsidy"
        className="bg-primary"
        variant="primary"
        disabled={loading}
      >
        {loading ? (
          <Spinner size="sm" animation="border" variant="light" />
        ) : (
          "Crear"
        )}
      </Button>
    </>
  );

  return (
    <Modal
      state={state}
      actions={modal}
      title={header}
      body={body}
      footer={footer}
    />
  );
}

function UpdateModal(props: {
  actions: Actions;
  state: State;
  subsidy: Subsidy;
  setSubsidy: React.Dispatch<React.SetStateAction<Subsidy>>;
}) {
  const { actions: modal, state, subsidy, setSubsidy } = props;
  const { id: subsidyId, active, ...subsidyValues } = subsidy;
  const { updateSubsidy } = useSubsidies();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting: loading },
  } = useForm<CreateFormSchemaType>({
    resolver: zodResolver(updateSubsidySchema),
    defaultValues: subsidyValues,
  });

  function handleCloseModal() {
    reset();
    modal.close();
  }

  const { mutateAsync } = useMutation({
    mutationFn: (updatedSubsidy: UpdateSubsidyPayload) => {
      return updateSubsidy(subsidyId, updatedSubsidy);
    },
    onSuccess: (data, { nombre, mensaje, vigencia }) => {
      setSubsidy((oldData) => {
        return {
          ...oldData,
          name: nombre,
          message: mensaje,
          validTime: vigencia,
        };
      });
    },
  });

  const onSubmit: SubmitHandler<UpdateFormSchemaType> = async ({
    name,
    code,
    message,
    validTime,
  }) => {
    try {
      const payload: UpdateSubsidyPayload = {
        nombre: name,
        codigo: code,
        mensaje: message,
        vigencia: validTime,
      };

      await mutateAsync(payload);

      handleCloseModal();
    } catch (error: any) {
      setError("root", {
        message: error.message,
      });
    }
  };

  const body = (
    <form
      id="update-subsidy"
      onSubmit={handleSubmit(onSubmit)}
      className="d-flex flex-column"
    >
      <label htmlFor="code">Código de subsidio</label>
      <div className="input-group mb-3">
        <i className="input-group-text bi bi-key-fill" />
        <input
          {...register("code")}
          id="code"
          className="form-control"
          type="text"
          placeholder="Código de subsidio"
          onChange={(event) => {
            event.target.value = event.target.value.toUpperCase();
          }}
          disabled
        />
        <Error message={errors.code?.message} />
      </div>

      <label htmlFor="name">Nombre</label>
      <div className="input-group mb-3">
        <i className="input-group-text bi bi-building-fill" />
        <input
          {...register("name")}
          id="name"
          className="form-control"
          type="text"
          placeholder="Nombre de subsidio"
        />
        <Error message={errors.name?.message} />
      </div>

      <label htmlFor="message">Mensaje</label>
      <div className="input-group mb-3">
        <i className="input-group-text bi bi-bank2" />
        <textarea
          {...register("message")}
          id="message"
          className="form-control"
          placeholder="Hola {0} te has ganado un bono {1}, puedes pasar a la oficina con el pin {2} a recoger tu bono."
        />
        <HelpText message="{0}: Nombre del Beneficiario" />
        <HelpText message="{1}: Pin." />
        <HelpText message="{2}: Monto de la transacción." />
        <Error message={errors.message?.message} />
      </div>

      <label htmlFor="validTime">Tiempo de vigencia</label>
      <div className="input-group mb-3">
        <i className="input-group-text bi bi-alarm-fill" />
        <input
          {...register("validTime", { valueAsNumber: true })}
          id="validTime"
          className="form-control"
          type="number"
          placeholder="Vigencia (en minutos)"
        />
        <Error message={errors.validTime?.message} />
      </div>

      <Error message={errors.root?.message} />
    </form>
  );

  const footer = (
    <>
      <Button
        className="bg-secondary text-white"
        variant="secondary"
        onClick={handleCloseModal}
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        form="update-subsidy"
        className="bg-primary"
        variant="primary"
        disabled={loading}
      >
        {loading ? (
          <Spinner size="sm" animation="border" variant="light" />
        ) : (
          "Actualizar"
        )}
      </Button>
    </>
  );

  const title = `Modificar subsidio de ${subsidy.name}`;

  return (
    <Modal
      state={state}
      actions={modal}
      title={title}
      body={body}
      footer={footer}
    />
  );
}
