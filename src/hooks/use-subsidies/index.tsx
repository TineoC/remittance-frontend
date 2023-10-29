import useSenders from "../use-senders";
import { Subsidy } from "../../pages/FileUpload/types";

export default function useSubsidies() {
  const entityName = "Subsidy";
  const API_URL = `${process.env.REACT_APP_ENDPOINT_URL}${entityName}`;

  const { getSenderById } = useSenders();

  function getSubsidiesBySenderId(senderId: number): Subsidy[] | null {
    const sender = getSenderById(senderId);

    if (!sender) return null;

    return sender.subsidies;
  }

  async function createSubsidy(payload: CreateSubsidyPayload) {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return res.json();
  }

  async function updateSubsidy(
    subsidyId: number,
    payload: UpdateSubsidyPayload
  ) {
    const url = `${API_URL}/${subsidyId}`;
    const res = await fetch(url, {
      body: JSON.stringify(payload),
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return res.json();
  }

  async function updateSubsidyActiveValue(subsidyId: number) {
    const url = `${API_URL}/${subsidyId}/status`;
    const res = await fetch(url, {
      method: "PUT",
    });

    return res.json();
  }

  return {
    createSubsidy,
    updateSubsidy,
    getSubsidiesBySenderId,
    updateSubsidyActiveValue,
  };
}

export const SUBSIDY_MESSAGE_VALIDATION_REGEXP =
  /^(?:[^{}]*{[0-2]}[^{}]*)*[^{}]*$/;
export const DEFAULT_SUBSIDY_VALID_TIME_IN_HOURS: number = 2160;

export type CreateSubsidyPayload = {
  codigo: string;
  nombre: string;
  remesador: number;
  mensaje: string;
  vigencia: number;
  activo: boolean;
};

export type UpdateSubsidyPayload = {
  codigo: string;
  nombre: string;
  mensaje: string;
  vigencia: number;
};
