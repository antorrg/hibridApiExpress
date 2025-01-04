import {useEffect} from 'react'
import { Link, useNavigate, useParams } from "react-router-dom";
import {useDispatch, useSelector } from 'react-redux'
import {getItem} from '../../Redux/actions'
import {booleanState} from '../../Utils/generalHelpers'

const ItemView = () => {
  const dispatch = useDispatch()
 const navigate = useNavigate()
 const {id} = useParams()
 const item = useSelector(state =>state.Item)

 console.log(item)

 useEffect(()=>{
   dispatch(getItem(id))
 },[id])

 
  return (
    <div className='container-sm'>
      <div
        className="modal modal-tour position-static d-block modal-custom py-5"
        tabIndex="-1"
        role="dialog"
        id="modalTour"
      >
        <div className=" modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-body p-5 text-center">
              <img
                className="d-block.mx-auto mb-4 ms-4 me-4"
                style={{maxWidth: '80%'}}
                src={item?.img}
                alt="image not found"
              />
              <p className="text-muted"><strong>Texto: </strong>{item?.text}</p>
              <p className="text-muted"><strong>Estado: </strong> {booleanState(item?.enable)}</p>
              <Link
                className="btn btn-sm btn-secondary mt-3 mx-auto w-25"
                to={`/admin/product/${item?.ProductId}`}
              >
                Cerrar
              </Link>
                <button onClick={() => { navigate(`/admin/product/item/update/${item.id}`)}} className={"btn btn-sm btn-primary mt-3 ms-2 mx-auto w-25"}> Editar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemView