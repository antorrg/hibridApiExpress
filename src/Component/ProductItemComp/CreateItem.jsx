import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import showConfirmationDialog from "../../Utils/sweetalert";
import ImageUploader from "../../Utils/ImageUploader";
import Loading from '../Loading'
import { createItem } from "../../Redux/endPoints";


const CreateItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [load, setLoad]=useState(false)

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
    img: "",
    text: "",
    id: id,
  });

  const handleItemImageChange = (url) => {
    setItem((prevItem) => ({ ...prevItem, img: url }));
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
      // Aquí iría la lógica para crear el producto
      setLoad(true)
     await createItem(item, itemOnClose, rejectOnClose);
      //console.log('soy el nuevo item: ',item);
    }
  };
  const permit = !item.text.trim();

  return (
    <div className="imageBack">
      {load?
      <Loading/>
      :
      <div className="coverBack">
        <div className="container-md modal-content colorBack backgroundFormColor formProductContainer rounded-4 shadow">
          <div className="container mt-5">
            <h3>Creación de Item: </h3>
            <section className="needs-validation" id="updateForm" noValidate>
            
              <div className="col-md-6 mb-3">
                <ImageUploader
                  titleField="Imagen:"
                  imageValue={item.img}
                  onImageUpload={handleItemImageChange}
                />
              </div>
      
              <div className="mb-3">
                <label htmlFor="text" className="form-label">
                  Texto:
                </label>
                <textarea
                  className="form-control"
                  id="text"
                  name="text"
                  rows="3"
                  value={item.text}
                  onChange={handleItemChange}
                  required
                />
              </div>
              <div className="d-flex flex-row me-3">
                <button
                  className="btn btn-md btn-secondary mb-3 me-2"
                  onClick={itemOnClose}
                >Cancelar</button>
                <button
                  className="btn btn-md btn-primary mb-3 me-2"
                  type="button"
                  onClick={handleSubmit}
                  disabled={permit}
                >Crear</button>
              </div>
            </section>
          </div>
        </div>
      </div>
        }
    </div>
  );
};


export default CreateItem