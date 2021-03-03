import '../css/game.scss';

import React from 'react';
import { FieldMode, GameField } from './game-field';

const Game = () => (
	<div className="game">
		<GameField mode={FieldMode.PLAY}></GameField>
	</div>
);

export default Game;
