require("dotenv").config();

const mongoose = require("mongoose");
const Campground = require("../model/compground");
const cities = require("./city");
const { places, descriptors } = require("./seed-helper");

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/camp-ground';
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

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
    for (let i = 0; i < 200; ++i) {
        const random1000 = Math.floor(Math.random() * 1000) + 1;
        const price = Math.floor(Math.random() * 1500) + 600;
        const camp = new Campground({
            author: "60ec93733e1f544a1839e88f",
            title: `${sample(places)} ${sample(descriptors)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state} `,
            description: " Lorem ipsum dolor sit amet consectetur, adipisicing elit.Inventore, minima.Commodi, earum amet? Consequuntur maiores quisquam voluptate harum enim, adipisci, illum reprehenderit est quod ullam incidunt, cum rerum molestias hic.",
            price: price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dfpcslugq/image/upload/v1626508931/CampGround/omc0aq6fwua2rdz0exz3.jpg',
                    filename: 'CampGround/omc0aq6fwua2rdz0exz3'

                },
                {
                    url: 'https://res.cloudinary.com/dfpcslugq/image/upload/v1628141052/CampGround/gc49o3t7fc0q7nsz7s5o.jpg',
                    filename: 'CampGround/gc49o3t7fc0q7nsz7s5o'
                },
                {
                    url: 'https://res.cloudinary.com/dfpcslugq/image/upload/v1628141061/CampGround/zvx69jrq1xvb5nmjvxev.jpg',
                    filename: 'CampGround/zvx69jrq1xvb5nmjvxev'
                }
            ]

        })
        await camp.save()
    }
}
seedDb().then(() => {
    mongoose.connection.close;
})
