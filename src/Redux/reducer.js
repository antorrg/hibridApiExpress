import {
    LANDING,
    PRODUCT,
    PRODUCT_BY_ID,
    CLEAN_STATE,
    ITEM,
    ALL_USERS,
    USER_BY_ID,
    MEDIA,
    MEDIA_AD,
    MEDIA_BY_ID

} from './actions'

const initialState = {
    Landing:[],
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
        default:
            return{
                ...state,
            }
    }
}
export default reducer;