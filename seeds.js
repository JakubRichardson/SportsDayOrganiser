const mongoose = require("mongoose");
const SportsDay = require("./models/sportsDay");
const Event = require("./models/event");
const TemplateEvent = require("./models/tempEvent");

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
    { name: "4x100m relay", limit: 4 }
]

const seedDB = async () => {
    await SportsDay.deleteMany({});
    for (let event of await Event.find({})) {
        await Event.findByIdAndDelete(event._id); // removes all nested with middleware
    }
    for (let day of seedSportsDays) {
        const sportsDay = new SportsDay(day);
        for (let event of seedEvents) {
            const newEvent = new Event(event);
            newEvent.day = sportsDay;
            await newEvent.save();
            sportsDay.events.push(newEvent);
        }
        await sportsDay.save();
    }
    await TemplateEvent.deleteMany({});
    await TemplateEvent.insertMany(templateEvents);
}

seedDB().then(() => {
    console.log("All good!");
    process.exit();
}).catch(err => {
    console.log(err);
});