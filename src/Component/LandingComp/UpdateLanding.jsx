import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getInfoById} from "../../Redux/actions";
import { landingUpdate } from "../../Redux/endPoints";
import showConfirmationDialog from "../../Utils/sweetalert";
import ImageUploader from "../../Utils/ImageUploader";


const UpdateLanding = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const item1 = useSelector((state) => state.LandingById);

  useEffect(() => {
    dispatch(getInfoById(id));
  }, [id]);

  const onClose = () => {
    navigate(-1);
  };

  const [item, setItem] = useState({
    title: "",
    image: "",
    info_header: "",
    description: "",
  });

  useEffect(() => {
    if (item1) {
      setItem({
        title: item1.title || "",
        image: item1.image || "",
        info_header: item1.info_header || "",
        description: item1.description || "",
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
      image: imageUrl,
    }));
  };

  

  const handleSubmit = async () => {
    // Lógica para actualizar el producto
    const confirmed = await showConfirmationDialog(
      "¿Está seguro de actualizar este item?"
    );
    if (confirmed) {
      // Si el usuario hace clic en "Aceptar", ejecutar la funcion:
      await landingUpdate(id, item, onClose);
      console.log('actualizar : ', item)
      
    }
  };
  return (
       <div className="backgroundPages">
      <div className="coverBack">
        <div className="container-md modal-content colorBack backgroundFormColor  rounded-4 shadow">
          <div className="container mt-5">
            <h1>Edicion de portada:</h1>
            <section
              className="needs-validation"
              id="updateItemForm"
              noValidate
            >
              <div className="row">
                <div className="col-md-6 mb-3">
                  <ImageUploader
                    titleField={"Imagen:"}
                    imageValue={item.image}
                    onImageUpload={handleImageChange}
                  />
                </div>
              
                <div className="col-md-6 mb-3"></div>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Titulo:
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    id="title"
                    name="title"
                    value={item.title}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="info_header" className="form-label">
                    Info posicionamiento:
                  </label>
                  <InfoFormField info={aboutSeo} place={'bottom'}/>
                  <textarea
                    className="form-control"
                    type="text"
                    id="info_header"
                    name="info_header"
                    value={item.info_header}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Descripción:
                  </label>
                  <textarea
                    className="form-control"
                    type="text"
                    id="description"
                    name="description"
                    value={item.description}
                    onChange={handleInputChange}
                  />
                </div>
                

                <div className="d-flex flex-row me-3">
                  <button
                    className="btn btn-sm btn-primary mb-3 me-2"
                    type="button"
                    id="submitButton"
                    onClick={handleSubmit}
                  >
                    Editar
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
  )
}



export default UpdateLanding