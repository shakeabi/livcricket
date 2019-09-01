#!/usr/bin/env node
'use strict';
const React = require('react');
const importJsx = require('import-jsx');
const {render} = require('ink');
const meow = require('meow');

const ui = importJsx('./ui');

const cli = meow(`
	Usage
	  $ livCriket

	Options
		--version

	Examples
	  $ livCriket --version
		1.0.0
		
	Note:
	-> Checkout the settings.json to look into more features of the app.
	-> You need to have notify-send to enable notifications, try 'notify-send "Hey Sexy!"' to check if you've notify-send.
	-> The refreshtime must be given in seconds.
	-> Maxcharacters can be modified if you've smaller or bigger terminals. It'll be reflected in the score display.
	-> Drop a star if you find this project useful (https://github.com/shakeabi/livcricket)
	
	Other:
	-> Made with lots of love by Abishake (https://github.com/shakeabi)
	-> Thanks to AdarshPatel (https://github.com/adarshPatel509)

`);

render(React.createElement(ui, cli.flags));
