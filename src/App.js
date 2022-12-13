import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./styles.css"

//the actions that will be handled by the reducer
export const ACTIONS = {
  ADD_DIGIT: 'add-digit',// adds a digit to the output display when clicked
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUALTE: 'evaluate'
}

//our reducer function for manging state
function reducer(state, { type, payload }){
  switch(type) { //switch case for doing a function based on the action selected
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {//replace entire current operand with digit we select (not applicable for operation button presses) after equal button does its calculation
          ...state,
          currentOperand: payload.digit,
          overwrite: false,//and we make overwrite false again
        }
      }
      //condition for not adding multiple 0 at the beginning.
      if ( payload.digit === "0" && state.currentOperand === "0") return state
      //condition for not adding multiple decimal point at any place.
      if ( payload.digit === "." && state.currentOperand.includes(".")) return state     
      return {
        ...state, 
        currentOperand:`${state.currentOperand || ""}${payload.digit}`,
      }
      case ACTIONS.CHOOSE_OPERATION:
        //when our output has no operand clicked and is essentially empty we do nothing when we click an operand
        if (state.currentOperand == null && state.previousOperand == null){
          return state
        }

        if (state.currentOperand == null) {
          return {
            ...state,//return the state object
            operation: payload.operation,
          }
        }
        //if our previous operand is null but we have something in our current operand, then we make the current opernad and set it as previous
        if (state.previousOperand == null) {
          return {
            ...state,
            operation: payload.operation,//the operation we passed in from OperationButton.js which is what we click in the UI
            previousOperand: state.currentOperand,
            currentOperand: null,
          }
        }

        //default action of the calculator
        return {
          ...state,
          //we are taking our current and our previous and then calculating it based on the selected operand and then setting it as our previous
          previousOperand: evaluate(state),
          operation: payload.operation,
          currentOperand: null
        } 
      case ACTIONS.CLEAR:
        return {}// when we click we want to return an empty string
      case ACTIONS.DELETE_DIGIT:
        if (state.overwrite) {
          return{
            ...state,
            overwrite: false,
            currentOperand: null
          }
        }

        if (state.currentOperand == null) return state
        if (state.currentOperand.length === 1) {
          return {
            ...state,
            currentOperand: null
          }
        }
          return {
            ...state,
            currentOperand: state.currentOperand.slice(0, -1)
          }

      case ACTIONS.EVALUALTE:
        //what happens when we click equal button when we have selected nothing or havent completed a corect calculation action
        if (state.operation == null || state.currentOperand == null || state.previousOperand == null)
        {
          return state//we do nothing
        }
        //otherwise we do evalualtion where we set our previous operand, selected operation back to null 
        return {
          ...state,
          overwrite: true,//after a calculation is complete when we select a new value we want it to overwrite the shown value
          previousOperand: null,
          operation: null,
          currentOperand: evaluate(state),//and current operand will be whatever we get after calculation/evaluation
        }
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch (operation) {
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
    computation = prev * current
    break
    case "÷":
    computation = prev / current
    break  
  }

  return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,//seperating integer and decimal portion so that we can put 0's after the decimal point
})

function formatOperand(operand) {// function for seperating large values with commas
  if (operand == null) return
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`// this line ensures we put no comma after decimal point
}
//our app had 3 states and we are using reducer to manage the state
function App() {
  //this const is the reducer at its initial state
  const [{ currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {})
  
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })} >DEL</button>
      <OperationButton operation= "÷" dispatch={dispatch} />
      <DigitButton digit= "1" dispatch={dispatch} />
      <DigitButton digit= "2" dispatch={dispatch} />
      <DigitButton digit= "3" dispatch={dispatch} />
      <OperationButton operation= "*" dispatch={dispatch} />
      <DigitButton digit= "4" dispatch={dispatch} />
      <DigitButton digit= "5" dispatch={dispatch} />
      <DigitButton digit= "6" dispatch={dispatch} />
      <OperationButton operation= "+" dispatch={dispatch} />
      <DigitButton digit= "7" dispatch={dispatch} />
      <DigitButton digit= "8" dispatch={dispatch} />
      <DigitButton digit= "9" dispatch={dispatch} />
      <OperationButton operation= "-" dispatch={dispatch} />
      <DigitButton digit= "." dispatch={dispatch} />
      <DigitButton digit= "0" dispatch={dispatch} />
       
      <button /*When this button is clicked thr Evaluate action is triggered?*/
      className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUALTE })}>=</button>
    </div>
  );
}

export default App;
