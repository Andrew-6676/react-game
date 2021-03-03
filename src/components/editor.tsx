import React from 'react';
import { FieldMode, GameField } from './game-field';

const Editor = () => (
	<div className="setup_page">
		<h1 className="page_title">Editor</h1>
		<div className="editor">
			<GameField mode={FieldMode.EDIT}></GameField>
		</div>
	</div>
);

export default Editor;
