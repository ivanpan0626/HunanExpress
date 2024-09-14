import React, {useEffect, useReducer} from 'react'
import {useParams} from 'react-router-dom'
import {getAll, getAllTags, search, getAllByTag} from '../services/foodService.js'
import Thumbnails from '../components/Thumbnails/Thumbnails.js'
import Search from '../components/Search/Search.js'
import Tags from '../components/Tags/Tags.js'

const initialState = {foods:[], tags: []};

const reducer = (state,action) => {
  switch(action.type){
    case 'FOODS_LOADED':
      return {...state, foods: action.payload};
    case 'TAGS_LOADED':
      return {...state, tags: action.payload}
    default:
      return state;
  }
}

export default function HomePage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const{foods, tags} = state;
  const {searchTerm, tag} = useParams();

  useEffect( () => { //Loads all the sample food from foodService.js
    getAllTags().then(tags => dispatch({ type: 'TAGS_LOADED', payload: tags }));

    const loadFoods = tag
      ? getAllByTag(tag)
      : searchTerm
      ? search(searchTerm)
      : getAll();

    loadFoods.then(foods => dispatch({type: 'FOODS_LOADED', payload: foods }));
  }, [searchTerm, tag]);

  return (
    <>
    <Search></Search>
    <Tags tags={tags}></Tags>
    <Thumbnails foods={foods}></Thumbnails>
    </>
  )
}
