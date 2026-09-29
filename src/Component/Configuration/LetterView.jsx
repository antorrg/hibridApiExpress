import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLettersAdmin } from "../../Redux/actions";
import { letterModerateAdmin, letterDeleteAdmin } from "../../Redux/endPoints";
import showConfirmationDialog from "../../Utils/sweetalert";
import Loading from "../Loading";

const TEMAS_DISPONIBLES = [
  "Para quien lo necesite",
  "Ansiedad",
  "Duelo",
  "Soledad",
  "Empezar de nuevo",
  "Gratitud"
];

const LetterView = () => {
  const dispatch = useDispatch();
  const rawLetters = useSelector((state) => state.Letters);

  const [load, setLoad] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [page, setPage] = useState(1);
  const [aprobadaFilter, setAprobadaFilter] = useState(false); // false = Pendientes por defecto
  const [selectedTema, setSelectedTema] = useState(""); // "" = Todos los temas

  // Extraer información de paginación y lista de cartas de forma defensiva
  const letters = Array.isArray(rawLetters)
    ? rawLetters
    : (rawLetters && Array.isArray(rawLetters.data)
        ? rawLetters.data
        : (rawLetters && Array.isArray(rawLetters.results)
            ? rawLetters.results
            : []));

  const pageInfo = rawLetters?.info || { currentPage: page, totalPages: 1 };
  const totalPages = pageInfo.totalPages || 1;

  const fetchLetters = useCallback(() => {
    dispatch(
      getLettersAdmin({
        page,
        aprobada: aprobadaFilter,
        limit: 9,
        tema: selectedTema || undefined
      })
    );
  }, [dispatch, page, aprobadaFilter, selectedTema]);

  useEffect(() => {
    fetchLetters();
  }, [fetchLetters]);

  const handleFilterChange = (statusBool) => {
    setAprobadaFilter(statusBool);
    setPage(1);
  };

  const handleTemaChange = (e) => {
    setSelectedTema(e.target.value);
    setPage(1);
  };

  const handleToggleApproval = async (letter) => {
    const newStatus = !letter.aprobada;
    const actionText = newStatus ? "aprobar" : "desaprobar";
    const confirmed = await showConfirmationDialog(
      `¿Desea ${actionText} esta carta?`
    );
    if (confirmed) {
      setLoad(true);
      await letterModerateAdmin(
        letter.id,
        { aprobada: newStatus },
        () => {
          setLoad(false);
          fetchLetters();
        },
        () => setLoad(false)
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await showConfirmationDialog(
      "¿Quiere eliminar la carta? \n¡Esta acción no se puede deshacer!"
    );
    if (confirmed) {
      setLoad(true);
      await letterDeleteAdmin(
        id,
        () => {
          setLoad(false);
          fetchLetters();
        },
        () => setLoad(false)
      );
    }
  };

  return (
    <section className="container py-2 mb-3">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-2">
        <div>
          <h3 className="fw-normal mb-1">Gestión de Cartas</h3>
          <p className="text-muted small mb-0">
            Administración y moderación de cartas enviadas por los usuarios.
          </p>
        </div>

        {/* Botón de recarga */}
        <button
          className="btn btn-sm btn-outline-primary align-self-end align-self-md-center"
          onClick={fetchLetters}
          disabled={load}
        >
          🔄 Actualizar
        </button>
      </div>

      {/* Barra de Filtros: Estado y Tema */}
      <div className="card border-0 shadow-sm backgroundElements mb-4 p-3 rounded-3">
        <div className="row g-3 align-items-center">
          {/* Filtro por Estado (Pendientes / Aprobadas) */}
          <div className="col-12 col-md-6 d-flex align-items-center gap-2">
            <span className="small fw-bold text-secondary text-nowrap">Estado:</span>
            <div className="btn-group btn-group-sm role-group bg-body-tertiary rounded-pill p-1 shadow-sm w-100">
              <button
                type="button"
                className={`btn rounded-pill px-3 w-50 ${
                  !aprobadaFilter ? "btn-warning text-dark fw-bold" : "btn-light text-secondary"
                }`}
                onClick={() => handleFilterChange(false)}
              >
                ⏳ Pendientes
              </button>
              <button
                type="button"
                className={`btn rounded-pill px-3 w-50 ${
                  aprobadaFilter ? "btn-success text-white fw-bold" : "btn-light text-secondary"
                }`}
                onClick={() => handleFilterChange(true)}
              >
                ✅ Aprobadas
              </button>
            </div>
          </div>

          {/* Filtro por Tema */}
          <div className="col-12 col-md-6 d-flex align-items-center gap-2">
            <label htmlFor="temaSelect" className="small fw-bold text-secondary text-nowrap">
              Filtrar por Tema:
            </label>
            <select
              id="temaSelect"
              className="form-select form-select-sm"
              value={selectedTema}
              onChange={handleTemaChange}
            >
              <option value="">🏷️ Todos los temas</option>
              {TEMAS_DISPONIBLES.map((tema) => (
                <option key={tema} value={tema}>
                  {tema}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {load ? (
        <Loading />
      ) : (
        <>
          <div className="row g-3">
            {letters.length === 0 ? (
              <div className="col-12 text-center py-5">
                <p className="text-muted fs-6">
                  {aprobadaFilter
                    ? "No hay cartas aprobadas registradas con los filtros seleccionados."
                    : "No hay cartas pendientes de revisión con los filtros seleccionados."}
                </p>
              </div>
            ) : (
              letters.map((letter) => (
                <div key={letter.id || Math.random()} className="col-12 col-md-6 col-lg-4">
                  <div
                    className="card h-100 shadow-sm backgroundElements border-0"
                    style={{ borderRadius: "0.75rem" }}
                  >
                    <div className="card-header bg-transparent d-flex justify-content-between align-items-center border-0 pt-3 px-3">
                      <span className="badge bg-secondary text-truncate" style={{ maxWidth: "70%" }}>
                        {letter.tema || "General"}
                      </span>
                      <span
                        className={`badge ${
                          letter.aprobada ? "bg-success" : "bg-warning text-dark"
                        }`}
                      >
                        {letter.aprobada ? "Aprobada" : "Pendiente"}
                      </span>
                    </div>

                    <div className="card-body px-3 py-2">
                      <p
                        className="card-text"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          fontSize: "0.95rem"
                        }}
                      >
                        {letter.mensaje}
                      </p>
                    </div>

                    <div className="card-footer bg-transparent border-0 d-flex justify-content-between align-items-center pb-3 px-3">
                      <button
                        className="btn btn-sm btn-outline-info"
                        onClick={() => setSelectedLetter(letter)}
                      >
                        👁️ Leer completa
                      </button>
                      <div className="btn-group">
                        <button
                          className={`btn btn-sm ${
                            letter.aprobada
                              ? "btn-outline-warning"
                              : "btn-outline-success"
                          }`}
                          onClick={() => handleToggleApproval(letter)}
                        >
                          {letter.aprobada ? "Desaprobar" : "Aprobar"}
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(letter.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Controles de Paginación */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
              <button
                className="btn btn-sm btn-outline-secondary"
                disabled={page <= 1 || load}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
              >
                ◀ Anterior
              </button>

              <span className="small text-muted fw-semibold">
                Página {pageInfo.currentPage || page} de {totalPages}
              </span>

              <button
                className="btn btn-sm btn-outline-secondary"
                disabled={page >= totalPages || load}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              >
                Siguiente ▶
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal para ver contenido completo de la Carta */}
      {selectedLetter && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content backgroundFormColor">
              <div className="modal-header">
                <h5 className="modal-title">
                  Carta: {selectedLetter.tema || "Sin Tema"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedLetter(null)}
                ></button>
              </div>
              <div className="modal-body" style={{ maxHeight: "60vh", overflowY: "auto" }}>
                <p style={{ whiteSpace: "pre-wrap" }}>{selectedLetter.mensaje}</p>
                <hr />
                <p className="small text-muted mb-0">
                  Estado actual:{" "}
                  <strong>
                    {selectedLetter.aprobada ? "Aprobada" : "Pendiente de aprobación"}
                  </strong>
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className={`btn btn-sm ${
                    selectedLetter.aprobada ? "btn-warning" : "btn-success"
                  }`}
                  onClick={() => {
                    handleToggleApproval(selectedLetter);
                    setSelectedLetter(null);
                  }}
                >
                  {selectedLetter.aprobada ? "Desaprobar Carta" : "Aprobar Carta"}
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={() => setSelectedLetter(null)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default LetterView;
