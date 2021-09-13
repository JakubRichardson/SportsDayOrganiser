const mongoose = require("mongoose");
const SportsDay = require("./models/sportsDay");
const Event = require("./models/event");

mongoose.connect("mongodb://localhost:27017/sportsApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connection Open!");
})
    .catch(err => {
        console.log("Error:" + err);
    })

const seedEvents = [
    { name: "Javelin", gender: "Male", participants: ["John", "Julie"] },
    { name: "400m", gender: "Female", participants: ["Pablo", "Picasso"] }
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

const seedDB = async () => {
    await SportsDay.deleteMany({});
    await Event.deleteMany({});
    for (let day of seedSportsDays) {
        const sportsDay = new SportsDay(day);
        for (let event of seedEvents) {
            const newEvent = new Event(event);
            await newEvent.save();
            sportsDay.events.push(newEvent);
        }
        await sportsDay.save();
    }
}

seedDB().then(() => {
    console.log("All good!");
}).catch(err => {
    console.log(err);
});