const request = require('request-promise');
const whacko = require('whacko');
const MONTHS = ['Janvaris', 'Februaris', 'Marts', 'Aprilis', 'Maijs', 'Junijs', 'Julijs', 'Augusts', 'Septembris', 'Oktobris', 'Novembris', 'Decembris'];

const isHoliday = async date => {
	const jsDate = new Date(date);
	const body = await request(`https://xn--kalendrs-m7a.lv/${MONTHS[jsDate.getMonth()]}-${jsDate.getFullYear()}`);
	const $ = whacko.load(body);
	const dayItem = $($($('.item')[jsDate.getDate() - 1]).find('.dt'));
	return dayItem.hasClass('dt-hd');
}

const dateStr = '2018-04-30';
const ih = isHoliday(dateStr);
console.log(`${dateStr} - ${ih ? 'is' : 'not'} holiday`);