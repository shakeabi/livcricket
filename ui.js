'use strict';
const React = require('react');
const { useEffect, useState } = require('react');

const fs = require('fs');
const parser = require('xml-parser');
const { parse } = require('node-html-parser');
const execa = require('execa');

const { Text, Color, Box, Static } = require('ink');
const Gradient = require('ink-gradient');
const BigText = require('ink-big-text');
const InkBox = require('ink-box');
const SelectInput = require('ink-select-input').default;
const Spinner = require('ink-spinner').default;
const TextInput = require('ink-text-input').default;

const PropTypes = require('prop-types');
const inspect = require('util').inspect;

const settings = require('./settings.json');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const App = ({ mode }) => {
	const rss_feed = 'http://static.cricinfo.com/rss/livescores.xml';

	const [loading, setLoading] = useState(true);
	const [matchItems, setMatchItems] = useState([]);
	const [matchSelected, setMatchSelected] = useState(false);
	const [scoreSummary, setScoreSummary] = useState({ score: '', status: '' });

	useEffect(() => {
		(async () => {
			const fetchRss = await execa('curl', ['-k', '-L', '-s', rss_feed]);
			const xml = parser(fetchRss.stdout);
			const rawMatches = xml.root.children[0].children.filter(ele => {
				if (ele.name == 'item') return true;
			});

			const matches = rawMatches.map((ele, idx) => {
				const title = ele.children.filter(subEle => {
					return subEle.name == 'title';
				})[0].content;
				const rssLink = ele.children.filter(subEle => {
					return subEle.name == 'link';
				})[0].content;

				const link = ele.children.filter(subEle => {
					return subEle.name == 'guid';
				})[0].content;

				return {
					label: title,
					value: rssLink,
					link,
				};
			});
			await setMatchItems(matches);
			setLoading(false);
			const noOfMatches = matches.length;
		})();
	}, []);

	const handleSelect = async item => {
		await setMatchSelected(true);
		while (true) {
			await setLoading(true);

			const fetchHtml = await execa('curl', ['-k', '-L', '-s', item.value]);
			const root = parse(fetchHtml.stdout);
			let statusText = root.querySelector('.cscore_time').innerHTML;
			statusText = statusText.split(' ')[0];
			let scoreText = root.querySelector('title').rawText;
			scoreText = scoreText.replace(/\)[^]*/, '') + ')';
			if (scoreText.length > settings.maxCharacters) {
				scoreText = scoreText.substr(0, settings.maxCharacters);
				scoreText += '...';
			}

			await setScoreSummary({ score: scoreText, status: statusText });

			if (settings.notifications) {
				try {
					const notif = execa('zenity', [
						'--notification',
						`--text=${scoreText}`,
					]);
					await sleep(500);
					notif.kill();
				} catch (err) {
					console.log(
						"Error: Either your computer does not have zenity or doesn't support --notifications"
					);
				}
			}

			await setLoading(false);
			await sleep(parseInt(settings.refreshTime) * 1000);
		}
	};

	const customSelectItemComponent = item => {
		return <Color green={item.isSelected}>{item.label}</Color>;
	};

	const normalMode = (
		<Box flexDirection={'column'} width={'100%'}>
			<Static>
				<Gradient name={'instagram'}>
					<BigText text="LivCricket" font="chrome" align="center" />
				</Gradient>
			</Static>
			<Box justifyContent="center" width={'100%'} flexDirection={'row'}>
				{loading ? (
					<React.Fragment>
						<Color white>
							<Spinner type="point" />
						</Color>{' '}
						<Color yellow>
							<Text>Fetching</Text>
						</Color>
					</React.Fragment>
				) : (
					<Box>
						<Color green>
							<Text>✔ Fetched!</Text>
						</Color>
						{matchSelected && (
								<Color redBright>
									<Text bold>{`${scoreSummary.status}`}</Text>
								</Color>
						)}
					</Box>
				)}
			</Box>
			{!matchSelected && matchItems.length && (
				<Box flexDirection="column">
					<InkBox borderStyle="round" borderColor="cyan" float="center">
						Number Of Matches: {matchItems.length}
					</InkBox>
					<Box justifyContent="center">
						<Color whiteBright>
							<SelectInput
								items={matchItems}
								itemComponent={customSelectItemComponent}
								onSelect={handleSelect}
							/>
						</Color>
					</Box>
				</Box>
			)}
			{matchSelected && scoreSummary !== '' && (
				<Box flexDirection="column">
					<InkBox borderStyle="round" borderColor="cyan" float="center">
						<Box textWrap={'wrap'}>
							<Color whiteBright>
								<Text>{`${scoreSummary.score}`}</Text>
							</Color>
						</Box>
					</InkBox>
				</Box>
			)}
		</Box>
	);

	const termNotFound = (
		<Box flexDirection={'column'} width={'100%'}>
			<Static>
				<Gradient name={'instagram'}>
					<BigText text="LivCricket" font="chrome" align="center" />
				</Gradient>
			</Static>
			<InkBox borderStyle="round" borderColor="cyan" float="center">
				<Box textWrap={'wrap'}>
					<Text>
						Oops! Sorry command not found! Try 'livcricket --help' for help
					</Text>
				</Box>
			</InkBox>
		</Box>
	);

	if (mode == 'normal') {
		return normalMode;
	} else {
		return termNotFound;
	}
};

App.propTypes = {
	mode: PropTypes.string,
};

App.defaultProps = {
	mode: 'normal',
};

module.exports = App;
