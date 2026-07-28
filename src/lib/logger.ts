const isDebug = process.env.DEBUG === 'true' || process.env.NODE_ENV === 'development';

export const log = {
  info: (...args: any[]) => {
    if (isDebug) console.log(...args);
  },
  warn: (...args: any[]) => {
    if (isDebug) console.warn(...args);
  },
  error: (...args: any[]) => {
    console.error(...args);
  },
};
