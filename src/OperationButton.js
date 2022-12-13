import { ACTIONS } from './App'

export default function OperationButton({ dispatch, operation }) {
    return (
//While action types allow you tell your reducer what action it should take, the payload is the data that your reducer will use to update the state
    <button 
        onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation }})}//onclick we call a dispatch function and we pass in a type which is our ACTION
    >
        {operation}
    </button>
    )
}