module.exports = participants => {
    const counted = { bear: 0, bison: 0, wolf: 0, lynx: 0 };
    participants.forEach(a => {
        switch (a.house) {
            case "bear":
                counted.bear++;
                break;
            case "bison":
                counted.bison++;
                break;
            case "wolf":
                counted.wolf++;
                break;
            case "lynx":
                counted.lynx++;
                break;
            default:
                console.log(`Sorry, ${a.gender} is not a house`);
        }
    })
    return counted;
}