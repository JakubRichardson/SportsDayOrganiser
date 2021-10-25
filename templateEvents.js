const events = [
    { id: "a0", name: "100m" },
    { id: "a1", name: "200m" },
    { id: "a2", name: "400m" },
    { id: "a3", name: "800m" },
    { id: "a4", name: "Javelin" },
    { id: "a5", name: "Shot Put" },
    { id: "a6", name: "Discus" },
    { id: "a7", name: "Long jump" },
    { id: "a8", name: "Triple jump" },
    { id: "a9", name: "High jump" },
    { id: "a10", name: "4x100m relay" }
]

const keys = [];
for (let obj of events) {
    keys.push(obj.id)
}

module.exports.templates = events;
module.exports.keys = keys;
