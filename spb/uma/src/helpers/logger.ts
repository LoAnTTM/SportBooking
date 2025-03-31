type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'RESET' | 'DEBUG';

const colors: { [key in LogLevel]: string } = {
  INFO: '\x1b[32m', // Green
  WARN: '\x1b[33m', // Yellow
  ERROR: '\x1b[31m', // Red
  RESET: '\x1b[0m', // Reset
  DEBUG: '\x1b[34m', // Blue
};

const log = (level: LogLevel, message: string) => {
  const timestamp = new Date().toISOString();
  const color = colors[level] || colors.RESET;
  console.log(`[${timestamp}] ${color}${level}${colors.RESET}: ${message}`);
};

export const logInfo = (infoOrMessage: object | string) => {
  const message =
    typeof infoOrMessage === 'object'
      ? JSON.stringify(infoOrMessage, null, 2)
      : infoOrMessage;
  log('INFO', message);
};

export const logWarn = (message: string) => {
  log('WARN', message);
};

export const logError = (errorOrMessage: Error | string) => {
  const message =
    errorOrMessage instanceof Error
      ? `${errorOrMessage.message}\n${errorOrMessage.stack}`
      : errorOrMessage;
  log('ERROR', message);
};

export const logDebug = (debugInfo: object | string | Error) => {
  let message: string;
  if (debugInfo instanceof Error) {
    message = `${debugInfo.message}\n${debugInfo.stack}`;
  } else if (typeof debugInfo === 'object') {
    message = JSON.stringify(debugInfo, null, 2);
  } else {
    message = debugInfo;
  }
  log('DEBUG', message);
};
