const fs = require('fs')
const path = require("path");
const bcrypt = require("bcrypt");

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

const hashPassword = async (pass) => {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(pass, salt);
    return hash;
}

const setupMasterUser = async (pass) => {
    const masterPassHashed = await hashPassword(pass);
    const content = `MASTERPASS=${masterPassHashed}`;

    fs.writeFile(path.join(__dirname, ".env"), content, err => {
        if (err) {
            console.error(err)
            return
        }
    })
}

const input = (msg) => {
    return new Promise((resolve, reject) => {
        readline.question(msg, (answer) => {
            resolve(answer)
        })
    })
}

const getPass = async (repeat = 1) => {
    if (repeat > 3) {
        console.log("Too many tries");
        readline.close();
        process.exit();
    }

    let pass = await input("Please enter master password: ");
    const confirm = await input("Please confirm master password: ");

    if (confirm !== pass) {
        if (repeat < 3) console.log("The passwords don't match, try again");
        pass = getPass(++repeat);
    }

    return pass;
}

const main = async () => {
    const pass = await getPass();
    readline.close()
    console.log("Admin user master password has been set")
    setupMasterUser(pass);
}

console.log("Master password will be used to verify admin users when creating their accounts. Choosing a master password below will override the current master password if already specified");
main()
