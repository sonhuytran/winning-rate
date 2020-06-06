//region importations
const chalk = require('chalk');
const winston = require('winston');
const math = require('mathjs');
const logger = require('./logger');
//endregion

// const logger = winston.createLogger({
//     level: 'info',
//     format: winston.format.json(),
//     defaultMeta: {service: 'user-service'},
//     transports: [
//         new winston.transports.Console(),
//         new winston.transports.File({filename: 'error.log', level: 'error'}),
//         new winston.transports.File({filename: 'combined.log'})
//     ]
// });

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
// if (process.env.NODE_ENV !== 'production') {
//     logger.add(new winston.transports.Console({
//         format: winston.format.simple()
//     }));
// }


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
  const current = math.round(wins * type / matches);
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

  if (params.matches < 0) {
    // TODO
    return {};
  }

  return calc(params.wins, params.matches);
}

module.exports = winningRateCalc;

const args = process.argv.slice(2);

if (args.length >= 2) {
  const params = {
    matches: Number(args[0]),
    wins: Number(args[1]),
  }
  // console.info(chalk.redBright('params = '), chalk.red(JSON.stringify(params)));
  logger.info(params);

  const result = winningRateCalc(params);
  // console.info(chalk.greenBright(JSON.stringify(result)));
  logger.info(result);
}