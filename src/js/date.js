import date from 'date-and-time';
import fr from 'date-and-time/locale/fr';

/**
 * Formate une date pour l'affichage.
 * 
 * Formatage retournée : 4 oct. 2023
 * 
 * @param {string|Date} val Une date au format YYYY-MM-DD HH:II:SS
 * 
 * @returns {string}
 */
export function getDisplayFormatedDate(val) {
    let d = val instanceof Date ? val : getDateFromSQL(val);
    date.locale(fr);
    return date.format(d, 'D MMM YYYY');
}

/**
 * Retourne un objet Date depuis une date SQL
 * 
 * @param {string} val Une date au format SQL
 * 
 * @returns {Date}
 */
export function getDateFromSQL(val) {
    val = val ? val.replace(' ', 'T') : null;
    return new Date(val);
}


Date.prototype.getYearDay = function() { //1 - 366
	var year  = this.getFullYear();
	var month = this.getMonth();
	var day   = this.getDate();
	
	var offset = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
	
	//l'année bissextile n'est utile qu'à partir de mars
	var bissextile = (month < 2) ? 0 : (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0));
	
    return parseInt(day + offset[month] + bissextile);
};

Date.prototype.getMonday = function() {
	var offset = (this.getDay() + 6) % 7;
	return new Date(this.getFullYear(), this.getMonth(), this.getDate()-offset);
};

Date.prototype.getWeek = function() { //1 - 53
	var year = this.getFullYear();
	var week;
	
	//dernier lundi de l'année
	var lastMonday = new Date(year, 11, 31).getMonday();
	
	//la date est dans la dernière semaine de l'année
	//mais cette semaine fait partie de l'année suivante
	if(this >= lastMonday && lastMonday.getDate() > 28) {
		week = 1;
	} else {
		//premier lundi de l'année
		var firstMonday = new Date(year, 0, 1).getMonday();
		
		//correction si nécessaire (le lundi se situe l'année précédente)
		if(firstMonday.getFullYear() < year) firstMonday = new Date(year, 0, 8).getMonday();
		
		//nombre de jours écoulés depuis le premier lundi
		var days = this.getYearDay() - firstMonday.getYearDay();
		
		//window.alert(days);
		
		//si le nombre de jours est négatif on va chercher
		//la dernière semaine de l'année précédente (52 ou 53)
		if(days < 0) {
			week = new Date(year, this.getMonth(), this.getDate()+days).getWeek();
		}
		else {
			//numéro de la semaine
			week = 1 + parseInt(days / 7);
			
			//on ajoute une semaine si la première semaine
			//de l'année ne fait pas partie de l'année précédente
			week += (new Date(year-1, 11, 31).getMonday().getDate() > 28);
		}
	}
	
	return parseInt(week);
};

var pad = function(num) { return ('00'+num).slice(-2) };
Date.prototype.getSqlDate = function(time) {

	var t = typeof time === 'undefined' ? false:true;

	let date = this.getFullYear()         + '-' +
	pad(this.getMonth() + 1)  + '-' +
	pad(this.getDate());
	
	if (t) {
		date += ' '+
			pad(this.getHours())      + ':' +
			pad(this.getMinutes())    + ':' +
			pad(this.getSeconds());
	}

	return date;
};

Date.dayFrDict = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];
Date.monthFrDict = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

Date.listDays = function(dateStart, dateEnd) {
	let days = [];
	
	if (dateEnd) {
		let start = dateStart;
		let end = dateEnd;

		let diff_time = end.getTime() - start.getTime();
		let diff_days = Math.round(diff_time / (1000 * 3600* 24));

		for (let index = 0; index <= diff_days; index++) {
			let current = new Date(start);
			current.setDate(start.getDate() + index);

			days.push(current);
		}
	}

	return days;
};

Date.listWeeks = function(dateStart, dateEnd) {
	let weeks = [];

	let days = Date.listDays(dateStart, dateEnd);

	let n = 0;
	let start = null;
	let last = null;

	days.forEach((day) => {

		n += 1;

		if (!start) {
			start = day;
		}

		if (day.getDay() === 0 && last) {

			weeks.push({
				n,
				start,
				week: start.getWeek()
			});

			start = null;
			n = 0;
		}

		last = day;
	});

	if (start) {
		weeks.push({
			n,
			start,
			week: start.getWeek()
		});
	}

	return weeks;
};

Date.listMonths = function(dateStart, dateEnd) {
	let months = [];

	let days = Date.listDays(dateStart, dateEnd);

	let n = 0;
	let start = null;
	let last = null;

	days.forEach((day) => {
		if (!start) {
			start = day;
		}

		if (day.getDate() === 1 && last) {
			months.push({
				n,
				start,
				month: Date.monthFrDict[start.getMonth()]
			});

			n = 0;
			start = null;
		}

		last = day;

		n += 1;
	});

	if (start) {
		months.push({
			n,
			start,
			month: Date.monthFrDict[start.getMonth()]
		});
	}

	return months;
};