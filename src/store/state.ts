
export interface IPos {
	x: number;
	y: number;
}

export interface ISnakePart extends IPos {
	head?: boolean;
	tail?: boolean;
	withEat?: boolean;
}
export interface ISnake {
	body: ISnakePart[],
	stomach: IPos[],
	weight: number,
	bonus?: any
}

export interface IBarrier extends IPos {
	type: any;
}

export interface IFood extends IPos {
	type: string;
	kind: 'good' | 'bad';
	weight: number;
}

export interface IRecord {
	nick: string;
	date: string;
	score: number;
}

export interface IGameState {
	currentSnakeDirection: Direction,
	walls: IBarrier[];
	eats: IFood[];
	snake: ISnake;
	speed: number;
	scores: number;
	scoresToSpeedUp: number;
	status: GameState;
	pause: boolean;
	music: boolean;
	fieldSize: IPos;
	bounds: boolean,
	records: IRecord[];
}

export enum Direction {
	UP = 5,
	RIGHT = 2,
	DOWN = -5,
	LEFT = -2,
	STOP = 0
}

export enum GameState {
	STOPPED,
	RUNNING,
	GAME_OVER,
	AUTO_PLAY
}
