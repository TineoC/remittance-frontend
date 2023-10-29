import React, { useState } from "react";
import { Button, Form, Placeholder, Spinner } from "react-bootstrap";
import useSenders, {
  UpdateSenderPayload,
  type CreateSenderPayload,
} from "../../../hooks/use-senders";
import { Sender } from "../../FileUpload/types";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  TableContainer,
  TableData,
  TableHead,
} from "../../../components/Table";
import { useModal, Modal } from "../../../components/Modal";
import { State, Actions } from "../../../components/Modal/Modal";
import * as z from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Error from "../../../components/Error";

const columns = [
  "Código",
  "Nombre",
  "Cuenta de Débito",
  "Subsidios",
  "Editar",
  "Estado",
];

const createSenderSchema = z.object({
  code: z.string().min(1, "El código es un campo requerido").max(50),
  name: z.string().min(1, "El nombre es un campo requerido").max(150),
  debitAccount: z
    .string()
    .min(1, "La cuenta de débito es un campo requerido")
    .max(100),
  active: z.string(),
});

type CreateFormSchemaType = z.infer<typeof createSenderSchema>;
type UpdateFormSchemaType = z.infer<typeof createSenderSchema>;

export default function AdminSendersPage() {
  return (
    <>
      <Header />
      <TableContainer>
        <TableHead columns={columns} />

        <TableBody />
      </TableContainer>
    </>
  );
}

function Header() {
  const { state, actions } = useModal();

  return (
    <>
      <header className="w-100 d-flex align-items-center justify-content-between mb-3">
        <span className="fs-3 fw-bold">Organizaciones</span>

        <Button
          onClick={actions.open}
          size="sm"
          className="d-flex gap-2 fs-6 align-items-center"
          variant="primary"
        >
          <span>Crear Organización</span>
          <i className="bi bi-building-fill-add text-white" />
        </Button>
      </header>

      <CreateModal state={state} actions={actions} />
    </>
  );
}

