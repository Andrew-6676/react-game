import {Direction, GameState, IFood, IGameState, IPos, ISnake, ISnakePart} from './state';
import {
	ADD_RECORD_GAME,
	BOUNDS_GAME,
	GameActionTypes,
	NEW_RANDOM_FOOD,
	PAUSE_GAME,
	RESTART_GAME,
	SAVE_GAME,
	SNAKE_DIRECTION,
	SNAKE_EAT,
	SNAKE_MOVE, SNAKE_SPEED,
	SnakeActionTypes,
	START_GAME,
	TOGGLE_MUSIC_GAME
} from './actions';
import {cloneDeep, find, head, last, remove, orderBy} from 'lodash';

import {Howl} from 'howler';
import bite1 from '../sound/sfx/353067__josepharaoh99__bite-cartoon-style.mp3';
import burp1 from '../sound/sfx/172071__jeffijoe__small-burp.wav';
import die1 from '../sound/sfx/202037__thestigmata__man-die.wav';

const initialSnakeBody: ISnakePart[] = [
		{x:4, y:0, head: true},
		{x:3, y:0},
		{x:2, y:0},
		{x:1, y:0},
		{x:0, y:0, tail: true}
	];

const initialGameState: IGameState = {
	currentSnakeDirection: Direction.RIGHT,
	walls: [],
	snake: {
		body: cloneDeep(initialSnakeBody),
		stomach: [],
		weight: 5
	},
	eats: [],
	speed: 100,
	scores: 0,
	scoresToSpeedUp: 0,
	status: GameState.STOPPED,
	pause: false,
	music: true,
	fieldSize: {x: 30, y: 20},
	bounds: true,
	records: [
		{nick: 'Developer', date: '2021-03-03 23:59', score: 9987},
		{nick: 'Tester', date: '2021-03-03 23:58', score: 548},
		{nick: 'Cleaner', date: '2021-03-03 23:57', score: 254},
	]
}

function loadState(): IGameState {
	const state = localStorage.getItem('snakeGameState');
	return state ? JSON.parse(state) : initialGameState;
}

function saveState(state: IGameState) {
	if (state.status !== GameState.GAME_OVER) {
		state.pause = true;
	}
	localStorage.setItem('snakeGameState', JSON.stringify(state));
}

const hrumSound: Howl = new Howl({
	src: [bite1],
	volume: 0.6,
});
const dieSound: Howl = new Howl({
	src: [die1],
	volume: 1,
});

const burpSound: Howl = new Howl({
	src: [burp1],
	volume: 1.3,
});

export function gameReducer(
	state = loadState(),
	action: SnakeActionTypes | GameActionTypes): IGameState {
	switch (action.type) {
		case SNAKE_SPEED:
			return {
				...state,
				speed: action.payload
			}
		case SNAKE_DIRECTION:
			if (action.payload + state.currentSnakeDirection !== 0) {
				return state.pause ? state : {...state, currentSnakeDirection: action.payload};
			}
			break;
		case SNAKE_MOVE:
			return state.pause ? state : moveSnakeReducer(state);
		case SNAKE_EAT:
			return eatSnakeReducer(action.payload, state);
		case NEW_RANDOM_FOOD:
			return {
				...state,
				eats: generateNewFood(state,1)
			};
		case TOGGLE_MUSIC_GAME:
			return {...state, music: !state.music};
		case BOUNDS_GAME:
			console.log('BOUNDS_GAME: ', action.payload);
			return {...state, bounds: action.payload};
		case PAUSE_GAME:
			console.log('PAUSE: ', state.pause);
			return {
				...state,
				pause: !state.pause
			};
		case ADD_RECORD_GAME:
			const newState = {...state};
			newState.records = orderBy(newState.records.concat(action.payload), ['score'], ['desc']).slice(0, 10)
			saveState(newState);
			return newState;
		case SAVE_GAME:
			saveState(state);
			break;
		case RESTART_GAME:
		case START_GAME:
			console.log('(RE)START_GAME', initialSnakeBody);
			return {
				...initialGameState,
				snake: {
					...state.snake,
					body: cloneDeep(initialSnakeBody),
					stomach: [],
					weight: 5
				},
				eats: generateNewFood(state, 1),
				currentSnakeDirection: Direction.RIGHT,
				status: GameState.RUNNING,
				pause: false,
				music: state.music,
				bounds: state.bounds,
				records: state.records
			};
		}
	return state;
}

