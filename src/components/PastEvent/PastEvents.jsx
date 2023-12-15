import React from "react";
import "./PastEvent.css";
import { dateFormatDbToView } from "../../Utils/stringFunctions";
import { Tooltip } from "react-tooltip";
import { Link } from "react-router-dom";

const PastEvents = ({ title, description, eventDate, idEvento, buttonLink }) => {
    function vizualizar() {
        alert("Vizualizar eventos passados")
    }
  return (
    <article className="event-card">
      <h2 className="event-card__title">{title}</h2>

      <p
        className="event-card__description"
        data-tooltip-id={idEvento}
        data-tooltip-content={description}
        data-tooltip-place="top"
      >
        <Tooltip id={idEvento} className="tooltip" />
        {description.substr(0, 12)}
      </p>

      <p className="event-card__description">{dateFormatDbToView(eventDate)}</p>

      <Link to={buttonLink} className="event-card__connect-link">Vizualizar</Link>
    </article>
  );
};

export default PastEvents;
