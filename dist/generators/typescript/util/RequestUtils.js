"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestUtils = void 0;
/**
 * 请求工具类
 * 提供处理请求的辅助方法
 */
class RequestUtils {
    /**
     * 生成带重试和超时的请求代码
     * @param methodName 方法名
     * @param requestCode 请求代码
     * @param returnType 返回类型
     * @param isSubscription 是否是订阅
     * @returns 生成的代码
     */
    static generateRequestWithRetryAndTimeout(methodName, requestCode, returnType, isSubscription) {
        const functionName = isSubscription ? 'subscribe' : 'request';
        return `
    const ${functionName} = async () => {
      ${requestCode}
    };
    
    // 应用超时和重试
    const withOptions = withTimeout(
      withRetry(
        ${functionName}, 
        { 
          maxRetries: this.options.maxRetries, 
          retryDelay: this.options.retryDelay 
        }
      ), 
      this.options.timeout
    );
    
    return withOptions();`;
    }
}
exports.RequestUtils = RequestUtils;
