import {useState, useReducer} from 'react';
import reducer, {INITIAL_STATE, Creators, Types} from '../../store/filter';


export default function useFilter(){
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [filterState, dispatch] = useReducer(reducer, INITIAL_STATE);

    return {
        totalRecords,
        setTotalRecords,
        filterState,
        dispatch
    };
}