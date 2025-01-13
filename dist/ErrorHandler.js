"use strict";
// ErrorHandler.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = exports.ApiError = void 0;
class ApiError extends Error {
    constructor(message, cause) {
        super(message);
        this.name = 'ApiError';
        this.cause = cause;
    }
}
exports.ApiError = ApiError;
class ErrorHandler {
    static handleApiError(response, action) {
        if (!response || response.resultCode !== 0) {
            const message = `Error in API action "${action}": ${(response === null || response === void 0 ? void 0 : response.resultMessage) || 'Unknown API error'}`;
            const error = new ApiError(message, {
                resultCode: response === null || response === void 0 ? void 0 : response.resultCode,
                receivedData: response,
                requestTime: new Date(),
            });
            throw error;
        }
        else {
            return response;
        }
    }
    static handleHttpError(error) {
        console.error('HTTP error:', error);
        throw new Error(`HTTP request failed: ${error.message}`);
    }
}
exports.ErrorHandler = ErrorHandler;
