
import {
    LANDING,
    LANDING_BY_ID,
    PRODUCT,
    PRODUCT_BY_ID,
    ITEM,
    ALL_USERS,
    USER_BY_ID,
    CLEAN_STATE,
    

} from './actions'

const initialState = {
    Landing:[],
    LandingId: [],
    Products:[],
    ProductId:[],
    Item:[],
    Users:[],
    UserById: [],
    Media: [],
    MediaAd:[],
    MediaById:[],

}

const reducer = (state = initialState, {type, payload})=>{
    switch(type){
        case LANDING:
            return{
                ...state,
                Landing:payload[0],
            }
        case LANDING_BY_ID :
            return {
                ...state,
                LandingId : payload,
            }
        case PRODUCT:
            return {
                ...state,
                Products : payload,
            }
        case PRODUCT_BY_ID:
            return {
                ...state,
                ProductId: payload,
            }
        case ITEM :
            return {
                ...state,
                Item : payload,
            }
        case ALL_USERS:
            return {
                ...state,
                Users: payload
            }
        case USER_BY_ID:
            return {
                ...state,
                UserById : payload,
            }
        case CLEAN_STATE: 
            return {
                ...state,
                LandingId: [],
                ProductId : [],
                Item : [],
                UserById: [],
            }
        default:
            return{
                ...state,
            }
    }
}
export default reducer;