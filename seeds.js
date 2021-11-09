const mongoose = require("mongoose");
const SportsDay = require("./models/sportsDay");
const Event = require("./models/event");
const TemplateEvent = require("./models/tempEvent");
const User = require("./models/user")

mongoose.connect("mongodb://localhost:27017/sportsApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connection Open!");
})
    .catch(err => {
        console.log("Error:" + err);
    })

// const seedUsers = [
//     { name: "Mathew", house: "bison" },
//     { name: "Tommy", house: "wolf" },
//     { name: "Monty", house: "lynx" }
// ]

const seedEvents = [
    { name: "Javelin", gender: "male" },
    { name: "400m", gender: "female" }
];

const seedSportsDays = [
    {
        name: "Y11 sports day",
        year: "11",
        date: "2021-09-17"
    },
    {
        name: "Y2 sports day",
        year: "2",
        date: "2022-10-17"
    },
    {
        name: "Y3 sports day",
        year: "3",
        date: "2022-10-20"
    },
    {
        name: "Y4 sports day",
        year: "4",
        date: "2022-10-17"
    }
];

const templateEvents = [
    { name: "100m" },
    { name: "200m" },
    { name: "400m" },
    { name: "800m" },
    { name: "Javelin" },
    { name: "Shot Put" },
    { name: "Discus" },
    { name: "Long jump" },
    { name: "Triple jump" },
    { name: "High jump" },
    { name: "4x100m relay" }
]

const seedDB = async () => {
    await SportsDay.deleteMany({}); // removes all nested with middleware
    for (let day of seedSportsDays) {
        const sportsDay = new SportsDay(day);
        for (let event of seedEvents) {
            const newEvent = new Event(event);
            // for (let user of seedUsers) {
            //     const newUser = new User(user);
            //     await newUser.save();
            //     newEvent.participants.push(newUser);
            // }
            await newEvent.save();
            sportsDay.events.push(newEvent);
        }
        await sportsDay.save();
    }
    await TemplateEvent.deleteMany({});
    TemplateEvent.insertMany(templateEvents);
}

seedDB().then(() => {
    console.log("All good!");
}).catch(err => {
    console.log(err);
});