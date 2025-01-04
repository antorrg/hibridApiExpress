import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import showConfirmationDialog from "../../Utils/sweetalert";
import ImageUploader from "../../Utils/ImageUploader";
import { createProduct } from "../../Redux/endPoints";


const CreateProduct = () => {
  const navigate = useNavigate();
  const onClose = () => navigate(-1);
  const [product, setProduct] = useState({
    uniqueField:'title',
    title: "",
    landing: "",
    logo:"",
    info_header: "",
    info_body: "",
    url:"",
    items: [{ img: "", text: "" }],
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleItemChange = (index, event) => {
    const { name, value } = event.target;
    setProduct((prevProduct) => {
      const newItems = [...prevProduct.items];
      newItems[index] = { ...newItems[index], [name]: value };
      return { ...prevProduct, items: newItems };
    });
  };

  const handleImageChange = (name, url) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: url,
    }));
  };

  const handleItemImageChange = (index, url) => {
    setProduct((prevProduct) => {
      const newItems = [...prevProduct.items];
      newItems[index] = { ...newItems[index], img: url };
      return { ...prevProduct, items: newItems };
    });
  };

  const addItem = () => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      items: [...prevProduct.items, { img: "", text: "" }],
    }));
  };

  const removeItem = (index) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      items: prevProduct.items.filter((_, i) => i !== index),
    }));
  };

  
  const handleSubmit = async () => {
    const confirmed = await showConfirmationDialog(
      "¿Está seguro de crear el producto?"
    );
    if (confirmed) {
      // Aquí iría la lógica para crear el producto
      console.log(product)
      createProduct(product, onClose);
    }
  };
  const permit = !product.title.trim()||
                !product.info_body.trim()||
                !product.info_header.trim()||
                !product.url.trim()||
                !product.items[0].text.trim();
  
  return (
    <div className="backgroundPages">
      <div className="coverAdmin">
        <div className="container-sm modal-content formProductContainer backgroundFormColor rounded-4 shadow">
          <div className="container mt-5">
            <h3>Creación de Producto: </h3>
            <section className="needs-validation" id="updateForm" noValidate>
              <div className="col-md-6 mb-3">
                <ImageUploader
                  titleField="Imagen principal:"
                  imageValue={product.landing}
                  onImageUpload={(url) => handleImageChange("landing", url)}
                />
              </div>
              <div className="col-md-6 mb-3">
                <ImageUploader
                  titleField="Imagen de logo:"
                  imageValue={product.logo}
                  onImageUpload={(url) => handleImageChange("logo", url)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Título:
                </label>
                <input
                  className="form-control"
                  type="text"
                  id="title"
                  name="title"
                  value={product.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="info_header" className="form-label">
                  Info posicionamiento:
                </label>
                <textarea
                  className="form-control"
                  id="info_header"
                  name="info_header"
                  rows="3"
                  value={product.info_header}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="info_body" className="form-label">
                  Descripción:
                </label>
                <textarea
                  className="form-control"
                  id="info_body"
                  name="info_body"
                  rows="3"
                  value={product.info_body}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="url" className="form-label">
                  Url:
                </label>
                <input
                  className="form-control"
                  type="text"
                  id="url"
                  name="url"
                  value={product.url}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <div className="d-flex justify-content-start align-items-center">
                <h4>Items:</h4>
                </div>
                {product.items.map((item, index) => (
                  <div key={index}>
                    <div>
                      <label htmlFor={`item_img_${index}`}>Imagen:</label>
                      <ImageUploader
                        id={`item_img_${index}`}
                        titleField=""
                        imageValue={item.img}
                        onImageUpload={(url) =>
                          handleItemImageChange(index, url)
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor={`item_text_${index}`}>Texto: </label>
                      <textarea
                        id={`item_text_${index}`}
                        name="text"
                        value={item.text}
                        className="form-control"
                        onChange={(event) => handleItemChange(index, event)}
                        required
                      />
                    </div>
                    <button
                      onClick={() => removeItem(index)}
                      className="btn btn-sm btn-outline-danger mb-3"
                      disabled={product.items.length === 1}
                    >Eliminar</button>
                  </div>
                ))}
              </div>
              <div className="d-flex flex-row me-3">
                <button
                  className="btn btn-outline-success mb-3 me-2"
                  type="button"
                  onClick={addItem}
                >Agregar Item</button>
                <button
                  className="btn btn-md btn-secondary mb-3 me-2"
                  onClick={onClose}
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
    </div>
  );
}

export default CreateProduct