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
    { name: "Javelin", participants: ["John", "Julie"] },
    { name: "400m", participants: ["Pablo", "Picasso"] }
];

const seedSportsDays = [
    {
        name: "Y11 sports day"
    },
    {
        name: "Y2 sports day"
    },
    {
        name: "Y3 sports day"
    },
    {
        name: "Y4 sports day"
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