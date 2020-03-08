const bcryptjs = require('bcryptjs');


console.log(process.argv[2]);


console.log();


const hashPassword = async (pwd) => {

    const hashedPwd = await bcryptjs.hash(pwd, 8);
    console.log(hashedPwd);

    console.log(await bcryptjs.compare('Hello123', hashedPwd));
};


hashPassword(process.argv[2]);

//console.log('Hello');