function TableBody() {
  const { getSenders } = useSenders();

  const { data: senders, isLoading } = useQuery({
    queryKey: ["senders"],
    queryFn: getSenders,
  });

  if (isLoading)
    return (
      <tbody>
        {Array.from(Array(3).keys()).map((n) => {
          return (
            <tr key={n}>
              {columns.map((column) => {
                return (
                  <td key={column}>
                    <Placeholder animation="wave">
                      <Placeholder className="w-100 rounded" />
                    </Placeholder>
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    );

  if (!senders) return null;

  return (
    <tbody>
      {senders.map((sender) => {
        return <SenderRow key={sender.code} {...sender} />;
      })}
    </tbody>
  );
}

function SenderRow(props: Sender) {
  const [sender, setSender] = useState<Sender>(props);
  const { id, code, name, subsidies, active, debitAccount } = sender;
  const { state: statusModalState, actions: statusModalActions } = useModal();
  const { state: updateModalState, actions: updateModalActions } = useModal();
  const subsidiesCount = subsidies?.length ?? 0;

  return (
    <>
      <tr>
        <TableData>{code}</TableData>
        <TableData>{name}</TableData>
        <TableData>{debitAccount}</TableData>
        <TableData>
          <Link to={`/subsidies/${id}`}>
            <Button
              size="sm"
              className="d-flex align-items-center gap-2"
              variant="primary"
            >
              <h3>{subsidiesCount}</h3>
              <i className="bi bi-cash-coin text-white" />
            </Button>
          </Link>
        </TableData>
        <TableData>
          <Button onClick={updateModalActions.open} disabled={!active}>
            <i className="bi bi-pencil-fill" />
          </Button>
        </TableData>
        <TableData>
          <Form>
            <Form.Check
              checked={active}
              onChange={statusModalActions.open}
              type="switch"
            />
          </Form>
        </TableData>
      </tr>

      <StatusModal
        sender={sender}
        setSender={setSender}
        state={statusModalState}
        actions={statusModalActions}
      />

      <UpdateModal
        sender={sender}
        setSender={setSender}
        state={updateModalState}
        actions={updateModalActions}
      />
    </>
  );
}

function UpdateModal(props: {
  actions: Actions;
  state: State;
  sender: Sender;
  setSender: React.Dispatch<React.SetStateAction<Sender>>;
}) {
  const { actions: modal, state, sender, setSender } = props;
  const { updateSender } = useSenders();
  const { id: senderId, code, name, debitAccount } = sender;

  const initialValues = {
    code,
    name,
    debitAccount,
  };

  const updateSenderSchema = z.object({
    code: z.string().min(1, "El código es un campo requerido").max(50),
    name: z.string().min(1, "El nombre es un campo requerido").max(150),
    debitAccount: z
      .string()
      .min(1, "La cuenta de débito es un campo requerido")
      .max(100),
  });

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting: loading },
  } = useForm<UpdateFormSchemaType>({
    resolver: zodResolver(updateSenderSchema),
    defaultValues: initialValues,
  });

  function handleCloseModal() {
    reset();
    modal.close();
  }

  const { mutateAsync } = useMutation({
    mutationFn: (updatedSender: UpdateSenderPayload) => {
      return updateSender(senderId, updatedSender);
    },
    onSuccess: (data, { nombre, cuentaDebito }: UpdateSenderPayload) => {
      setSender((oldData) => {
        return {
          ...oldData,
          name: nombre,
          debitAccount: cuentaDebito,
        };
      });
    },
  });

  const onSubmit: SubmitHandler<UpdateFormSchemaType> = async ({
    code,
    name,
    debitAccount,
  }) => {
    try {
      const payload = {
        codigo: code,
        cuentaDebito: debitAccount,
        nombre: name,
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
      id="create-sender"
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
          placeholder="Código"
          onChange={(event) => {
            event.target.value = event.target.value.toLowerCase();
          }}
          //   required
          disabled
        />
        <Error message={errors.code?.message} />
      </div>

      <div className="input-group">
        <i className="input-group-text bi bi-building-fill" />
        <input
          {...register("name")}
          className="form-control"
          type="text"
          id="name"
          placeholder="Nombre de Organización"
          required
        />
        <Error message={errors.name?.message} />
      </div>

      <div className="input-group">
        <i className="input-group-text bi bi-bank2" />
        <input
          {...register("debitAccount")}
          className="form-control"
          type="text"
          id="debitAccount"
          placeholder="Cuenta de Débito"
          required
        />
        <Error message={errors.debitAccount?.message} />
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
        form="create-sender"
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

  return (
    <Modal
      state={state}
      actions={modal}
      title="Actualizar Organización"
      body={body}
      footer={footer}
    />
  );
}

function CreateModal(props: { actions: Actions; state: State }) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting: loading },
  } = useForm<CreateFormSchemaType>({
    resolver: zodResolver(createSenderSchema),
  });
  const queryClient = useQueryClient();
  const { actions: modal, state } = props;
  const { createSender } = useSenders();

  function handleCloseModal() {
    reset();
    modal.close();
  }

  const { mutateAsync } = useMutation({
    mutationFn: (newSender: CreateSenderPayload) => {
      return createSender(newSender);
    },
    onSuccess: (
      data,
      { activo, nombre, codigo, cuentaDebito }: CreateSenderPayload
    ) => {
      queryClient.setQueryData<Sender[]>(["senders"], (actualSenders) => [
        ...(actualSenders ?? []),
        {
          id: !actualSenders ? 1 : actualSenders.length + 1,
          code: codigo,
          name: nombre,
          active: activo,
          subsidies: [],
          debitAccount: cuentaDebito,
        },
      ]);
    },
  });

  const [[key, senders]]: [QueryKey, Sender[] | undefined][] =
    queryClient.getQueriesData({ queryKey: ["senders"] });

  const codes = senders?.map((sender: Sender) => sender.code) ?? [];

  const onSubmit: SubmitHandler<CreateFormSchemaType> = async ({
    active,
    debitAccount,
    name,
    code,
  }) => {
    if (codes.includes(code)) {
      setError("code", {
        message: "El código ya existe",
      });
      return;
    }

    try {
      const payload = {
        activo: Boolean(active),
        cuentaDebito: debitAccount,
        nombre: name,
        codigo: code,
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
      id="create-sender"
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
          placeholder="Código"
          onChange={(event) => {
            event.target.value = event.target.value.toLowerCase();
          }}
          required
        />
        <Error message={errors.code?.message} />
      </div>

      <div className="input-group">
        <i className="input-group-text bi bi-building-fill" />
        <input
          className="form-control"
          type="text"
          id="name"
          placeholder="Nombre de Organización"
          required
          {...register("name")}
        />
        <Error message={errors.name?.message} />
      </div>

      <div className="input-group">
        <i className="input-group-text bi bi-bank2" />
        <input
          className="form-control"
          type="text"
          id="debitAccount"
          placeholder="Cuenta de Débito"
          required
          {...register("debitAccount")}
        />
        <Error message={errors.debitAccount?.message} />
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
        form="create-sender"
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
      title="Crear Organización"
      body={body}
      footer={footer}
    />
  );
}

function StatusModal(props: {
  state: State;
  setSender: React.Dispatch<React.SetStateAction<Sender>>;
  actions: Actions;
  sender: Sender;
}) {
  const { sender, setSender, state, actions: modal } = props;
  const { id: senderId, active: isActive, name: senderName } = sender;
  const actionString = !isActive ? "Habilitar" : "Deshabilitar";
  const title = `${actionString} ${senderName}`;
  const body = `¿Estás seguro de que quieres ${actionString.toLowerCase()} a la organización ${senderName}?`;

  const { updateSenderActiveValue } = useSenders();

  const { refetch: updateStatus, isRefetching: isLoading } = useQuery({
    enabled: false,
    queryKey: ["senders-status", senderId],
    queryFn: () => updateSenderActiveValue(senderId),
  });

  const handleAction = () => {
    updateStatus();
    setSender((oldSender) => {
      return {
        ...oldSender,
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
