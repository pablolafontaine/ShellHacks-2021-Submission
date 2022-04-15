import React, { useState } from 'react';
import { Layout, Text, Toggle } from '@ui-kitten/components';
import Charts from '../components/Charts';
import ThemeType, { toggleThemeType } from '../controllers/ThemeType';

const Home = () => {
	const [themeType, setLocalThemeType] = useState(ThemeType());
	// const [asks, setAsks] = useState([]);
	// const [bids, setBids] = useState([]);
	// const [prices, setPrices] = useState([]);
	// const [priceTimestamps, setPriceTimestamps] = useState([]);
	// const cbbo = new WebSocket(
	// 	'wss://staging.coinroutes.com/api/streaming/cbbo/?token=6c634e1eacecc4801b000249287fbf923d5c8824',
	// 	[]
	// );
	// cbbo.onopen = () => {
	// 	const requestMessage = {
	// 		currency_pair: currencyPairs[selectedIndex.row].slug,
	// 		size_filter: 0,
	// 		sample: 0.5
	// 	};
	// 	cbbo.send(JSON.stringify(requestMessage));
	// };
	// cbbo.onmessage = (message) => {
	// 	const parsedData = JSON.parse(message.data);
	// 	if (parsedData) {
	// 		setBids(parsedData.bids); // price: '42697.00000000', qty: '0.2982', total_qty: '0.2982'
	// 		setAsks(parsedData.asks); // price: '42697.00000000', qty: '0.2982', total_qty: '0.2982'
	// 	}
	// };
	// const realPrice = new WebSocket(
	// 	'wss://staging.coinroutes.com/api/streaming/real_price/?token=6c634e1eacecc4801b000249287fbf923d5c8824',
	// 	[]
	// );
	// realPrice.onopen = () => {
	// 	const requestMessage = {
	// 		currency_pair: currencyPairs[selectedIndex.row].slug,
	// 		quantity: 1
	// 	};
	// 	realPrice.send(JSON.stringify(requestMessage));
	// };
	// realPrice.onmessage = (message) => {
	// 	const parsedPrice = JSON.parse(message.data);
	// 	if (parsedPrice) {
	// 		prices.push(parsedPrice.price);
	// 		setPrices(prices);
	// 		priceTimestamps.push(parsedPrice.generated_timestamp);
	// 		setPriceTimestamps(parsedPrice.generated_timestamp);
	// 	}
	// };

	return (
		<Layout
			level={'1'}
			style={{
				flex: 1,
				alignItems: 'center',
				minHeight: 128,
				justifyContent: 'flex-start'
			}}
		>
			<Toggle
				checked={themeType === 'light'}
				style={{ marginBottom: 5, marginTop: 5 }}
				onChange={() => {
					toggleThemeType(themeType);
					window.location.reload();
				}}
			>
				Switch theme
			</Toggle>
			<Text category={'h3'} style={{ marginBottom: 5 }}>
				Select currency pair:
			</Text>

			<Charts />
		</Layout>
	);
};

export default Home;
