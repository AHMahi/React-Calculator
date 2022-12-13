import { ACTIONS } from './App'

export default function DigitButton({ dispatch, digit }) {
    return (
    <button 
        onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: {digit}})}//onclick we call a dispatch function and we pass in a type which is our ACTION
    >
        {digit}
    </button>
    )
}