class myError extends Error{
    constructor(message){
        super();
        this.message=message;
    }
}

module.exports = myError;