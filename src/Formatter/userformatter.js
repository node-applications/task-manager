const bcryptjs = require('bcryptjs');

const formatPassword = async (pwd) => {
    if(!pwd) throw new Error({error : 'Authentication value is missing'});
    return await bcryptjs.hash(pwd, 8);
};

const comparePassword = async (pwd, hash) => {
    if(!pwd) throw new Error({error : 'Authentication value is missing'});
    return await bcryptjs.compare(pwd, hash);
};

module.exports = {
    formatPassword : formatPassword,
    comparePassword : comparePassword
};