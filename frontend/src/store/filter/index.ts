import * as Typing from "./types";
import { createActions, createReducer } from 'reduxsauce';


export const { Types, Creators } = createActions<{
    SET_SEARCH: string,
    SET_PAGE: string,
    SET_PER_PAGE: string,
    SET_ORDER: string,
    SET_RESET: string,
    UPDATE_EXTRA_FILTER: string,
}, {
    setSearch(payload: Typing.SetSearchAction['payload']): Typing.SetSearchAction
    setPage(payload: Typing.SetPageAction['payload']): Typing.SetPageAction
    setPerPage(payload: Typing.SetPerPageAction['payload']): Typing.SetPerPageAction
    setOrder(payload: Typing.SetOrderAction['payload']): Typing.SetOrderAction
    setReset(payload: Typing.SetResetAction['payload']): Typing.SetResetAction
    updateExtraFilter(payload: Typing.UpdateExtraFilterAction['payload']): Typing.UpdateExtraFilterAction
}>({
    setSearch: ['payload'],
    setPage: ['payload'],
    setPerPage: ['payload'],
    setOrder: ['payload'],
    setReset: ['payload'],
    updateExtraFilter: ['payload'],
});

export const INITIAL_STATE: Typing.State = { 
    search: null, 
    pagination: {
        page: 1,
        per_page: 10,
    },
    order: {
        sort: null,
        dir: null,
    } 
}

const reducer = createReducer<Typing.State, Typing.Actions>(INITIAL_STATE, {
    [Types.SET_SEARCH]: setSearch as any,
    [Types.SET_PAGE]: setPage as any,
    [Types.SET_PER_PAGE]: setPerPage as any,
    [Types.SET_ORDER]: setOrder as any,
    [Types.SET_RESET]: setReset as any,
    [Types.UPDATE_EXTRA_FILTER]: updateExtraFilter as any,
});

export default reducer;

function setSearch(state = INITIAL_STATE, action: Typing.SetSearchAction): Typing.State{
    return {
        ...state,
        search: action.payload.search,
        pagination: {
            ...state.pagination,
            page: 1
        }
    }
}
function setPage(state = INITIAL_STATE, action: Typing.SetPageAction): Typing.State{
    return {
        ...state,
        pagination: {
            ...state.pagination,
            page: action.payload.page,
        }
    }
}
function setPerPage(state = INITIAL_STATE, action: Typing.SetPerPageAction): Typing.State{
    return {
        ...state,
        pagination: {
            ...state.pagination,
            per_page: action.payload.per_page,
        }
    }
}

function setOrder(state = INITIAL_STATE, action: Typing.SetOrderAction): Typing.State{
    return {
        ...state,
        order: {
            sort: action.payload.sort,
            dir: action.payload.dir,
        }
    }
}

function setReset(state = INITIAL_STATE, action: Typing.SetResetAction){
    return action.payload.state;
}

function updateExtraFilter(state = INITIAL_STATE, action: Typing.UpdateExtraFilterAction): Typing.State{
    return {
        ...state,
        extraFilter: {
            ...state.extraFilter,
            ...action.payload,
        }
    }
}

