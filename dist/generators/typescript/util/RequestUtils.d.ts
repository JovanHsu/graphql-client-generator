/**
 * 请求工具类
 * 提供处理请求的辅助方法
 */
export declare class RequestUtils {
    /**
     * 生成带重试和超时的请求代码
     * @param methodName 方法名
     * @param requestCode 请求代码
     * @param returnType 返回类型
     * @param isSubscription 是否是订阅
     * @returns 生成的代码
     */
    static generateRequestWithRetryAndTimeout(methodName: string, requestCode: string, returnType: string, isSubscription: boolean): string;
}
