class ApiResponse {
    constructor(statusCode = 200, data = null, message = "success") {
        
        if(typeof statusCode !== 'number'){
            throw new Error("statusCode must be a number");
        }
        
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode < 400
    }
}

export { ApiResponse };