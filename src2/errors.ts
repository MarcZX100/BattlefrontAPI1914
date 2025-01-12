class CustomErrors {
    private static errors: { [key: string]: { resultCode: number; resultMessageLarge: string; result: any; } } = {
        "game not found": {
            resultCode: -1,
            resultMessageLarge: "The provided game ID was not found. Have you entered the proper client configuration?",
            result: null
        },
        "user not found": {
            resultCode: -1,
            resultMessageLarge: "The provided user ID was not found. Have you entered the proper client configuration?",
            result: null
        }
    };

    static getError(resultMessage: string): { resultCode: number; resultMessage: string; resultMessageLarge: string; result: any; version: string } | null {
        const error = this.errors[resultMessage];
        return {
            resultCode: error ? error.resultCode : -1,
            resultMessage,
            resultMessageLarge: error ? error.resultMessageLarge : "Unknown error",
            result: error ? error.result : null,
            version: "4831_live" // what for really?
        };
    }
}

export default CustomErrors;
