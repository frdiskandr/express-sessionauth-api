import ResponseError from "../Error/ResponseError.js";

async function ValidateSchema(schema, data) {
    try{
        const valid = await schema.validate(data);
        return valid
    }catch(e){
        console.log(e)
        throw new ResponseError(400,`validation error: ${e.errors}`);
    }
}

export {ValidateSchema}