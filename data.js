const faker = require('faker');
const bcrypt = require('bcrypt');
var db = require("./models")

for (let index = 0; index < 100; index++) {
    let body = {
        firstName: faker.name.firstName("male"),
        lastName: faker.name.lastName("male"),
        gender: /* faker.name.gender() */"male",
        password: bcrypt.hashSync('123', 10),
        photo: faker.image.people("1158", '1544'),
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
for (let index = 0; index < 100; index++) {
    let body = {
        firstName: faker.name.firstName("female"),
        lastName: faker.name.lastName("female"),
        gender: /* faker.name.gender() */"female",
        password: bcrypt.hashSync('123', 10),
        photo: faker.image.people("1158", '1544'),
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
