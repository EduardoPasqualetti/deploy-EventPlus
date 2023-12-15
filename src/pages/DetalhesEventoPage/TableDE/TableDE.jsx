import React from "react";
import "./TableDE.css"
const TableDE = ({ dados }) => {
  return (
    <table className="table-data">
      <thead className="table-data__head">
        <tr className="table-data__head-row" >
          <th className="table-data__head-title table-data__head-title--big">
            Comentario
          </th>
          <th className="table-data__head-title table-data__head-title--big">
            Usuario
          </th>
        </tr>
      </thead>
      <tbody>
        {dados.map((c) => {
          return (
            <tr className="table-data__head-row" key={c.idComentarioEvento}>
              <td className="table-data__data table-data__data--big">
                {c.descricao}
              </td>
              <td className="table-data__data table-data__data--big">
                
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TableDE;
