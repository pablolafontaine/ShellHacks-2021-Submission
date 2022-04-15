/* eslint-disable no-param-reassign */
import { LineChart } from 'react-native-chart-kit';
import React, { useState } from 'react';
import { IndexPath, Text, Select, SelectItem } from '@ui-kitten/components';
import { Dimensions } from 'react-native';
import axios from 'axios';

const calculateSMA = (data, period) => {
	let sum = 0;
	for (let i = 0; i < period - 1; i += 1) {
		sum += data[i];
	}
	const SMA = sum / period;
	return SMA;
};
const calculateEMA = (data, period) => {
	const smoothingMult = 2 / (1 + period);
	// first item is just the same as the first item in the input
	let EMAarr = [calculateSMA(data.slice(period, data.length), period)];
	// for the rest of the items, they are computed with the previous one
	data = data.slice(0, period - 1);
	data = data.reverse();
	for (let i = 1; i < period; i += 1) {
		EMAarr.push(data[i] * smoothingMult + EMAarr[i - 1] * (1 - smoothingMult));
	}
	EMAarr.pop();
	EMAarr = EMAarr.reverse();
	const EMAToday = EMAarr[0];
	return EMAToday;
};
const calculateMACD = (data) => {
	const macd = calculateEMA(data, 12) - calculateEMA(data, 26);
	return macd;
};

const calculateRSI = (data) => {
	let posSum = 0;
	let negSum = 0;
	data.forEach((el) => {
		if (el < 0) {
			negSum += Math.abs(el);
		} else {
			posSum += el;
		}
	});
	const avgU = posSum / data.length;
	const avgD = negSum / data.length;
	const RS = avgU / avgD;
	const RSI = 100 - 100 / (1 + RS);

	return RSI;
};

const generateMacdDataPoints = (data, daysToGraph) => {
	const dataPoints = [];
	if (data) {
		for (let i = 0; i < daysToGraph; i += 1) {
			dataPoints[i] = calculateMACD(data);
			data.shift();
		}
	}
	return dataPoints;
};

const generateRsiDataPoints = (data, daysToGraph) => {
	let subArr = [];
	const arr = [];
	for (let i = 0; i < daysToGraph; i += 1) {
		for (let j = i; j < i + daysToGraph; j += 1) {
			subArr.push(data[j]);
		}
		arr[i] = subArr.reverse();
		subArr = [];
	}
	const dataPoints = [];
	arr.forEach((sarr) => {
		dataPoints.push(calculateRSI(sarr));
	});

	return dataPoints.reverse();
};

const generatePercentChanges = (closingPricesArr) => {
	const finalPercentsArr = [];
	if (closingPricesArr) {
		finalPercentsArr[0] = 0.0;
		for (let i = 1; i < closingPricesArr.length - 2; i += 1) {
			finalPercentsArr[i] =
				(closingPricesArr[i + 1] - closingPricesArr[i]) / closingPricesArr[i + 1];
		}
	}
	return finalPercentsArr;
};

const makeDate = (numDays) => {
	const dateArray = [];
	for (let i = numDays - 1; i >= 0; i -= 1) {
		let today = new Date();
		const dd = String(today.getDate() - i).padStart(2, '0');
		const mm = String(today.getMonth() + 1).padStart(2, '0');
		today = `${mm}/${dd}`;
		dateArray.push(today);
	}
	return dateArray;
};

const fetchURL = (curr_pair, numDays) => {
	const today = new Date();
	const searchBackToDate = `${String(today.getFullYear())}-${String(today.getMonth() + 1).padStart(
		2,
		'0'
	)}-${String(today.getDate() - numDays).padStart(2, '0')}`;
	const fullURL = `https://staging.coinroutes.io/api/streaming/ohlc/?interval=h&product=${curr_pair}&start_time=${searchBackToDate}T16:51:09.503Z&end_time=2021-09-25T17:51:09.503Z&size=0&exchanges=gdax&format=csv`;
	return fullURL;
};

