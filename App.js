import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import ThemeType from './src/controllers/ThemeType';
import Home from './src/pages/Home';

const App = () => (
	<ApplicationProvider {...eva} theme={ThemeType() === 'light' ? eva.light : eva.dark}>
		<Home />
	</ApplicationProvider>
);

export default App;
