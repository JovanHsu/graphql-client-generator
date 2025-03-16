/**
 * 带重试功能的函数包装器
 * @param fn 要执行的异步函数
 * @param options 重试选项
 * @returns 包装后的异步函数
 */
export function withRetry<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  options: {
    maxRetries?: number;
    retryDelay?: number;
    shouldRetry?: (error: any) => boolean;
  } = {}
): (...args: Args) => Promise<T> {
  const {
    maxRetries = 3,
    retryDelay = 300,
    shouldRetry = (error) => true
  } = options;

  return async (...args: Args): Promise<T> => {
    let lastError: any;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = error;
        
        if (attempt >= maxRetries || !shouldRetry(error)) {
          throw error;
        }
        
        // 指数退避策略
        const delay = retryDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  };
}

/**
 * 带超时功能的函数包装器
 * @param fn 要执行的异步函数
 * @param timeoutMs 超时时间（毫秒）
 * @returns 包装后的异步函数
 */
export function withTimeout<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  timeoutMs: number = 30000
): (...args: Args) => Promise<T> {
  return async (...args: Args): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Operation timed out after ${timeoutMs}ms`));
      }, timeoutMs);
      
      fn(...args)
        .then(result => {
          clearTimeout(timeoutId);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  };
}

/**
 * 使用重试和超时包装请求
 * @param client GraphQL客户端
 * @param options 客户端选项
 * @param requestFn 请求函数
 * @returns 包装后的请求结果
 */
export function withRetryAndTimeout<T>(
  requestFn: () => Promise<T>,
  options: {
    maxRetries?: number;
    retryDelay?: number;
    timeout?: number;
  }
): Promise<T> {
  const {
    maxRetries = 3,
    retryDelay = 300,
    timeout = 30000
  } = options;
  
  return withTimeout(
    withRetry(
      requestFn,
      {
        maxRetries,
        retryDelay
      }
    ),
    timeout
  )();
}