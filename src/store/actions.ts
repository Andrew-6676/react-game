export const SNAKE_MOVE = 'SNAKE_MOVE'
export const SNAKE_EAT = 'SNAKE_EAT'
export const SNAKE_DIRECTION = 'SNAKE_DIRECTION'
export const SNAKE_SPEED = 'SNAKE_SPEED'


import {Direction, IFood, IRecord} from './state';

// action creator
export function moveSnake(): SnakeActionTypes {
	return {
		type: SNAKE_MOVE
	}
}
export function changeDirection(direction: Direction): SnakeActionTypes {
	return {
		type: SNAKE_DIRECTION,
		payload: direction
	}
}
export function setSnakeSpeed(speed: number): SnakeActionTypes {
	return {
		type: SNAKE_SPEED,
		payload: speed
	}
}

export interface MoveSnakeAction {
	type: typeof SNAKE_MOVE
}
export interface ChangeSnakeDirectionAction {
	type: typeof SNAKE_DIRECTION,
	payload: Direction
}
interface EatSnakeAction {
	type: typeof SNAKE_EAT,
	payload: IFood
}
interface SetSpeedSnakeAction {
	type: typeof SNAKE_SPEED,
	payload: number
}


export type SnakeActionTypes = MoveSnakeAction | EatSnakeAction | ChangeSnakeDirectionAction | SetSpeedSnakeAction;

/*---------------------------------------------------------------------------*/

export const SAVE_GAME = 'SAVE_GAME'
export const START_GAME = 'START_GAME'
export const RESTART_GAME = 'RESTART_GAME'
export const PAUSE_GAME = 'PAUSE_GAME'
export const BOUNDS_GAME = 'BOUNDS_GAME'
export const TOGGLE_MUSIC_GAME = 'TOGGLE_MUSIC_GAME'
export const NEW_RANDOM_FOOD = 'NEW_RANDOM_FOOD'
export const ADD_RECORD_GAME = 'ADD_RECORD_GAME'


export function newRandomFood(): GameActionTypes {
	return {
		type: NEW_RANDOM_FOOD
	}
}
export function restartGame(): GameActionTypes {
	return {
		type: RESTART_GAME
	}
}
export function startGame(): GameActionTypes {
	return {
		type: START_GAME
	}
}
export function saveGame(): GameActionTypes {
	return {
		type: SAVE_GAME
	}
}
export function pauseGame(): GameActionTypes {
	return {
		type: PAUSE_GAME
	}
}
export function toggleMusicGame(): GameActionTypes {
	return {
		type: TOGGLE_MUSIC_GAME
	}
}
export function addRecordGame(bounds: IRecord): GameActionTypes {
	return {
		type: ADD_RECORD_GAME,
		payload: bounds
	}
}
export function setBoundsGame(bounds: boolean): GameActionTypes {
	return {
		type: BOUNDS_GAME,
		payload: bounds
	}
}

export interface RandomFoodAction {
	type: typeof NEW_RANDOM_FOOD
}
export interface RestartGameAction {
	type: typeof RESTART_GAME
}
export interface StartGameAction {
	type: typeof START_GAME
}
export interface SaveGameAction {
	type: typeof SAVE_GAME
}
export interface PauseGameAction {
	type: typeof PAUSE_GAME
}
export interface BoundsGameAction {
	type: typeof BOUNDS_GAME,
	payload: boolean
}
export interface AddRecoordGameAction {
	type: typeof ADD_RECORD_GAME,
	payload: IRecord
}
export interface ToggleMusicGameAction {
	type: typeof TOGGLE_MUSIC_GAME
}

export type GameActionTypes = RestartGameAction | RandomFoodAction | StartGameAction | SaveGameAction| PauseGameAction | ToggleMusicGameAction | BoundsGameAction | AddRecoordGameAction;
