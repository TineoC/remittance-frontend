import React, { PropsWithChildren } from "react";
import { Table } from "react-bootstrap";

export function TableContainer(props: PropsWithChildren) {
  const { children } = props;

  return (
    <div className="h-100 overflow-scroll">
      <Table>{children}</Table>
    </div>
  );
}

export function TableHead(props: { columns: string[] }) {
  const { columns } = props;

  return (
    <thead>
      <tr>
        {columns.map((column, index) => {
          return <th key={index}>{column}</th>;
        })}
      </tr>
    </thead>
  );
}

export function TableData(props: PropsWithChildren) {
  const { children } = props;

  return <td className="align-middle">{children}</td>;
}
