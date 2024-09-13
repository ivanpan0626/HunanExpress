import React, {useEffect, useReducer} from 'react'
import {getAll} from '../services/foodService.js'
import Thumbnails from '../components/Thumbnails/Thumbnails.js'

const initialState = {foods:[]};
const reducer = (state,action) => {
  switch(action.type){
    case 'FOODS_LOADED':
      return {...state, foods: action.payload};
    default:
      return state;
  }
}

export default function HomePage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const{foods} = state;

  useEffect( () => { //Loads all the sample food from foodService.js
    getAll().then(foods => dispatch({type: 'FOODS_LOADED', payload: foods }));
  }, [])

  return (
    <Thumbnails foods={foods}></Thumbnails>
  )
}
