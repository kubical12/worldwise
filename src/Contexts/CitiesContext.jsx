import { createContext ,  useEffect, useContext, useReducer} from "react";

const BASE_URL = 'http://localhost:8000';
const CitiesContext = createContext();


// it will need to accept the children prop so that we can use ProviderComponent as a top level component in the app component.
// combining the context api + useReducer .

const innitialState ={
  cities:[],
  isLoading: false,
  currentCity:{},
  error: ""
}
function reducer(state, action){
    switch(action.type){
       case "loading":
        return {
          ...state ,
          isLoading : true
        }
      case 'cities/loaded': 
      return {
        ...state, 
        isLoading: false , 
        cities: action.payload ,
      }
      case 'city/loaded':
        return{
          ...state,
          isLoading: false,
          currentCity: action.payload
        }
      case 'city/created':
        return {
          ...state, isLoading : false,
            cities:[...state.cities , action.payload],
            currentCity: action.payload,
        }

      case 'city/deleted':
        return {
          ...state,
          isLoading: false,
          cities: state.cities.filter((city) => city.id !== action.payload),
          currentCity:{}
        }

      case "rejected":
        return{
          ...state, 
          isLoading: false,
          error: action.payload
        }
        default :
         throw new Error("unknown action type");
    }
}
function CitiesProvider({children}){

  const [{cities , isLoading , currentCity , error}, dispatch] = useReducer(reducer , innitialState);
    // const [cities , setCities] = useState([]);
    // const [isLoading , setIsLoading] = useState(false);
    // const [currentCity , setCurrentCity] =useState({});

    useEffect(function() {
      async function fetchCities(){
        dispatch({type: "loading"});
        try {
          // setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({type: 'cities/loaded' , payload:data})
      } catch {
        dispatch({
          type: "rejected",
          payload:"there was an error loading a data",
        })
      } 
      }
      fetchCities();
    } ,[])

   async function getCity(id){
    dispatch({type:"loading"})
      try{
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();
        dispatch({type: "city/loaded" , payload: data})
      }catch{
        dispatch({
          type:"rejected",
          payload:"there was an error loading data"
        })
      }
    }
    
    // standard way of post request to our fake api .
   async function createCity(newCity){
    dispatch({type: "loading"})
    try{
      const res = await fetch(`${BASE_URL}/cities`,{
        method:"POST",
        body: JSON.stringify(newCity),
        headers:{
          "Content-Type" : "application/json",
        }
            });
      const data = await res.json();
      dispatch({type: "city/created", payload: data})
    }catch{
      dispatch({
        type:"rejected",
        payload:"there was an creating city"
      })
    }
  }

  async function deleteCity(id){
    dispatch({type: "loading"});
    try{
      await fetch(`${BASE_URL}/cities/${id}`,{
        method:"DELETE",
            });
      // 
      dispatch({type:"city/deleted" , payload: id})
    }catch{
      dispatch({
        type:"rejected",
        payload:"there was an error loading data"
      })
    }
  }

    return (
        <CitiesContext.Provider value={{
            cities , 
            isLoading,
            currentCity,
            error,
            getCity,
            createCity,
            deleteCity
        }}>
            {children}
        </CitiesContext.Provider>
    )
}
function useCities(){
    const context = useContext(CitiesContext);
    if(context === undefined)
    throw new Error("citiesContext was used outside the CitiesProvider")
    return context;
}

export {CitiesProvider , useCities}