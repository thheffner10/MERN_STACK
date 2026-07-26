const request = require("supertest");
const { app, client, connectDB } = require("../server");


describe("HabitTracker API Tests", () => {


    beforeAll(async () => {
        await connectDB();
    });


    afterAll(async () => {
        await client.close();
    });


    test("GET /api/me should return not logged in", async () => {

        const response = await request(app)
            .get("/api/me");

        expect(response.statusCode)
            .toBe(200);

        expect(response.body.success)
            .toBe(false);

    });

    test("POST /api/register missing fields", async () => {

    const response = await request(app)
        .post("/api/register")
        .send({
            username: "bob"
        });

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(false);

    expect(response.body.message)
        .toBe("Missing fields");

    });

    test("POST /api/login user does not exist", async () => {

    const response = await request(app)
        .post("/api/login")
        .send({
            username: "DefinitelyDoesNotExist12345",
            password: "password"
        });

    expect(response.statusCode).toBe(200);

    expect(response.body.success).toBe(false);

    expect(response.body.message)
        .toBe("User not found");

});

});