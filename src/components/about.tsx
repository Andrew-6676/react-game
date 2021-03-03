import '../css/about.scss';
import React from 'react';

const About = () => (

	<div className="page">
		<h1 className="page_title">About</h1>
		<div className="about">
			<p className="finter-font">
				It is my first react application. This game was created with enough beer. And with not enough time...
				Game need in deep refactoring.
			</p>
			<p>
				This game used:
			</p>
			<ul>
				<li>React</li>
				<li>Redux</li>
				<li>Router</li>
				<li>Webpack</li>
				<li>TypeScript</li>
				<li>howler.js</li>
				<li>Soundtracks from Neverhood</li>
				<li>A lot of bugs...</li>
			</ul>
		</div>
	</div>
);

export default About;
