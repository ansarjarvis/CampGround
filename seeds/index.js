const mongoose = require("mongoose");
const Campground = require("../model/compground");
const cities = require("./city");
const { places, descriptors } = require("./seed-helper");

mongoose.connect('mongodb://localhost:27017/camp-ground', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("DataBase is connected")
});

const sample = function (array) {
    return array[Math.floor(Math.random() * array.length)]
}

const seedDb = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 50; ++i) {
        const random1000 = Math.floor(Math.random() * 1000) + 1;
        const camp = new Campground({
            title: `${sample(places)} ${sample(descriptors)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state} `
        })
        await camp.save()
    }
}
seedDb().then(() => {
    mongoose.connection.close;
})