function moveSnake(state: IGameState, x: number, y: number): ISnakePart[] {
	let newSnakeBody = state.snake.body
	const newHead = newSnakeBody.pop()!;
	last(newSnakeBody)!.tail = true;
	newSnakeBody[0].head = false;
	newHead.tail = false;
	newHead.head = true;
	newHead.x = newSnakeBody[0].x + x;
	newHead.y = newSnakeBody[0].y + y;

	if (state.bounds && (newHead.x < 0 || newHead.y < 0 || newHead.x == state.fieldSize.x || newHead.y == state.fieldSize.y)) {
		return [];
	} else {
		newHead.x = newHead.x % state.fieldSize.x;
		newHead.y = newHead.y % state.fieldSize.y;
		if (newHead.x < 0) {
			newHead.x = state.fieldSize.x - -newHead.x;
		}
		if (newHead.y < 0) {
			newHead.y = state.fieldSize.y - -newHead.y;
		}
	}

	newSnakeBody.unshift(newHead!);

	return newSnakeBody;
}

function randomInteger(min: number, max: number): number {
	// случайное число от min до (max)
	let rand = min + Math.random() * (max - min);
	return Math.floor(rand);
}

function generateNewFood(state: IGameState, count: number): IFood[] {
	let x = randomInteger(0, state.fieldSize.x);
	let y = randomInteger(0, state.fieldSize.y);

	while (find(state.snake.body, {x, y})) {
		x = randomInteger(0, state.fieldSize.x);
		y = randomInteger(0, state.fieldSize.y);
	}

	return new Array(count).fill(null).map( () => {
		return {
			...{x, y},
			weight: randomInteger(1,5),
			type: 'beer',
			kind: 'good'
		}
	});
}

function checkFood(eats: IFood[], head: ISnakePart): IFood | undefined {
	return find(eats, {x: head.x, y: head.y}) ;
}
function checkGrow(snake: ISnake): IPos | undefined {
	const {x, y} = last(snake.body)!;
	return find(snake.stomach, {x, y});
}
function checkCannibal(snake: ISnake): boolean {
	const {x, y} = head(snake.body)!;
	return !!find(snake.body, {x, y, head: false});
}

function moveSnakeReducer(state: IGameState): IGameState {
	let newSnakeBody = state.snake.body;

	const grow = checkGrow(state.snake);

	switch (state.currentSnakeDirection) {
		case Direction.DOWN:
			newSnakeBody = moveSnake(state, 0, 1);
			break;
		case Direction.LEFT:
			newSnakeBody = moveSnake(state, -1, 0);
			break;
		case Direction.RIGHT:
			newSnakeBody = moveSnake(state, 1, 0);
			break;
		case Direction.UP:
			newSnakeBody = moveSnake(state, 0, -1);
			break;
		case Direction.STOP:
			// console.log('Smoking...');
			break;
	}

	if (checkCannibal(state.snake)) {
		dieSound.play();
		return {
			...state,
			status: GameState.GAME_OVER,
		}
	}
	const stomach = [...state.snake.stomach];
	const eaten = checkFood(state.eats, newSnakeBody[0]);
	let weight = state.snake.weight;
	let {speed, scoresToSpeedUp} = state;
	let newEats = [...state.eats];

	if (eaten) {
		hrumSound.play();
		setTimeout(() => {
			burpSound.play()
		}, 800)
		stomach.push(eaten);
		weight += eaten.weight;
		scoresToSpeedUp += eaten.weight;
		let arr = generateNewFood(state,1);
		newEats = newEats.concat(arr);

		if (scoresToSpeedUp > 10) {
			scoresToSpeedUp = 0;
			speed -= Math.ceil(speed * 0.15);
		}
	}
	let currentSnakeDirection = state.currentSnakeDirection;
	if (grow) {
		last(newSnakeBody)!.tail = false;
		newSnakeBody.push({
			x: grow.x,
			y:  grow.y,
			tail: true
		})
		remove(stomach, (e) => e===grow);
		remove(newEats, (e) => e.x===grow.x && e.y===grow.y);
		//currentSnakeDirection = Direction.STOP;
		console.log('GROW!', state.eats, stomach, newSnakeBody);
	}

	return {...state,
		currentSnakeDirection,
		eats: newEats,
		scoresToSpeedUp,
		speed,
		snake: {
			...state.snake,
			weight,
			stomach,
			body: newSnakeBody
		}
	};
}

function eatSnakeReducer(food: IFood, state: IGameState): IGameState {
	return {...state, snake: {...state.snake, weight: state.snake.weight + food.weight}};
}

function createFood() {

}
