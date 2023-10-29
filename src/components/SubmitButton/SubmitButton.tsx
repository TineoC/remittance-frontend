import React from "react";
import LoadingSpinner from "../LoadingSpinner";
import clsx from "clsx";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  label: string;
  loading?: boolean;
  loadingLabel?: string;
  onClick?: (params?: unknown) => any;
  className?: string;
  icon?: React.ReactNode;
}

export default function SubmitButton(props: Props) {
  const {
    label,
    loading = false,
    loadingLabel = "Cargando...",
    onClick,
    className,
    icon,
    ...rest
  } = props;

  const text = loading ? loadingLabel : label;

  return (
    <button
      className={clsx(
        "d-flex flex-col justify-content-center gap-2 btn btn-primary fw-bold",
        className
      )}
      type="submit"
      disabled={loading}
      onClick={onClick}
      {...rest}
    >
      {text}
      {loading ? <LoadingSpinner show={loading} /> : icon}
    </button>
  );
}