const Charts = () => {
	const oldArray = [
		1.1, 1.3, -2.1, 1.4, -2.2, 1.2, -1.1, 3.4, 2.1, 1.5, -2.9, 1.6, -4.1, 2.8, 2.1, 1.5, -1.7, 4.2,
		-6.4, 2.3, 0.1, -0.4, 3.4, -1.2, 1.3, 2.6, -3.4, -4.5, -5.6, 3.2, 1.1, 1.3, -2.1, 1.4, -2.2,
		1.2, -1.1, 3.4, 2.1, 1.5, -2.9, 1.6, -4.1, 2.8, 2.1, 1.5, -1.7, 4.2, -6.4, 2.3, 0.1, -0.4, 3.4,
		-1.2, 1.3, 2.6, -3.4, -4.5, -5.6, 3.2
	];
	const closingPrices = {
		'KIN-USD': [
			0.00007854, 0.00008093, 0.00008508, 0.00008103, 0.00007024, 0.00008149, 0.0001007, 0.0001012,
			0.0001002, 0.000109, 0.0001058, 0.0000979, 0.00009686, 0.0001093, 0.0001062, 0.0001066,
			0.0001162, 0.000115, 0.000109, 0.0001347, 0.0001184, 0.0001066, 0.0001141, 0.0001082,
			0.0001094, 0.0001106, 0.0001121, 0.0001279, 0.0001343, 0.0001411, 0.0001188, 0.0001384,
			0.0001495, 0.0001714, 0.0001591, 0.000172, 0.0001869, 0.0001822, 0.000184, 0.0001621,
			0.0001282, 0.0001131, 0.0001125, 0.0001168, 0.00009481, 0.0001081, 0.00008484, 0.00006724,
			0.00005654, 0.00005717, 0.0000531, 0.00005499, 0.0000523, 0.00005587, 0.00005994, 0.00004855,
			0.000045, 0.00004952, 0.00004146, 0.00004866, 0.00005001, 0.00004834, 0.00005169, 0.00004891,
			0.00004747, 0.00004799, 0.00004753, 0.00004133, 0.00004503, 0.00004973, 0.00004881,
			0.00005062, 0.00005144, 0.000053, 0.00005412, 0.00005168, 0.00005365, 0.00005267, 0.00005487,
			0.00005171, 0.00005725, 0.00005026, 0.0000447, 0.00004895, 0.00004726, 0.00004538, 0.00004607,
			0.00005097, 0.00004751, 0.00004329, 0.00004425, 0.00003775, 0.00003904
		],

		'QTUM-EUR': [
			7.9759, 8.3084, 8.4967, 9.3432, 9.2352, 7.9518, 8.8186, 10.3816, 10.7127, 10.6623, 10.7988,
			11.0417, 10.8898, 10.6003, 11.3679, 10.8444, 10.8204, 11.2945, 10.5313, 10.5474, 13.1707,
			13.5655, 11.8992, 11.445, 11.1745, 11.1835, 10.5358, 10.3362, 10.984, 10.6812, 10.8929,
			10.0562, 10.9854, 10.7823, 11.7866, 11.602, 11.6616, 12.0897, 11.3946, 11.0893, 10.6073,
			11.3113, 11.6903, 11.9715, 11.8602, 8.7791, 9.2154, 9.0773, 9.1944, 8.6952, 9.2607, 7.4128,
			6.8777, 6.7568, 6.5498, 6.7204, 6.1907, 6.7524, 6.0847, 5.686, 5.5818, 5.5073, 5.3627, 5.2735,
			5.1884, 4.9915, 4.7648, 4.5555, 4.2377, 4.5039, 4.8137, 4.7176, 4.6977, 5.0039, 5.242, 5.2748,
			5.5415, 5.6418, 5.592, 5.7019, 5.4922, 5.9893, 6.0661, 5.8674, 6.2351, 6.1046, 5.9615, 6.0037,
			6.4778, 6.3299, 5.2875, 5.1498, 4.8737, 4.6384
		],

		'BTG-ETH': [
			0.018403, 0.018278, 0.018017, 0.018121, 0.018295, 0.018635, 0.018659, 0.019462, 0.019473,
			0.019405, 0.019151, 0.019088, 0.019513, 0.019727, 0.019651, 0.020133, 0.020502, 0.020285,
			0.019777, 0.020268, 0.021154, 0.021287, 0.021396, 0.021575, 0.021182, 0.020369, 0.022255,
			0.024231, 0.024123, 0.023867, 0.021262, 0.020451, 0.021366, 0.021136, 0.021751, 0.022119,
			0.0227, 0.022364, 0.020028, 0.020213, 0.020533, 0.02116, 0.021361, 0.019563, 0.018837,
			0.019172, 0.019, 0.018824, 0.018767, 0.018696, 0.018743, 0.019422, 0.019487, 0.020023,
			0.021379, 0.021001, 0.019654, 0.020483, 0.021261, 0.019704, 0.020447, 0.020511, 0.019762,
			0.019814, 0.019663, 0.019063, 0.018999, 0.019103, 0.019726, 0.020932, 0.020531, 0.020089,
			0.020098, 0.021244, 0.021735, 0.02191, 0.021458, 0.020962, 0.020936, 0.021324, 0.021563,
			0.02055, 0.02085, 0.020859, 0.020892, 0.021515, 0.021834, 0.022653, 0.022299, 0.022157,
			0.020381, 0.020638, 0.020989, 0.021221
		],

		'KICK-BTC': [
			0.000000191462, 0.000000192289, 0.000000196708, 0.000000193236, 0.000000197182,
			0.000000195106, 0.000000193036, 0.000000217631, 0.000000215628, 0.000000218249, 0.00000022656,
			0.000000230146, 0.000000240466, 0.00000024788, 0.000000253915, 0.000000251624, 0.000000264436,
			0.000000249451, 0.000000218961, 0.000000240802, 0.000000248297, 0.000000279618,
			0.000000277381, 0.000000285521, 0.000000302013, 0.000000319353, 0.000000320903,
			0.000000306166, 0.000000303389, 0.000000315147, 0.00000031227, 0.000000311151, 0.000000292187,
			0.000000307056, 0.00000028435, 0.000000290703, 0.000000309905, 0.000000308026, 0.000000307738,
			0.000000334672, 0.000000349855, 0.000000361659, 0.000000392663, 0.000000384083,
			0.000000353556, 0.000000422305, 0.000000371179, 0.000000313143, 0.00000028677, 0.000000273231,
			0.000000265677, 0.000000277066, 0.000000282714, 0.000000279442, 0.000000291964,
			0.000000265973, 0.000000255116, 0.000000235664, 0.000000250477, 0.000000229007,
			0.000000261276, 0.000000298225, 0.000000315013, 0.000000331094, 0.000000353622, 0.00000032803,
			0.000000331056, 0.000000363336, 0.000000358138, 0.000000367062, 0.000000376453,
			0.000000394634, 0.000000436577, 0.000000449962, 0.000000457416, 0.000000468971,
			0.000000460189, 0.000000503064, 0.000000458985, 0.000000525823, 0.000000549917,
			0.000000557269, 0.000000536699, 0.000000556107, 0.000000587144, 0.000000599564,
			0.000000005562, 0.000000004738, 0.000000005772, 0.000000006021
		],

		'SALT-BTC': [
			0.00000525, 0.000005, 0.000005, 0.000005, 0.000006, 0.000005, 0.000005, 0.000005, 0.000006,
			0.000007, 0.000007, 0.000007, 0.000007, 0.000007, 0.000007, 0.000007, 0.000006, 0.000005,
			0.000006, 0.000005, 0.000006, 0.000006, 0.000006, 0.000006, 0.000006, 0.000008, 0.000006,
			0.000005, 0.000006, 0.000005, 0.000005, 0.000005, 0.000005, 0.000005, 0.000005, 0.000005,
			0.000005, 0.000005, 0.000005, 0.000006, 0.000005, 0.000006, 0.000005, 0.000005, 0.000005,
			0.000005, 0.000006, 0.000006, 0.000006, 0.000006, 0.000006, 0.000006, 0.000006, 0.000006,
			0.000006, 0.000006, 0.000005, 0.000005, 0.000005, 0.000005, 0.000005, 0.000005, 0.000005,
			0.000005, 0.000005, 0.000006, 0.000006, 0.000006, 0.000006, 0.000006, 0.000006, 0.000006,
			0.000006, 0.000006, 0.000006, 0.000006, 0.000006, 0.000006, 0.000006, 0.000006, 0.000006,
			0.000007, 0.000007, 0.000005, 0.000006, 0.000005, 0.000005, 0.000004, 0.000004, 0.000004,
			0.000004, 0.000004, 0.000004, 0.000004, 0.021221
		]
	};

	const state = 0;
	const determineState = () => {};

	const possibleDaysToGraph = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]; // CHANGE GRAPHS HERE

	const [daysToGraph, setDaysToGraph] = useState(possibleDaysToGraph[5]);
	const dateArr = makeDate(daysToGraph);
	const [selectedIndex, setSelectedIndex] = useState(new IndexPath(5));
	const [currencyPairs, setCurrencyPairs] = useState([{ slug: 'Default' }]);
	const [selectedIndex2, setSelectedIndex2] = useState(new IndexPath(0));

	axios
		.get('https://staging.coinroutes.com/api/currency_pairs/', {
			headers: {
				Authorization: 'Token 6c634e1eacecc4801b000249287fbf923d5c8824'
			}
		})
		.then((res) => {
			setCurrencyPairs(res.data);
		});

	const [getIndex, setIndex] = useState('BTC-USD'); // getIndex is the response
	axios
		.get(fetchURL(currencyPairs[selectedIndex2.row].slug, 10), {
			headers: {
				Authorization: 'Token 6c634e1eacecc4801b000249287fbf923d5c8824'
			}
		})
		.then((res) => {
			setIndex(res.data);
		});
	console.log(getIndex);
	return (
		<>
			<Select
				selectedIndex={selectedIndex2}
				onSelect={(index) => setSelectedIndex2(index)}
				placeholder={'Default'}
				value={currencyPairs[selectedIndex2.row].slug}
				disabled={!currencyPairs.length}
				style={{ width: '95%' }}
			>
				{currencyPairs.map((currencyPair) => (
					<SelectItem title={currencyPair.slug} />
				))}
			</Select>

			<Text category={'h5'} style={{ marginBottom: 5 }}>
				Adjust period:
			</Text>
			<Select
				selectedIndex={selectedIndex}
				onSelect={(index) => {
					setSelectedIndex(index);
					setDaysToGraph(possibleDaysToGraph[index]);
				}}
				placeholder={'Default'}
				value={possibleDaysToGraph[selectedIndex.row]}
				style={{ width: '95%' }}
			>
				{possibleDaysToGraph.map((el) => (
					<SelectItem title={el} />
				))}
			</Select>
			<Text category={'h3'} style={{ marginBottom: 5 }}>
				Relative Strength Index
			</Text>
			<LineChart
				data={{
					labels: dateArr,
					datasets: [
						{
							data: generateRsiDataPoints(
								generatePercentChanges(closingPrices[currencyPairs[selectedIndex2.row].slug]),
								daysToGraph
							)
						}
					]
				}}
				width={Dimensions.get('window').width / 2} // from react-native
				height={Dimensions.get('window').height / 2}
				yAxisInterval={1} // optional, defaults to 1
				chartConfig={{
					// backgroundColor: "#e3ebff",
					backgroundGradientFrom: '#3468eb',
					backgroundGradientTo: '#349eeb',

					decimalPlaces: 2, // optional, defaults to 2dp
					color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
					labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
					style: {
						borderRadius: 16
					},
					propsForDots: {
						r: '6',
						strokeWidth: '2',
						stroke: '#306ae6'
					}
				}}
				bezier
				style={{
					marginVertical: 8,
					borderRadius: 16
				}}
			/>

			<Text category={'h3'} style={{ marginBottom: 5 }}>
				Moving Average Convergence Divergence (MACD)
			</Text>
			<LineChart
				data={{
					labels: dateArr,
					datasets: [
						{
							data: generateMacdDataPoints(
								closingPrices[currencyPairs[selectedIndex2.row].slug],
								daysToGraph
							)
						}
					]
				}}
				width={Dimensions.get('window').width / 2} // from react-native
				height={Dimensions.get('window').height / 2}
				yAxisInterval={1} // optional, defaults to 1
				chartConfig={{
					// backgroundColor: "#e3ebff",
					backgroundGradientFrom: '#3468eb',
					backgroundGradientTo: '#349eeb',

					decimalPlaces: 2, // optional, defaults to 2dp
					color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
					labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
					style: {
						borderRadius: 16
					},
					propsForDots: {
						r: '6',
						strokeWidth: '2',
						stroke: '#306ae6'
					}
				}}
				bezier
				style={{
					marginVertical: 8,
					borderRadius: 16
				}}
			/>
		</>
	);
};

export default Charts;
