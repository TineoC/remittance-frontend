import { useQuery } from "@tanstack/react-query";
import { Sender } from "../../pages/FileUpload/types";

export default function useSenders() {
  const entityName = "Sender";
  const API_URL = `${process.env.REACT_APP_ENDPOINT_URL}${entityName}`;

  const { data: senders } = useQuery({
    queryKey: ["senders"],
    queryFn: getSenders,
  });

  async function createSender(payload: CreateSenderPayload) {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return res.json();
  }

  async function getSenders(): Promise<Sender[]> {
    const res = await fetch(API_URL);
    return res.json();
  }

  async function updateSenderActiveValue(senderId: number) {
    const url = `${API_URL}/${senderId}/status`;
    const res = await fetch(url, {
      method: "PUT",
    });

    return res.json();
  }

  async function updateSender(id: number, payload: UpdateSenderPayload) {
    const url = `${API_URL}/${id}`;
    const res = await fetch(url, {
      body: JSON.stringify(payload),
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return res.json();
  }

  function getSenderById(senderId: number): Sender | null {
    if (!senders) return null;

    const sender = senders.find(({ id }) => {
      return id === senderId;
    });

    if (!sender) return null;

    return sender;
  }

  function getActivePrograms(programs: Sender[]): Sender[] | undefined {
    if (!programs) return undefined;

    const activePrograms = programs.filter(({ active }: Sender) => active);

    const filterActiveSubsidies = activePrograms.map((sender) => {
      const activeSubsidies =
        sender.subsidies?.filter(({ active }) => active) ?? [];

      return {
        ...sender,
        subsidies: activeSubsidies,
      };
    });

    return filterActiveSubsidies;
  }

  return {
    createSender,
    getSenders,
    getSenderById,
    updateSenderActiveValue,
    getActivePrograms,
    updateSender,
  };
}

export type CreateSenderPayload = {
  codigo: string;
  nombre: string;
  cuentaDebito: string;
  activo: boolean;
};

export type UpdateSenderPayload = {
  codigo: string;
  nombre: string;
  cuentaDebito: string;
};
