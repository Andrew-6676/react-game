import '../css/game-field.scss';
import React, {useCallback, useEffect, useState} from 'react';
import {Dispatch} from 'redux';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {
	addRecordGame,
	changeDirection,
	moveSnake,
	pauseGame,
	restartGame,
	setBoundsGame,
	setSnakeSpeed,
	toggleMusicGame
} from '../store/actions';
import {Direction, GameState, IFood, IGameState, IRecord, ISnake, ISnakePart} from '../store/state';

import {find} from "lodash";
import {RootState} from '../store';

export enum FieldMode {
	EDIT = 'edit',
	PLAY = 'play',
}
interface IGameFieldProps {
	mode: FieldMode
}

 const DirectionDecrypt = {
	'5': '↑',
	'2': '→',
	'-5': '↓',
	'-2': '←',
	'0': '-'
}

function convertIndex(index: number): number[] {
	// console.log('convertIndex', index);
	return [Math.trunc(index % 30), Math.trunc(index / 30)];
}

const Cell: React.FC<any> = (props) => {

	let [state, setState] = useState({ clicked: false, clickCount: 0 });
	let [index, setIndex] = useState<number[]>([0,0]);

	useEffect(() => {
		setIndex(convertIndex(props.index));
	}, []);

	const food: readonly IFood[] = useSelector(
		(state: RootState) => state.game.eats,
		shallowEqual
	);

	const snake: ISnake = useSelector(
		(state: RootState) => state.game.snake,
		shallowEqual
	);

	let className = 'cell';
	if (state.clicked) {
		className += ' clicked';
	}
	const [x, y] = index!;
	const f: ISnakePart | undefined  = find(snake.body, {x, y});

	if (f?.head ) {
		className += ' snake-head';
	} else if(f) {
		className += ' snake-body';
	} else if (find(food, {x, y})) {
		className += ' food';
	}
	if (find(snake.stomach, {x, y})) {
		className += ' eaten';
	}

	const mouseEnterHandler = (event: any) => {
		// console.log('mouseLeaveHandler', event.buttons );
		if (event.buttons === 1) {
			setState({
				clicked: !state.clicked,
				clickCount: state.clickCount + 1,
			});
			event.stopPropagation();
		}
	}

	const mouseDownHandler = (event: any) => {
		const [x, y] = index;
		const f = find(snake, {x: x, y: y});
		console.log(f, {x, y}, index, snake);
		setState({clicked: !state.clicked, clickCount: state.clickCount + 1});
	}

	return (<div className={className}
				onMouseDown={mouseDownHandler}
				onMouseEnter={mouseEnterHandler}
				data-id={index}>
	</div>)
}

