import React, { useState } from "react";
import SubsidyTable from "../../components/SubsidyTable";
import classes from "./SubsidyInfoPage.module.css";
import { SubsidyDetail } from "./type";

const SubsidyInfoPage: React.FC = () => {
  const [identificationId, setIdentificationId] = useState<string>("");
  const [subsidies, setSubsidies] = useState<SubsidyDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    if (/^\d*$/.test(inputValue)) {
      setIdentificationId(inputValue);
    }
  };

  const handleFetchData = () => {
    setError(null);
    setLoading(true);
    const apiUrl = `${process.env.REACT_APP_ENDPOINT_URL}Remittance/${identificationId}`;

    fetch(apiUrl, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("La respuesta del servicio no fue exitosa");
        }
        return response.json();
      })
      .then((data: SubsidyDetail[]) => {
        setSubsidies(data);
        setLoading(false);

        if (data.length === 0) {
          setError("No se encontraron remesas para esta cédula.");
        }
      })
      .catch((error: Error) => {
        setError("Error al consultar los datos: " + error.message);
        setLoading(false);
      });
  };

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>
        <strong>Reporte consulta remesa</strong>
      </h1>
      <div className={classes.searchContainer}>
        <input
          type="text"
          value={identificationId}
          onChange={handleInputChange}
          placeholder="Ingresa una cédula"
          className={`form-control ${classes.searchInput}`}
          inputMode="numeric"
          pattern="[0-9]*"
        />
        <button
          className={`${classes.searchButton} btn btn-primary`}
          onClick={handleFetchData}
        >
          Consultar remesa
        </button>
      </div>
      {loading && <p>Cargando...</p>}
      {!loading && error && <p>{error}</p>}
      {!loading && !error && subsidies.length > 0 && (
        <SubsidyTable subsidies={subsidies} />
      )}
    </div>
  );
};

export default SubsidyInfoPage;
