const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const asyncWrapper = require("./utilities/asyncWrapper");
const AppError = require("./utilities/AppError");
// const flash = require("connect-flash");
const methodOverride = require("method-override");

const SportsDay = require("./models/sportsDay");
const Event = require("./models/event");
const TemplateEvent = require("./models/tempEvent");
const User = require("./models/user");

const { sportsDaySchema, eventSchema, userSchema } = require("./schemas.js"); //TODO remove me

mongoose.connect("mongodb://localhost:27017/sportsApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connection Open!");
})
    .catch(err => {
        console.log("Error:" + err);
    })

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// app.use(flash());

// app.use((req, res, next) => {
//     res.locals.success = req.flash("success");
//     res.locals.error = req.flash("error");
//     next();
// })

app.get("/", (req, res) => {
    res.redirect("/sportsDays");
})

app.get("/sportsDays", asyncWrapper(async (req, res) => {
    const sportsDays = await SportsDay.find({}).populate({ path: "events" });
    res.render("sportsDays/index", { sportsDays });
}))

app.get("/sportsDays/new", asyncWrapper(async (req, res) => {
    const templates = await TemplateEvent.find({})
    res.render("sportsDays/new", { templates });
}))

const validateSportsDay = (req, res, next) => {
    const { error } = sportsDaySchema.validate(req.body);
    if (error) {
        const text = error.details.map(ind => ind.message).join(", ");
        throw new AppError(text, 400)
    } else {
        next();
    }
}

app.post("/sportsDays", validateSportsDay, asyncWrapper(async (req, res) => {
    const newSportsDay = new SportsDay({ name: req.body.name, year: req.body.year, date: req.body.date });
    if (req.body.events) {
        if (req.body.events.male) {
            for (let id of req.body.events.male) {
                const template = await TemplateEvent.findById(id);
                if (template) { // if template id wrong it won't be used and app won't crash
                    const event = new Event({ name: template.name, gender: "male" });
                    await event.save(); // doesn't need await
                    newSportsDay.events.push(event);
                }
            }
        }
        if (req.body.events.female) {
            for (let id of req.body.events.female) {
                const template = await TemplateEvent.findById(id);
                if (template) { // if template id wrong it won't be used and app won't crash
                    const event = new Event({ name: template.name, gender: "female" });
                    await event.save(); // doesn't need await
                    newSportsDay.events.push(event);
                }
            }
        }
    }
    await newSportsDay.save();
    res.redirect(`/sportsDays/${newSportsDay._id}`);
}))

app.get("/sportsDays/:id", asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const sportsDay = await SportsDay.findById(id).populate({
        path: 'events',
        populate: {
            path: 'participants',
            model: 'User'
        }
    })
    res.render("sportsDays/show", { day: sportsDay });
}))

app.get("/sportsDays/:id/edit", asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const sportsDay = await SportsDay.findById(id);
    res.render("sportsDays/edit", { day: sportsDay });
}))

app.put("/sportsDays/:id", asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const sportsDay = await SportsDay.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/sportsDays/${sportsDay._id}`);
}))

app.delete("/sportsDays/:id", asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const deletedSportsDay = await SportsDay.findByIdAndDelete(id);
    res.redirect("/sportsDays");
}))

app.get("/sportsDays/:id/events/new", asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const sportsDay = await SportsDay.findById(id);
    res.render("events/new", { day: sportsDay });
}))

const validateEvent = (req, res, next) => {
    const { error } = eventSchema.validate(req.body);
    if (error) {
        const text = error.details.map(ind => ind.message).join(", ");
        throw new AppError(text, 400)
    } else {
        next();
    }
}

app.post("/sportsDays/:id/events", validateEvent, asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const sportsDay = await SportsDay.findById(id);
    if (req.body.template && req.body.template === "true") {
        const template = new TemplateEvent({ name: req.body.name });
        await template.save();
    }
    const newEvent = new Event({ name: req.body.name, gender: req.body.gender });
    await newEvent.save();
    sportsDay.events.push(newEvent);
    await sportsDay.save();

    // TODO
    // req.flash("success", "Created new review!");

    res.redirect(`/sportsDays/${sportsDay._id}`);
}))


app.get("/sportsDays/:id/events/:eventId", asyncWrapper(async (req, res) => {
    const { id, eventId } = req.params;
    const sportsDay = await SportsDay.findById(id);
    const event = await Event.findById(eventId).populate("participants");
    res.render("events/show", { day: sportsDay, event });
}))

app.delete("/sportsDays/:id/events/:eventId", asyncWrapper(async (req, res) => {
    const { id, eventId } = req.params;
    await SportsDay.findByIdAndUpdate({ _id: id }, { $pull: { events: eventId } });
    await Event.findByIdAndDelete(req.params.eventId);

    // TODO
    // req.flash("success", "Successfully deleted review!");

    res.redirect(`/sportsDays/${id}`);
}))

const validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        const text = error.details.map(ind => ind.message).join(", ");
        throw new AppError(text, 400)
    } else {
        next();
    }
}

app.post("/sportsDays/:id/events/:eventId/join", validateUser, asyncWrapper(async (req, res) => {
    const { id, eventId } = req.params;
    const user = new User(req.body);
    await user.save();
    const event = await Event.findById(eventId);
    event.participants.push(user);
    await event.save();

    // TODO
    // req.flash("success", "Successfully signed up!");

    res.redirect(`/sportsDays/${id}/events/${eventId}`);
}))


app.delete("/sportsDays/:id/events/:eventId/:userId", asyncWrapper(async (req, res) => {
    const { id, eventId, userId } = req.params;
    const event = await Event.findById(eventId);
    const deletedUser = await User.findByIdAndDelete(userId);
    event.participants.pull({ _id: deletedUser._id });
    await event.save();

    // TODO
    // req.flash("success", "Successfully signed up!");

    res.redirect(`/sportsDays/${id}/events/${eventId}`);
}))

app.delete("/sportsDays/TemplateEvents/:id", asyncWrapper(async (req, res) => {
    const { id } = req.params;
    await TemplateEvent.findByIdAndDelete(id);
    res.redirect(req.body.returnTo);
}))

app.get("/test", (req, res) => {
    res.render("sportsDays/showFiltering")
})

app.all("*", (req, res, next) => {
    next(new AppError("Page Not Found!", 404));
})

app.use((err, req, res, next) => {
    const { text = "Oops, something went wrong", code = 500 } = err;
    res.status(code).render("error", { text, code });
})

app.listen(3000, () => {
    console.log("Listening on port 3000");
})