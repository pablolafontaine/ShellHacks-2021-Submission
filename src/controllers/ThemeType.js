import AsyncStorage from '@react-native-async-storage/async-storage';
import Cookies from 'js-cookie';

export default () => Cookies.get('theme');

export const toggleThemeType = async () => {
	if (!Cookies.get('theme') || Cookies.get('theme') === 'dark') {
		Cookies.set('theme', 'light');
	} else {
		Cookies.set('theme', 'dark');
	}
};
