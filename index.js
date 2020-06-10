//region importations
const math = require('mathjs');
//endregion

/**
 *
 * @type {{PERMILLE: number, PERCENT: number, PERMYRIAD: number}}
 */
const types = {
  PERCENT: 100,
  PERMILLE: 1000,
  PERMYRIAD: 10000,
}

/**
 *
 */
const percentageFormat = (value, type) => {
  return `${value / (type / 100)}%`;
}

/**
 *
 * @param wins
 * @param matches
 * @param type
 * @returns {{current: *, current_percentage: string, wins_next: number}}
 */
const calcNext = (wins, matches, type) => {
  const current = math.floor(wins * type / matches);
  const nexts = [];

  for (let nextRate = current + 1; nextRate <= type - 1; nextRate++) {
    let winsNext = math.ceil((matches * nextRate - type * wins) / (type - nextRate));

    if (winsNext < 1) {
      winsNext = 1;
    }

    nexts.push({
      rate: percentageFormat(nextRate, type),
      wins: winsNext,
    });
  }

  return {
    current: current,
    current_percentage: percentageFormat(current, type),
    next_rates: nexts
  }
}

/**
 *
 * @param wins
 * @param matches
 */
const calc = (wins, matches) => {
  const result = {};

  for (let [key, value] of Object.entries(types)) {
    result[key] = calcNext(wins, matches, value);
  }

  return result;
}

/**
 *
 * @param params
 */
const winningRateCalc = (params) => {
  params = params || {};
  params.wins = Number(params['wins'] || '0');
  params.loses = Number(params['loses'] || '0');
  params.matches = Number(params['matches'] || '0');
  params.ties = Number(params['ties'] || '0');

  if (params.matches <= 0) {
    return {
      current: 0,
      current_percentage: percentageFormat(0, types.PERCENT),
      next_rates: []
    };
  }

  return calc(params.wins, params.matches);
}

module.exports = winningRateCalc;