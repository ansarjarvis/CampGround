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
    for (let i = 0; i < 250; ++i) {
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
                    url: 'https://res.cloudinary.com/dfpcslugq/image/upload/v1626509955/CampGround/sllxc7yterlfc2f3qvyp.jpg',
                    filename: 'CampGround/sllxc7yterlfc2f3qvyp'
                },
                {
                    url: 'https://res.cloudinary.com/dfpcslugq/image/upload/v1626509960/CampGround/bzpbenovnmxn81k1r80g.jpg',
                    filename: 'CampGround/bzpbenovnmxn81k1r80g'
                },
                {
                    url: 'https://res.cloudinary.com/dfpcslugq/image/upload/v1626509968/CampGround/snrseqhmfrw6of5h6bxe.jpg',
                    filename: 'CampGround/snrseqhmfrw6of5h6bxe'
                }
            ]

        })
        await camp.save()
    }
}
seedDb().then(() => {
    mongoose.connection.close;
})

