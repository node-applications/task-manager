const request = require('supertest');
const app = require('../src/app');
const taskModel = require('../src/models/taskmodel');
const dbConfig = require('./fixtures/db');

const {userid, userOne, createTestUser} = require('./fixtures/db');


// conflict is occuring due to multiple test suites
// Multiple db access is conflicting
// best is to run test suites in sequence --runInBand
beforeEach (async () => {
        await createTestUser();
        await taskModel.deleteMany();
});

test ('Create first task for user', async () => {
    const response = await request(app)
                            .post('/Tasks')
                            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                            .send({
                                description : 'test task'
                            }).expect(201);
    const task = await taskModel.findById(response.body._id);
    expect(task.description).toBe('test task');
    expect(task).not.toBeNull();
    expect(task.completed).toEqual(false);
});