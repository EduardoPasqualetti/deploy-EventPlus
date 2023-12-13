import React from "react";
import "./TableI.css";

import editPen from "../../../assets/images/edit-pen.svg";
import trashDelete from "../../../assets/images/trash-delete.svg";

const Table = ({ dados, fnDelete = null, fnUpdate = null }) => {
  return (
    <table className="table-data">
      <thead className="table-data__head">
        <tr className="table-data__head-row">
          <th className="table-data__head-title table-data__head-title--big">
            Nome
          </th>
          <th className="table-data__head-title table-data__head-title--big">
            CNPJ
          </th>
          <th className="table-data__head-title table-data__head-title--big">
            Endereco
          </th>
          <th className="table-data__head-title table-data__head-title--little">
            Editar
          </th>
          <th className="table-data__head-title table-data__head-title--little">
            Deletar
          </th>
        </tr>
      </thead>

      <tbody>
        {dados.map((tp) => {
          return (
            <tr className="table-data__head-row" key={tp.idInstituicao}>
              <td className="table-data__data table-data__data--big">
                {tp.nomeFantasia}
              </td>
              <td className="table-data__data table-data__data--big">
                {tp.cnpj}
              </td>
              <td className="table-data__data table-data__data--big">
                {tp.endereco}
              </td>

              <td className="table-data__data table-data__data--little">
                <img
                  className="table-data__icon"
                  src={editPen}
                  alt=""
                  onClick={() => fnUpdate(tp.idInstituicao)}
                />
              </td>

              <td className="table-data__data table-data__data--little">
                <img
                  className="table-data__icon"
                  src={trashDelete}
                  alt=""
                  onClick={() => fnDelete(tp.idInstituicao, tp.nome)}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;