import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getItem } from "../../Redux/actions";
import { updateItem } from "../../Redux/endPoints";
import { Form } from "react-bootstrap";
import showConfirmationDialog from "../../Utils/sweetalert";
import ImageUploader from "../../Utils/ImageUploader";




const UpdateItem = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
 
  const item1 = useSelector((state) => state.Item);
  useEffect(() => {
    dispatch(getItem(id));
  }, [id]);

  const onClose = () => {
    navigate(-1);
  };

  const [item, setItem] = useState({
    text: "",
    img: "",
    enable:false,
   
  });

  useEffect(() => {
    if (item1) {
      setItem({
        text: item1.text || "",
        img: item1.img || "",
        enable:item1.enable || false,
        
      });
    }
  }, [item1]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleImageChange = (imageUrl) => {
    setItem((prevItem) => ({
      ...prevItem,
      img: imageUrl,
    }));
  };
 
  

  const handleSubmit = async () => {
    // Lógica para actualizar el producto
    const confirmed = await showConfirmationDialog(
      "¿Está seguro de actualizar este item?"
    );
    if (confirmed) {
      // Si el usuario hace clic en "Aceptar", ejecutar la funcion:
      await updateItem(id, item, onClose);
      
    }
  };
  return (
    <div className="backgroundPages">
      <div className="coverBack">
        <div className="container-md modal-content backgroundFormColor formProductContainer rounded-4 shadow">
          <div className="container mt-5">
            <h1>Actualizacion de item</h1>
            <section
              className="needs-validation"
              id="updateItemForm"
              noValidate
            >
              <div className="row">
             
                <div className="col-md-6 mb-3">
                  <ImageUploader
                    titleField={"Imagen:"}
                    imageValue={item.img}
                    onImageUpload={handleImageChange}
                  />
                </div>
              
                <div className="col-md-6 mb-3"></div>
                <div className="mb-3">
                  <label htmlFor="text" className="form-label">
                    Texto:
                  </label>
                  <textarea
                    className="form-control"
                    type="text"
                    id="text"
                    name="text"
                    value={item.text}
                    onChange={handleInputChange}
                  />
                </div>
                <label htmlFor="enable" className="form-label">
                    Mostrar al publico
                  </label>
                  <select
                    className="form-select mb-2"
                    id="enable"
                    name="enable"
                    value={item.enable}
                    onChange={handleInputChange}
                  >
                    <option value="true">Mostrar</option>
                    <option value="false">No mostrar</option>
                  </select>
              

                <div className="d-flex flex-row me-3">
                  <button
                    className="btn btn-sm btn-primary mb-3 me-2"
                    type="button"
                    id="submitButton"
                    onClick={handleSubmit}
                  >
                    Actualizar
                  </button>
                  <button
                    className="btn btn-sm btn-secondary mb-3"
                    onClick={() => {
                      onClose();
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateItem