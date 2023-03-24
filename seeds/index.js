//stand-alone file yg digunakan ketika ingin ubah data di DataBase

const mongoose = require('mongoose');
const Campgrounds = require('../models/campground');
const cities = require('./cities');
const fetch = require('node-fetch');
const { descriptors, places } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

//ERROR HANDLING
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Connected');
})

const sample = (arr) => {
    return Math.floor(Math.random() * arr.length);
}


//JIKA INGIN REQ RANDOM IMAGE DGN API PAKE FUNCTION INI
const reqImg = async () => {
    const accessKey = 'Vuez-0yUk3XVCCBuX5dWb0Kj95OZQhth5sY8VEOHUHw';
    const res = await fetch(`https://api.unsplash.com/photos/random?collections=483251&client_id=${accessKey}`)
    const data = await res.json();
    
    return data;
}

const seedsDB = async () => {
    await Campgrounds.deleteMany({});

    for (let i = 0; i < 300; i++) {
        const random1000 = sample(cities);
        const price = Math.floor(Math.random() * 20) + 10; 
        //const imgObj = await reqImg(); ---> PENDEKATAN REQ IMG DGN API
        const camp = new Campgrounds({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${descriptors[sample(descriptors)]} ${places[sample(places)]}`,
            //image: imgObj.urls.raw, ---> PENDEKATAN REQ IMG DGN API
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quos officiis provident culpa nam eveniet deleniti nemo reiciendis placeat a excepturi ab necessitatibus accusamus accusantium, ad natus, temporibus, neque recusandae voluptas.',
            author: '63885fa25bff332450300b8a',
            price,
            images:  [
                {
                  url: 'https://res.cloudinary.com/dkdmbqzaq/image/upload/v1677397702/YelpCamp/f85vitpvbit59jwabiad.jpg',
                  name: 'YelpCamp/nfsvwiebhuy7n3uq4wys',
                },
                {
                  url: 'https://res.cloudinary.com/dkdmbqzaq/image/upload/v1677398105/YelpCamp/lduidimnvqcbmgpymvp1.jpg',
                  name: 'YelpCamp/vnklnz3dzaix4xj8lns1',
                }
            ],
            geometry: {
                type: 'Point',
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            }
        })
        await camp.save();
    }
}

seedsDB().then(() => {
    mongoose.connection.close();
})

