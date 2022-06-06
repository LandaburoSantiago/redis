import axios from "axios";
import { useState } from "react";
import "./Eliminar.css";
export const Eliminar = () => {
  const [personajes, setPersonajes] = useState();
  const [episodio, setEpisodio] = useState();
  const [cargaExitosa, setCargaExitosa] = useState();
  const fetchPersonajes = () => {
    if (episodio) {
      axios
        .post("http://localhost:3002/delete", null, {
          params: {
            episodio,
            personaje: personajes,
          },
        })
        .then((response) => {
          const { data } = response;
          setCargaExitosa(true);
        })
        .catch((error) => {
          setCargaExitosa(false);
        });
    }
  };

  return (
    <div className="container-delete">
      <h3>Eliminar un personaje</h3>
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
        <input
          onChange={(event) => {
            setPersonajes(event.target.value);
          }}
          placeholder="Ingrese personaje"
          id="personaje"
          name="personaje"
          className="input is-info my-3"
        />
        <button className="button is-primary is-outlined my-3" type="submit">Eliminar personaje</button>
      </form>
      {cargaExitosa !== undefined ? (
        <>
          {cargaExitosa ? (
            <>
              <p>El personaje se eliminó exitosamente</p>
            </>
          ) : (
            <>
              <p>Hubo un error al eliminar el personaje</p>
            </>
          )}
        </>
      ) : null}
    </div>
  );
};
