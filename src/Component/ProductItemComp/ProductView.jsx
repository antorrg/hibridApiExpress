import {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from "react-router-dom";
import showConfirmationDialog from '../../Utils/sweetalert'
import {booleanState} from '../../Utils/generalHelpers'
import {deleteProduct, deleteItem} from '../../Redux/endPoints'
import {  getProductById } from '../../Redux/actions';


const ProductView = () => {
  const dispatch = useDispatch()
  const product = useSelector((state)=> state.ProductId)
  const navigate = useNavigate();
  const {id} = useParams()
  
  const info = product?.info;
  const items = product?.items;

  useEffect(()=>{
    dispatch(getProductById(id))
  },[id])

  const toEdition = () => {
    navigate(`/admin/product/update/${info.id}`);
  };
  const itemCreate = () => {
    navigate(`/admin/product/item/create/${info.id}`);
  };
  const deleteCurrentProduct = async() => {
    const confirmed = await showConfirmationDialog(
      "¿Quiere eliminar este producto?"
    );
    if (confirmed) {
      // Si el usuario hace clic en "Aceptar", ejecutar la funcion:
      await deleteProduct(info.id);
      console.log('soy el producto a borrar: ',info.id)
      navigate('/admin?tab=producto')
      
    }
  };
   const delItem = async(id)=>{
    const confirmed = await showConfirmationDialog(
      "¿Quiere eliminar este item?"
    );
    if (confirmed) {
      // Si el usuario hace clic en "Aceptar", ejecutar la funcion:
      await deleteItem(id);
      //console.log('soy el item a borrar: ',id)
      
    }
   }

  return (
    <>
      <section className="py-5 text-center container">
        <div className="row py-lg-5 backgroundFormColor rounded-2">
          <div className="col-lg-6 col-md-8 mx-auto mt-2 mb-3">
            <h1 className="fw-light">Proyecto: {info?.title}</h1>
            <img
                  className="bd-placeholder-img-fluid me-4 mb-3"
                  src={info?.logo}
                  alt="Logo"
                  style={{ maxWidth: "5rem" }}
                />
            <img
                  className="bd-placeholder-img-fluid me-4 mb-3"
                  src={info?.landing}
                  alt="Imagen"
                  style={{ maxWidth: "22rem" }}
                />
              
                <h4>Info posicionamiento:</h4>
                <p className="lead text-muted">{info?.infoHeader}</p>
                <hr></hr>
                <h4>Descripcion:</h4>
            <p className="lead text-muted">{info?.infoBody}</p>
            <hr></hr>
                <h4>Estado:</h4>
            <p className="lead text-muted">{booleanState(info?.enable)}</p>
            <button className="btn btn-sm btn-secondary my-2" onClick={()=>navigate('/admin?tab=producto')}>
              Volver
            </button>
                <button onClick={toEdition} className="btn btn-sm btn-primary my-2 ms-2" >Editar</button>
                <button onClick={itemCreate}  className="btn btn-sm btn-outline-success my-2 ms-2" >Crear Item</button>
                <button className="btn btn-sm btn-outline-danger my-2 ms-2"  onClick={deleteCurrentProduct} >Eliminar producto</button>
          </div>
        </div>
      </section>
      <section className="album.py-5.">
        <div className="container backgroundFormColor rounded-2">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {items?.map((item) => (
                <div className="col mb-3 backgroundElements" key={item.id}>
                <div className="card shadow-sm">
                  <img className="card-img-top" src={item.img} alt="Card image" />
                  <div className="card-body">
                    <p className="card-text">{item.text}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="btn-group">
                        <button className="btn btn-sm btn-outline-secondary me-3" onClick={()=>navigate(`/admin/product/item/${item.id}`)} disabled={item.id===0? true : false}>
                           Ver mas
                         </button>
                        <button onClick={()=>{delItem(item.id)}} className="btn btn-sm btn-outline-danger" disabled={item.id===0? true : false}>Borrar</button>
                            
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className='mt-3'>
        <hr></hr>
      </div>
    </>
  );
}

export default ProductView