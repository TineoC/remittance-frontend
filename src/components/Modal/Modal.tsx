import React, { useState } from "react";
import { Modal as BootstrapModal } from "react-bootstrap";

export type State = {
  show: boolean;
};

type Action = () => void;

export type Actions = {
  close: Action;
  open: Action;
};

export function useModal() {
  const [show, setShow] = useState<boolean>(false);

  const open = () => setShow(true);
  const close = () => setShow(false);

  return {
    state: { show },
    actions: { open, close },
  };
}

interface Props {
  title: string;
  body: React.ReactNode;
  footer: React.ReactNode;
  state: State;
  actions: Actions;
}

export function Modal(props: Props) {
  const { state, actions, title, body, footer } = props;

  return (
    <BootstrapModal
      show={state.show}
      onHide={actions.close}
      backdrop="static"
      keyboard={false}
      centered
    >
      <BootstrapModal.Header>
        <BootstrapModal.Title>{title}</BootstrapModal.Title>
      </BootstrapModal.Header>

      <BootstrapModal.Body>{body}</BootstrapModal.Body>

      <BootstrapModal.Footer>{footer}</BootstrapModal.Footer>
    </BootstrapModal>
  );
}
