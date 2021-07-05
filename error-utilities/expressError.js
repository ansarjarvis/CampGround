class expressError extends Error{
    constructor(message,sourceCode){
        super();
        this.sourceCode=sourceCode;
        this.message=message;
    }
}

module.exports = expressError;