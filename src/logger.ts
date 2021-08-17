import { 
  blue,
  green,
  red, 
  yellow 
} from 'chalk';

const { log } = console;

export const logger = {
  success: (message?: string) => log(green(message)),
  info: (message?: string) => log(blue(message)),
  warning: (message?: string) => log(yellow(message)),
  error: (message?: string) => log(red(message)),
};