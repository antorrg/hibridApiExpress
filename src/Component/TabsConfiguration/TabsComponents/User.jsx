import { useNavigate, useLocation } from "react-router-dom";
import Edition from "../../../Auth/generalComponents/Edition/Edition";
import * as us from "../../../Auth/authHelpers/Auth";
import showConfirmationDialog from "../../../Auth/generalComponents/sweetAlert";
//import "./user.css";

const User = ({ user, isSingleUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isProfileRoute = location.pathname.includes("profile");

  const goToDetail = () => navigate(`/admin/users/${user.id}`);
  const goToBack = () => navigate(-1);
  const goToEdition = () => navigate(`/admin/users/update/${user.id}`);
  const goToUpgrade = () => navigate(`/admin/users/upgrade/${user.id}`);
  const onClose = () => navigate("/admin");
  const deleteUser = () => {
    userDelete();
  };
  const goToPassUpd = () => {
    if (isProfileRoute) {
      navigate(`/admin/users/updateinfo/${user.id}`);
    } else {
      resetPassword();
    }
  };
  const resetPassword = async () => {
    const confirmed = await showConfirmationDialog(
      "¿Quiere reiniciar su contraseña?"
    );
    if (confirmed) {
      // Si el usuario hace clic en "Aceptar", ejecutar la funcion:
      us.onResetPass(user.id, onClose);
    }
  };

  const userDelete = async () => {
    const confirmed = await showConfirmationDialog(
      "¿Quiere eliminar su usuario? \n¡Esta accion no podra deshacerse!"
    );
    if (confirmed) {
      // Si el usuario hace clic en "Aceptar", ejecutar la funcion:
      //us.onDeleteUser(user.id, onClose);
    }
  };
  const userStatus = user.enable ? "Activo" : "Bloqueado";

  const renderUserInfo = (label, value) => (
    <div className="user-info">
      <dt className="user-info-label">{label}:</dt>
      <dd className="user-info-value">{value}</dd>
    </div>
  );

  return (
    <div className="col userStyle">
      <div className="card shadow-sm p-2">
        <img
          className="card-img-top"
          src={user.picture}
          alt={`${user.nickname}'s profile`}
        />
        <div className="card-body">
          <dl className="user-info-list">
            {renderUserInfo("Email", user.email)}
            {renderUserInfo("Apodo", user.nickname)}
            {renderUserInfo("Rol", user.role)}
            {isSingleUser && (
              <>
                {renderUserInfo("Nombre", user.given_name)}
                {renderUserInfo("País", user.country)}
                {renderUserInfo("Estado", userStatus)}
              </>
            )}
          </dl>

          <div className="d-flex justify-content-between align-items-center">
            {isSingleUser ? (
              <>
                <button
                  className="btn btn-sm btn-outline-success"
                  onClick={goToBack}
                >
                  Volver
                </button>

                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={goToEdition}
                >
                  Editar
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={goToDetail}
                >
                  Detalles
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={deleteUser}
                >Eliminar</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
