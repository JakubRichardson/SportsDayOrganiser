class AppError extends Error {
    constructor(text, code) {
        super();
        this.text = text;
        this.code = code;
    }
}

module.exports = AppError;