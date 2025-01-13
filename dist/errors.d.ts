/**
 * Represents a collection of custom error definitions and a utility method
 * for retrieving structured error details based on an error message.
 */
declare class CustomErrors {
    /**
     * A map of predefined errors, keyed by their result messages, providing
     * additional details such as result codes and detailed error descriptions.
     */
    private static errors;
    /**
     * Retrieves a structured error object based on a given result message.
     *
     * @param resultMessage - The error message to look up.
     * @returns An object containing the error details, including result codes,
     *          detailed messages, and additional metadata. If the error is not
     *          found, a default "unknown error" response is returned.
     *
     * @example
     * ```typescript
     * const error = CustomErrors.getError("game not found");
     * console.log(error);
     * // {
     * //   resultCode: -1,
     * //   resultMessage: "game not found",
     * //   resultMessageLarge: "The provided game ID was not found. Have you entered the proper client configuration?",
     * //   result: null,
     * //   version: "4831_live"
     * // }
     * ```
     */
    static getError(resultMessage: string): {
        resultCode: number;
        resultMessage: string;
        resultMessageLarge: string;
        result: any;
        version: string;
    } | null;
}

export { CustomErrors as default };
