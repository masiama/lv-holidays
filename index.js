import fetch from 'node-fetch';
import HTMLParser from 'node-html-parser';

const MONTHS = ['Janvaris', 'Februaris', 'Marts', 'Aprilis', 'Maijs', 'Junijs', 'Julijs', 'Augusts', 'Septembris', 'Oktobris', 'Novembris', 'Decembris'];

const isHoliday = async date => {
	const response = await fetch(`https://xn--kalendrs-m7a.lv/${MONTHS[date.getMonth()]}-${date.getFullYear()}`);
	const body = await response.text();
	const document = HTMLParser.parse(body);
	const dayItem = document.querySelectorAll('.item')[date.getDate() - 1];
	return dayItem.querySelector('.dt').classList.contains('dt-hd');
}

(async () => {
	const dateStr = new Date();
	const ih = await isHoliday(dateStr);
	console.log(`${dateStr} - ${ih ? 'is' : 'not'} holiday`);
})();