export const GameField = (props: IGameFieldProps) => {

	let [nickName, setNickName] = useState<string>('AAA');
	let [recordAdded, setRecordAdded] = useState<boolean>(false);

	let handleClick = (event: any): void => {
		console.log(event.target.getAttribute('data-id'));
	};
	let speedInputHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
		_setSnakeSpeed(Number(event.target.value));
	}
	let boundsCheckboxHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
		_setBoundsGame(event.target.checked);
	}
	let addRecordButtonHandler = (event: React.MouseEvent<HTMLButtonElement>): void => {
		event.preventDefault();
		event.stopPropagation();
		_addRecordGame({
			nick: nickName,
			date: new Date().toISOString().substr(0, 16).replace('T', ' '),
			score: state.snake.weight
		});
		setRecordAdded(true);
	}
	let addRecordInputHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
		setNickName(event.target.value);
	}
	let addRecordInputKeyHandler = (event: React.KeyboardEvent<HTMLInputElement>): void => {
		if (event.key === 'Enter') {
			_addRecordGame({
				nick: nickName,
				date: new Date().toISOString().substr(0, 16).replace('T', ' '),
				score: state.snake.weight
			});
			setRecordAdded(true);
		}
		event.stopPropagation();
	}

	const dispatch: Dispatch<any> = useDispatch();
	const _addRecordGame = React.useCallback(
		(record: IRecord) => dispatch(addRecordGame(record)),
		[dispatch]
	)
	const _restartGame = React.useCallback(
		() => {
			setRecordAdded(false);
			return dispatch(restartGame());
		},
		[dispatch]
	)
	const _setBoundsGame = React.useCallback(
		(bounds: boolean) => dispatch(setBoundsGame(bounds)),
		[dispatch]
	)
	const _pauseGame = React.useCallback(
		() => dispatch(pauseGame()),
		[dispatch]
	)
	const _moveSnake = React.useCallback(
		() => dispatch(moveSnake()),
		[dispatch]
	)
	const _changeDirection = React.useCallback(
		(direction: Direction) => dispatch(changeDirection(direction)),
		[dispatch]
	)
	const _toggleMusic = React.useCallback(
		() => dispatch(toggleMusicGame()),
		[dispatch]
	)
	const _setSnakeSpeed = React.useCallback(
		(speed: number) => dispatch(setSnakeSpeed(speed)),
		[dispatch]
	)


	const keyDownHandler = useCallback(
		(event: any) => {
			// // if spacebar is pressed to run a new game
			if (state.status === GameState.GAME_OVER && event.keyCode === 32) {
				console.log('=========>', event);
				if (event.target.tagName === 'INPUT') return;
				// event.preventDefault();
				event.stopPropagation();
				_restartGame();
				return;
			}

			if (state.status !== GameState.GAME_OVER && event.keyCode === 27) {
				_pauseGame();
				return;
			}
			// if (this.status.directionChanged) return

			switch (event.keyCode) {
				case 37:
				case 65:
					// this.goLeft()
					_changeDirection(Direction.LEFT);
					break
				case 38:
				case 87:
					// this.goUp()
					_changeDirection(Direction.UP);
					break
				case 39:
				case 68:
					// this.goRight()
					_changeDirection(Direction.RIGHT);
					break
				case 40:
				case 83:
					// this.goDown()
					_changeDirection(Direction.DOWN);
					break
				default:
			}
		}, []
	)

	const state: IGameState = useSelector(
		(state: RootState) => state.game,
		shallowEqual
	);
	const snake: ISnake =  useSelector(
		(state: RootState) => state.game.snake,
		shallowEqual
	);
	const currDirection: Direction = useSelector(
		(state: RootState) => state.game.currentSnakeDirection,
		shallowEqual
	);

	const cells = new Array(state.fieldSize.x * state.fieldSize.y)
		.fill(null)
		.map((e, i) => <Cell key={i} index={i} />);

	useEffect(() => {
		console.log('===========>>>> game-field useEffect()', );

		let  _interval: any;
		if (!state.pause && state.status===GameState.RUNNING) {
			_interval = (setInterval(() => {_moveSnake(); console.log('.');}, state.speed));
		}

		window.addEventListener('keydown', keyDownHandler);

		return () => {
			console.log('<<<=========== game-field useEffect()', state.pause, state.status);
			clearInterval(_interval);
			window.removeEventListener('keydown', keyDownHandler);
		}
	}, [state.speed, state.status, state.pause]);


	return (
		<div className="page-wrapper">
			Snake weight: {snake.weight}&nbsp;
			{state.status !== GameState.GAME_OVER ? <button onClick={() => {_pauseGame()}}>pause</button> : null}
			<button onClick={() => {_restartGame()}}>Start/Restart</button>
			<button onClick={() => {_toggleMusic()}}>Music {state.music ? 'On' : 'Off'}</button>
			<input type="number" title="Time between snake's moves" value={state.speed} step="100" onChange={speedInputHandler} />
			<label htmlFor="bounds">Bounds</label>
			<input type="checkbox" checked={state.bounds} name="bounds" id="bounds" onChange={boundsCheckboxHandler} />
			 {DirectionDecrypt[currDirection]}

			<div className="field-wrapper">
				<div className={`pause ${state.pause ? 'on' : 'off'} kids-font`} onClick={() => {_pauseGame()}}>
					<div>Pause</div>
				</div>

				<div className={`gameover ${state.status === GameState.GAME_OVER ? 'on' : 'off'} paint-font`} onClick={() => {/*_restartGame()*/}}>
					<div>GAME OVER</div>
					<div className="descr finter-font">Press spase to restart</div>

					{recordAdded ? `${nickName} - ${state.snake.weight}` :
						<div>
							<input type="text" value={nickName} onKeyPress={addRecordInputKeyHandler} onChange={addRecordInputHandler} id="gamer" placeholder="Enter your name" />
							<button onClick={addRecordButtonHandler}>Save scores</button>
						</div>
					}

				</div>

				<div className="field field_30" onClick={handleClick}>
					{cells}
				</div>
			</div>

			{/*<pre>{JSON.stringify(state.snake.body, null, 2)}</pre>*/}
			{/*<pre>{JSON.stringify({...state, snake: {...state.snake, body: []}}, null, 2)}</pre>*/}
		</div>
	)
};
