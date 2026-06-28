// src/shared/lib/logger.ts
export const Logger = {
  info: (message: string, ...args: any[]) => {
    if (__DEV__) {
      console.log(`[INFO] ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: any[]) => {
    if (__DEV__) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },
  error: (message: string, error?: unknown) => {
    // 실제 환경에서는 Sentry 등 에러 트래킹 서비스로 전송 가능
    console.error(`[ERROR] ${message}`, error);
  },
};
