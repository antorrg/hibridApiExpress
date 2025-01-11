import { useState } from "react";
import {useNavigate } from "react-router-dom";
import showConfirmationDialog from "../../Utils/sweetalert";
import ImageUploader from "../../Utils/ImageUploader";
import {landingCreate} from "../../Redux/endPoints";
import Loading from '../Loading'



const CreateLanding = () => {
 
  const navigate = useNavigate();
  const [load, setLoad] = useState(false)

  const itemOnClose = () => {
    setLoad(false)
    navigate(-1);
  };

  const rejectOnClose = ()=>{
    setTimeout(()=>{
      navigate(-1)
    },3000)
  }

  const [item, setItem] = useState({
    title: "",
    picture: "",
    info_header: "",
    description: "",
    
  });

  const handleItemImageChange = (url) => {
    setItem((prevItem) => ({ ...prevItem, picture: url }));
  };

  const handleItemChange = (event) => {
    const { name, value } = event.target;
    setItem((prevItem) => ({ ...prevItem, [name]: value }));
  };

  const handleSubmit = async (e) => {
    const confirmed = await showConfirmationDialog(
      "¿Está seguro de crear el item?"
    );
    if (confirmed) {
      setLoad(true)
      // Aquí iría la lógica para crear el producto
      await landingCreate(item, itemOnClose, rejectOnClose);
      //console.log('soy el nuevo item: ',item);
    }
  };

  return (
    <div className="backgroundPages">
      <div className="coverBack">
      {load?
      <Loading/>
          :
        <div className="container-md modal-content backgroundFormColor rounded-4 shadow">
          <div className="container mt-5">
            <h3>Creación de Item: </h3>
            <section className="needs-validation" id="updateForm" noValidate>
              <div className="col-md-6 mb-3">
                <ImageUploader
                  titleField="Imagen:"
                  imageValue={item.picture}
                  onImageUpload={handleItemImageChange}
                />
              </div> <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Titulo:
                </label>
                <input
                  className="form-control"
                  id="title"
                  name="title"
                  value={item.title}
                  onChange={handleItemChange}
                  required
                />
              </div> <div className="mb-3">
                <label htmlFor="info_header" className="form-label">
                  Info posicionamiento:
                </label>
                <textarea
                  className="form-control"
                  id="info_header"
                  name="info_header"
                  rows="3"
                  value={item.info_header}
                  onChange={handleItemChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Descripción:
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  rows="3"
                  value={item.description}
                  onChange={handleItemChange}
                  required
                />
              </div>
             
              <div className="d-flex flex-row me-3">
              <button
                  className="btn btn-sm btn-primary mb-3 me-2"
                  type="button"
                  onClick={handleSubmit}
                >Crear</button>
                <button
                  className="btn btn-sm btn-secondary mb-3 me-2"
                  onClick={itemOnClose}
                >Cancelar</button>
               
              </div>
            </section>
          </div>
        </div>
          }
      </div>
    </div>
  );
};

export default CreateLanding;
