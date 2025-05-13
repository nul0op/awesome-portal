import config from '../knexfile.js';
import knexjs from 'knex';

const awesomedb = knexjs(config);

export default awesomedb;