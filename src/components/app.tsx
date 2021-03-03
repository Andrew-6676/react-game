import /* webpackPrefetch: true */ '../css/common.scss';
import music1 from '../sound/02_Olley_Oxen_Free.mp3';
import music2 from '../sound/09_Operator_Plays_A_Little_Ping_Pong.mp3';
import music3 from '../sound/04_Rock_And_Roll_Dixie.mp3'
import music4 from '../sound/16_Confused_And_Upset.mp3'
import music5 from '../sound/17_The_Neverhood_Theme.mp3'
import music6 from '../sound/23_Klaymen_Takes_The_A_Train.mp3'
import music7 from '../sound/24_Low_Down_Doe.mp3'

import { Howl } from 'howler';
import React, {useEffect} from 'react';
import {
	HashRouter as Router,
	Link,
	Route,
	Switch } from 'react-router-dom';

import About from './about';
import Editor from './editor';
import Game from './game';
import Records from './records';
import Setup from './setup';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store';
import {Dispatch} from 'redux';
import { saveGame} from '../store/actions';
// import records from './records';

const music = [music1, music2, music3, music4, music5, music6, music7, ];
const routes = [
	{
		path: '/game',
		component: Game,
		title: 'Game'
	},
	{
		path: '/about',
		component: About,
		title: 'About'
	},
	{
		path: '/setup',
		component: Setup,
		title: 'Setup'
	},
	// {
	// 	path: '/editor',
	// 	component: Editor
	// 	title: 'Editor'
	// },
	{
		path: '/',
		component: Records,
		title: 'Records'
	},
];
function randomInteger(n: number): number {
	let rand = Math.random() * (n);
	return Math.floor(rand);
}

const App: React.FC<any> = (props) => {
	const musicOn: boolean = useSelector(
		(state: RootState) => state.game.music,
		shallowEqual
	);

	const dispatch: Dispatch<any> = useDispatch();
	const _saveGame = React.useCallback(
		() => dispatch(saveGame()),
		[dispatch]
	)

	window.onbeforeunload = () => {
		_saveGame();
	}

	useEffect(() => {
		console.log('mount App useEffect');
		const mList: Howl[] = [];
		let previousTracks: number[] = [];
		let currentTrack: number;

		function playNext() {
			while (currentTrack==null || previousTracks.indexOf(currentTrack)>=0) {
				currentTrack = randomInteger(mList.length);
			}
			previousTracks.push(currentTrack);
			if (previousTracks.length === mList.length) previousTracks = []
			console.log('PLAY NEXT:', currentTrack, previousTracks);
			mList[currentTrack].play();
		}
		if (musicOn) {
			for (let m of music) {
				mList.push(new Howl({
					src: [m],
					volume: 0.8,
					onend() {
						playNext();
					}
				}));
			}
			playNext();
		}
		return () => {
			mList[currentTrack]?.stop();
			console.log('unmount App useEffect');
		}
	}, [musicOn]);

	console.log('render App');
	return (<>
		<Router>
			<nav>
				<ul>
					{routes.map((route, i) => (
						<li key={i}>
							<Link
							   to={route.path}>
								{route.title}
							</Link>
						</li>
					))}

				</ul>
			</nav>
		</Router>

		<Router>
			{/* A <Switch> looks through its children <Route>s and
			renders the first one that matches the current URL. */}
			<Switch>
				{routes.map((route, i) => (
					<Route key={i}
						   path={route.path}>
						<route.component />
					</Route>
				))}
			</Switch>
		</Router>
	</>
);
}
export default App;
