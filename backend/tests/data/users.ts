require('dotenv').config();

export const users = [
    {
        firstName: "Owen",
        lastName: "Owner",
        username: "owen",
        password: process.env.LOGIN_PASS,
        phone_extension: "+1",
        phone_number: process.env.OWN_PHONE
    },
    {
        firstName: "Fiona",
        lastName: "Friend",
        username: "fiona1",
        password: process.env.LOGIN_PASS,
        phone_extension: "+1",
        phone_number: process.env.FIO1_PHONE
    },
    {
        firstName: "Fiona",
        lastName: "Friend2",
        username: "fiona2",
        password: process.env.LOGIN_PASS,
        phone_extension: "+1",
        phone_number: process.env.FIO2_PHONE
    },
    {
        firstName: "Fionda",
        lastName: "Friend3",
        username: "fiona3",
        password: process.env.LOGIN_PASS,
        phone_extension: "+1",
        phone_number: process.env.FIO3_PHONE
    },
    {
        firstName: "Rory",
        lastName: "Rando",
        username: "rory1",
        password: process.env.LOGIN_PASS,
        phone_extension: "+1",
        phone_number: process.env.ROR1_PHONE
    },
    {
        firstName: "Rory",
        lastName: "Rando2",
        username: "rory2",
        password: process.env.LOGIN_PASS,
        phone_extension: "+1",
        phone_number: process.env.ROR2_PHONE
    }, 
    {
        firstName: "Mary",
        lastName: "Mutual",
        username: "mary",
        password: process.env.LOGIN_PASS,
        phone_extension: "+1",
        phone_number: process.env.MAR_PHONE
    }
]