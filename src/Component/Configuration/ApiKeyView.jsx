import { useState, useEffect, useCallback } from "react";
import {
  getApiKeys,
  createApiKeyClient,
  toggleApiKeyStatus,
  deleteApiKeyClient,
  deleteApiKey
} from "../../Redux/endPoints";
import showConfirmationDialog from "../../Utils/sweetalert";
import { showSuccess } from "../../Utils/toastify";
import Loading from "../Loading";

const ApiKeyView = () => {
  const [clients, setClients] = useState([]);
  const [load, setLoad] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [pageInfo, setPageInfo] = useState({ currentPage: 1, totalPages: 1 });
  const [newClient, setNewClient] = useState({ name: "", url: "" });
  const [createdApiKey, setCreatedApiKey] = useState(null);

  const fetchClients = useCallback(async () => {
    setLoad(true);
    try {
      const res = await getApiKeys(page, 5);
      let list = [];
      if (Array.isArray(res)) {
        list = res;
      } else if (res && Array.isArray(res.data)) {
        list = res.data;
        if (res.info) setPageInfo(res.info);
      } else if (res && Array.isArray(res.results)) {
        list = res.results;
      }
      setClients(list);
    } catch {
      setClients([]);
    } finally {
      setLoad(false);
    }
  }, [page]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newClient.name || !newClient.url) return;

    setLoad(true);
    const result = await createApiKeyClient(
      newClient,
      async () => {
        setNewClient({ name: "", url: "" });
        await fetchClients();
      },
      () => setLoad(false)
    );

    if (result && result.results) {
      setCreatedApiKey(result.results);
    } else if (result && result.apiKey) {
      setCreatedApiKey(result);
    }
    setLoad(false);
  };

  const handleToggleKeyStatus = async (keyId, currentStatus) => {
    const actionText = currentStatus ? "desactivar" : "activar";
    const confirmed = await showConfirmationDialog(
      `¿Desea ${actionText} esta API Key?`
    );
    if (confirmed) {
      setLoad(true);
      await toggleApiKeyStatus(
        keyId,
        { enabled: !currentStatus },
        () => fetchClients(),
        () => setLoad(false)
      );
    }
  };

  const handleDeleteSingleKey = async (keyId) => {
    const confirmed = await showConfirmationDialog(
      "¿Desea eliminar esta API Key específica?"
    );
    if (confirmed) {
      setLoad(true);
      await deleteApiKey(
        keyId,
        () => fetchClients(),
        () => setLoad(false)
      );
    }
  };

  const handleDeleteClient = async (clientId, clientName) => {
    const confirmed = await showConfirmationDialog(
      `¿Desea eliminar el cliente "${clientName}"?\nSe revocarán todas sus API Keys asociadas.`
    );
    if (confirmed) {
      setLoad(true);
      await deleteApiKeyClient(
        clientId,
        () => fetchClients(),
        () => setLoad(false)
      );
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showSuccess("Copiado al portapapeles");
  };

  const clientList = Array.isArray(clients) ? clients : [];
  const totalPages = pageInfo.totalPages || 1;

  return (
    <section className="container py-2 mb-3">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-2">
        <div>
          <h3 className="fw-normal mb-1">Clientes & API Keys</h3>
          <p className="text-muted small mb-0">
            Administración de clientes y sus múltiples llaves de API.
          </p>
        </div>
        <div>
          <button
            className="btn btn-sm btn-outline-primary me-2"
            onClick={fetchClients}
            disabled={load}
          >
            🔄 Actualizar
          </button>
          <button
            className="btn btn-sm btn-success"
            onClick={() => {
              setCreatedApiKey(null);
              setShowModal(true);
            }}
          >
            ➕ Registrar Nuevo Cliente / API Key
          </button>
        </div>
      </div>

      {load && !showModal ? (
        <Loading />
      ) : (
        <>
          <div className="row g-3">
            {clientList.length === 0 ? (
              <div className="col-12 text-center py-4">
                <p className="text-muted">No hay clientes con API Keys registrados.</p>
              </div>
            ) : (
              clientList.map((client) => (
                <div key={client.clientId || client.id || Math.random()} className="col-12">
                  <div
                    className="p-3 mb-2 shadow-sm backgroundElements rounded-3 border-0"
                    style={{ borderRadius: "0.75rem" }}
                  >
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-2">
                      <div>
                        <h5 className="mb-1 text-primary fw-bold">
                          {client.clientName || client.name}
                        </h5>
                        <p className="mb-0 text-muted small">
                          🌐 <strong>URL:</strong> {client.clientUrl || client.url || "N/A"}
                        </p>
                      </div>
                      <div className="mt-2 mt-md-0 d-flex align-items-center gap-2">
                        <span
                          className={`badge ${
                            client.clientEnabled !== false
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {client.clientEnabled !== false ? "Cliente Activo" : "Cliente Inactivo"}
                        </span>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() =>
                            handleDeleteClient(
                              client.clientId || client.id,
                              client.clientName || client.name
                            )
                          }
                          title="Eliminar cliente completo y todas sus llaves"
                        >
                          🗑️ Eliminar Cliente
                        </button>
                      </div>
                    </div>

                    {/* Lista de MÚLTIPLES API Keys del cliente */}
                    <div className="mt-3 bg-body-tertiary p-3 rounded-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="small fw-bold text-secondary mb-0">
                          🔑 Llaves de API asignadas ({client.keys ? client.keys.length : 0}):
                        </h6>
                      </div>

                      {client.keys && Array.isArray(client.keys) && client.keys.length > 0 ? (
                        <div className="d-flex flex-column gap-2">
                          {client.keys.map((key, idx) => (
                            <div
                              key={key.apiKeyId || key.id || idx}
                              className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center p-2 bg-body rounded border border-secondary-subtle"
                            >
                              <div className="font-monospace small mb-1 mb-md-0">
                                <span className="text-muted me-2">#{idx + 1}</span>
                                Key ID: <strong>{key.keyId}</strong>
                              </div>
                              <div className="d-flex align-items-center gap-2">
                                <span
                                  className={`badge ${
                                    key.apiKeyEnabled !== false
                                      ? "bg-success"
                                      : "bg-secondary"
                                  }`}
                                >
                                  {key.apiKeyEnabled !== false ? "Activa" : "Inactiva"}
                                </span>
                                <button
                                  className={`btn btn-sm ${
                                    key.apiKeyEnabled !== false
                                      ? "btn-outline-warning"
                                      : "btn-outline-success"
                                  }`}
                                  onClick={() =>
                                    handleToggleKeyStatus(
                                      key.apiKeyId || key.id,
                                      key.apiKeyEnabled !== false
                                    )
                                  }
                                >
                                  {key.apiKeyEnabled !== false ? "Deshabilitar" : "Habilitar"}
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDeleteSingleKey(key.apiKeyId || key.id)}
                                  title="Eliminar esta llave de API"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="small text-muted mb-0">Sin llaves de API generadas.</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Paginación de Clientes */}
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

      {/* Modal para Registrar Nuevo Cliente API Key */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content backgroundFormColor">
              <div className="modal-header">
                <h5 className="modal-title">Registrar Cliente & Generar API Key</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {createdApiKey ? (
                  <div className="alert alert-success">
                    <h6 className="fw-bold">¡Cliente y API Key creados con éxito!</h6>
                    <p className="small">
                      A continuación se muestra la API Key generada. Copiala ahora, ya que por seguridad no se volverá a mostrar completa.
                    </p>
                    <div className="p-2 bg-dark text-white rounded font-monospace small mb-2 text-break">
                      {createdApiKey.apiKey}
                    </div>
                    <button
                      className="btn btn-sm btn-outline-light"
                      onClick={() => copyToClipboard(createdApiKey.apiKey)}
                    >
                      📋 Copiar API Key
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleCreateSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Nombre del Cliente / App:</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={newClient.name}
                        onChange={handleInputChange}
                        placeholder="Ej: Cliente Móvil Principal"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">URL del Sitio / Servicio:</label>
                      <input
                        type="url"
                        className="form-control"
                        name="url"
                        value={newClient.url}
                        onChange={handleInputChange}
                        placeholder="https://ejemplo.com"
                        required
                      />
                    </div>
                    <div className="d-flex justify-content-end gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={() => setShowModal(false)}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="btn btn-sm btn-primary"
                        disabled={load}
                      >
                        {load ? "Creando..." : "Crear Cliente"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
              {createdApiKey && (
                <div className="modal-footer">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                      setCreatedApiKey(null);
                      setShowModal(false);
                    }}
                  >
                    Entendido / Cerrar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ApiKeyView;
