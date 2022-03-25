const generate_password = require('generate-password');
const { log } = require("../logger/logger");


module.exports.generateCredentials = (personal_informations) => {
    const _name = personal_informations[0], _surname = personal_informations[1];
    const generatedPassword = generate_password.generate({
        length: 12,
        numbers: true,
        symbols: true
    })
    
    const email = `${_name}.${_surname}@interia.pl`;
    const data = {
        email,
        password: generatedPassword,
        fullNameWithDot: `${_name}.${_surname}`
    }

    return data;
}
