import '../css/records.scss'
import React from 'react';
import logo from '../img/logo512.png';
import { IRecord} from '../store/state';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from '../store';


const RecordItem = (props: {data:IRecord}) => {

	return (
		<>
			<div className="nick">{props.data.nick}:</div>
			<div className="date">{props.data.date}</div>
			<div className="score">{props.data.score}</div>
		</>
	)
}

const Records = () => {

	const records: IRecord[] = useSelector(
		(state: RootState) => state.game.records,
		shallowEqual
	);

	return (
		<div className="page">
			<h1 className="page_title">Strange snake</h1>
			<h3 className="paint-font">TOP 10 GAMERS:</h3>
			<div className="record-container">
				{records?.map((e, i) => <RecordItem key={i} data={e}/>)}
			</div>
		</div>
	);
}

export default Records;
