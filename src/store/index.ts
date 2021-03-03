import {gameReducer} from './game-reducers';
import {applyMiddleware, combineReducers, createStore, Store} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';

export const rootReducer = combineReducers({
	//snake: snakeReducer,
	game: gameReducer,
})

export const store: Store = createStore(rootReducer, composeWithDevTools());

export type RootState = ReturnType<typeof rootReducer>
