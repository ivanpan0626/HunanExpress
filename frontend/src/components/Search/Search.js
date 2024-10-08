import React, { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom'
import styles from './search.module.css'

export default function Search(){
    const [term, setTerm] = useState('')
    const navigate = useNavigate();
    const {searchTerm} = useParams();

    useEffect(() => {
        setTerm(searchTerm ?? '')
    }, [searchTerm]);

    const search = async () =>{
        term ? navigate('/search/' + term) : navigate('/');
    }

    return(
        <div className={styles.container}>
            <input type='text'
                placeholder='Search Food'
                onChange={e => setTerm(e.target.value)}
                onKeyUp={e => e.key === 'Enter' && search()}
                value={term}>
            </input>
            <button onClick={search}>Search</button>
        </div>
    )
}