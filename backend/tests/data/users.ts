require('dotenv').config();

export const users = [
    {
        firstName: "Armaan",
        lastName: "Punj",
        username: "armaan",
        password: process.env.LOGIN_PASS,
        phone_extension: "+1",
        phone_number: process.env.ARM_PHONE
    },
    {
        firstName: "Shani",
        lastName: "Inbari",
        username: "shani",
        password: process.env.LOGIN_PASS,
        phone_extension: "+1",
        phone_number: process.env.SHA_PHONE
    },
    {
        firstName: "Josh",
        lastName: "Paulson",
        username: "josh",
        password: process.env.LOGIN_PASS,
        phone_extension: "+1",
        phone_number: process.env.JOS_PHONE
    },
    {
        firstName: "Crystal",
        lastName: "Guo",
        username: "crystal",
        password: process.env.LOGIN_PASS,
        phone_extension: "+1",
        phone_number: process.env.XIA_PHONE
    },
    {
        firstName: "Matthew",
        lastName: "Jiang",
        username: "matthew",
        password: process.env.LOGIN_PASS,
        phone_extension: "+1",
        phone_number: process.env.MAT_PHONE
    },
]