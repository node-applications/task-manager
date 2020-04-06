// This api is to test express
const request = require('supertest');
const app = require('../src/app');
const userModel = require('../src/models/usermodel');

const {userid, userOne, createTestUser} = require('./fixtures/db');



beforeEach(createTestUser);


afterEach(() => {
    console.log('after each test');
});


test ( 'User signup', async () => {

    const response = await request(app).post('/Users')
                .send({
                    name : 'testuser01',
                    email : 'testuser01@yopmail.com',
                    password : 'hello123'
                }).expect(201);
    
    const user = await userModel.findById(response.body.user._id);
    expect(user).not.toBeNull();

    expect(response.body).toMatchObject({
        user : {
            name : 'testuser01',
            email : 'testuser01@yopmail.com'
        }
    });

} );

test ( 'User login', async () => {

    await request(app).post('/User/login')
                .send({
                    email : userOne.email,
                    password : userOne.password
                }).expect(200);

} );


test ( 'User login', async () => {

    await request(app).post('/User/login')
                .send({
                    email : userOne.email,
                    password : 'test02'
                }).expect(401);

} );


test ( 'get my profile', async () => {

    await request(app)
                .get('/Users/me')
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                .send()
                .expect(200);

} );


test ( 'should not get my profile', async () => {

    await request(app)
                .get('/Users/me')
                .send()
                .expect(401);

} );



test ( 'Delete my profile', async () => {

    await request(app)
                .delete('/Users/me')
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                .send()
                .expect(200);

} );


test ( 'Delete my profile failed', async () => {

    await request(app)
                .delete('/Users/me')
                //.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                .send()
                .expect(401);

} );


test ( 'Update my profile', async () => {

    const response = await request(app)
                .patch('/Users/me')
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                .send({name : 'mintestuser01'})
                .expect(200);
    const user = await userModel.findById(userid);
    expect(user.name).toBe('mintestuser01');

} );


test ( 'Update my profile with wrong attribute', async () => {

    const response = await request(app)
                .patch('/Users/me')
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                .send({hello : 'mintestuser01'})
                .expect(400);
    const user = await userModel.findById(userid);
    expect(user.name).not.toBe('mintestuser01');

} );


test ( 'Attach a avatar to profile', async () => {

    const response = await request(app)
                .post('/Users/me/avatar')
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                .attach('avatar', 'tests/fixtures/robot2.png')
                .expect(200);
    const user = await userModel.findById(userid);
    expect(user.avatar).toEqual(expect.any(Buffer));

} );


