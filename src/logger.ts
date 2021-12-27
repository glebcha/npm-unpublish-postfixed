import { 
  blue,
  green,
  red, 
  yellow 
} from 'colorette';

const { log } = console;

export const logger = {
  success: (message = '') => log(green(message)),
  info: (message = '') => log(blue(message)),
  warning: (message = '') => log(yellow(message)),
  error: (message = '') => log(red(message)),
};