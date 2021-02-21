import { createStore, compose, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { client } from './api/client'

import rootReducer from './reducer'
// import { sayHiOnDispatch, includeMeaningOfLife } from './exampleAddons/enhancers'
import { print1, print2, print3, loggerMiddleware, delayedMessageMiddleware, asyncFunctionMiddleware } from './exampleAddons/middleware'


let preloadedState
const persistedTodosString = localStorage.getItem('todos')

if (persistedTodosString) {
  preloadedState = {
    todos: JSON.parse(persistedTodosString),
  }
}


const middlewareEnhancer = composeWithDevTools(
    applyMiddleware(loggerMiddleware, delayedMessageMiddleware, thunkMiddleware)
)

// const composedEnhancer = compose(sayHiOnDispatch, includeMeaningOfLife)

const store = createStore(rootReducer, middlewareEnhancer)

// Write a function that has `dispatch` and `getState` as arguments
const fetchSomeData = (dispatch, getState) => {
  // Make an async HTTP request
  client.get('todos').then(todos => {
    // Dispatch an action with the todos we received
    dispatch({ type: 'todos/todosLoaded', payload: todos })
    // Check the updated store state after dispatching
    const allTodos = getState().todos
    console.log('Number of todos after loading: ', allTodos.length)
  })
}

// Pass the _function_ we wrote to `dispatch`
store.dispatch(fetchSomeData)
// logs: 'Number of todos after loading: ###'

export default store
