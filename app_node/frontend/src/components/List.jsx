import axios from "axios";
import { useState } from "react";
import "./List.css";
export const List = () => {
  const [personajes, setPersonajes] = useState();
  const [episodio, setEpisodio] = useState();
  const fetchPersonajes = () => {
    if (episodio) {
      axios
        .get("http://localhost:3002/list", {
          params: { episodio },
        })
        .then((response) => {
          const { data } = response;
          setPersonajes(data);
        })
        .catch((error) => {});
    }
  };

  return (
    <div className="container-list">
      <h3>Personajes de un determinado episodio</h3>
      <form
        onSubmit={(e, values) => {
          e.preventDefault();
          fetchPersonajes();
        }}
      >
        <input
          onChange={(event) => {
            setEpisodio(event.target.value);
          }}
          placeholder="Ingrese episodio"
          id="episodio"
          name="episodio"
          className="input is-info my-3"
        />
        <button className="button is-primary is-outlined my-3" type="submit">Buscar personajes!</button>
      </form>
      {personajes ? (
        <>
          {personajes.length ? (
            <>
              {personajes.map((personaje) => (
                <>
                  <p style={{ fontWeight: "bold" }}>{personaje}</p>
                  <br />
                </>
              ))}
            </>
          ) : (
            <>
              <p>No hay personajes para ese episodio</p>
            </>
          )}
        </>
      ) : null}
    </div>
  );
};
