import React from 'react';
import classes from './SubsidyTable.module.css';
import { SubsidyDetail } from '../../pages/SubsidyInfoPage/type';
import { formatDate } from '../../utils';

interface SubsidyTableProps {
  subsidies: SubsidyDetail[];
}

const SubsidyTable: React.FC<SubsidyTableProps> = ({ subsidies }) => {
  return (
    <div className={classes.tableWrapper}>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID remesa</th>
            <th>Pin</th>
            <th>Estado de la remesa</th>
            <th>Beneficiario</th>
            <th>Cedula</th>
            <th>Subsidio</th>
            <th>Moneda</th>
            <th>Monto</th>
            <th>Oficina</th>
            <th>Fecha de pago</th>
          </tr>
        </thead>
        <tbody>
          {subsidies.map((subsidy) => {
            const paymentDateToString = subsidy.paymentDate
              ? formatDate(new Date(subsidy.paymentDate)) : "";

            return (
              <tr key={subsidy.id}>
                <td>{subsidy.id}</td>
                <td>{subsidy.code}</td>
                <td>{subsidy.status}</td>
                <td>{subsidy.beneficiary}</td>
                <td>{subsidy.identificationId}</td>
                <td>{subsidy.subsidy}</td>
                <td>{subsidy.currency}</td>
                <td>{subsidy.amount}</td>
                <td>{subsidy.officeId ?? ""}</td>
                <td>{paymentDateToString}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SubsidyTable;
