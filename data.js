const faker = require('faker');
const bcrypt = require('bcrypt');
var db = require("./server/models")

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

db.User.findAll().then(user => {
    if (user.length == 0) {
        data()
    }
}).catch(err => {
    console.log(err)
})

let music = [
    "https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_1MG.mp3",
    "https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3",
    "https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_2MG.mp3",
    "https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_5MG.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3"
]

const data = async () => {
    for (let index = 0; index < 500; index++) {
        // await sleep(300)
        let body = {
            firstName: faker.name.firstName("male"),
            lastName: faker.name.lastName("male"),
            gender: "male",
            password: bcrypt.hashSync('123', 10),
            photo: [
                faker.image.imageUrl("950", '1000', 'people', true, true),
                faker.image.imageUrl("950", '1000', 'people', true, true),
                faker.image.imageUrl("950", '1000', 'people', true, true),
                faker.image.imageUrl("950", '1000', 'people', true, true)
            ]/* "https://source.unsplash.com/random/1158*1544" */,
            media: [
                faker.random.arrayElement(music),
                faker.random.arrayElement(music),
                faker.random.arrayElement(music),
                faker.random.arrayElement(music),
            ],
            city: faker.address.city(),
            State: faker.address.state(),
            postcode: faker.address.zipCode(),
            phoneNumber: faker.phone.phoneNumber("+91##########"),
            bio: faker.lorem.sentence(25),
            tagline: faker.lorem.sentence(10),
            is_manual: true,
            provider: "manual",
            latitude: faker.address.latitude(21.0000000, 21.9999999, 7),
            longitude: faker.address.longitude(72.000000, 72.999999, 7),
            maximumDistance: faker.datatype.number(100)
        }

        body = {
            ...body,
            email: faker.internet.email(body.firstName, body.lastName, "gmail.com"),
            username: faker.internet.userName(body.firstName, body.lastName),
        }

        db.User.create(body).then(user => {
            console.log(user)
        }).catch(error => {
            console.log(error);
        })

    }
    for (let index = 0; index < 1000; index++) {
        // await sleep(300)
        let body = {
            firstName: faker.name.firstName("female"),
            lastName: faker.name.lastName("female"),
            gender: "female",
            password: bcrypt.hashSync('123', 10),
            photo: [
                faker.image.imageUrl("950", '1000', 'people', true, true),
                faker.image.imageUrl("950", '1000', 'people', true, true),
                faker.image.imageUrl("950", '1000', 'people', true, true),
                faker.image.imageUrl("950", '1000', 'people', true, true)
            ]/* "https://source.unsplash.com/random/1158*1544" */,
            media: [
                faker.random.arrayElement(music),
                faker.random.arrayElement(music),
                faker.random.arrayElement(music),
                faker.random.arrayElement(music)
            ],
            city: faker.address.city(),
            State: faker.address.state(),
            postcode: faker.address.zipCode(),
            phoneNumber: faker.phone.phoneNumber("+91##########"),
            bio: faker.lorem.sentence(25),
            tagline: faker.lorem.sentence(10),
            is_manual: true,
            provider: "manual",
            latitude: faker.address.latitude(21.0000000, 21.9999999, 7),
            longitude: faker.address.longitude(72.000000, 72.999999, 7),
            maximumDistance: faker.datatype.number(100)
        }

        body = {
            ...body,
            email: faker.internet.email(body.firstName, body.lastName, "gmail.com"),
            username: faker.internet.userName(body.firstName, body.lastName),
        }

        db.User.create(body).then(user => {
            console.log(user)
        }).catch(error => {
            console.log(error);
        })

    }
}

data()