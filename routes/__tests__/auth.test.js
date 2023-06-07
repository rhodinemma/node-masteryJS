const request = require("supertest");
const mongoose = require("mongoose");
const MongoMemoryServer = require("mongodb-memory-server").default;
const app = require("../../index"); // Assuming your Express app is exported from 'app.js'
const User = require("../../models/User");
const CryptoJS = require("crypto-js");

// Start an in-memory MongoDB server
const mongod = new MongoMemoryServer();

beforeAll(async () => {
  // Generate a connection URI and connect to the in-memory server
  const uri = await mongod.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Disconnect from the in-memory server and stop it
  await mongoose.disconnect();
  await mongod.stop();
});

test("Register - should create a new user", async () => {
  const response = await request(app).post("/auth/register").send({
    username: "testuser",
    email: "test@example.com",
    password: "password123",
  });

  expect(response.statusCode).toBe(201);
});

test("Login - should return access token", async () => {
  const user = new User({
    username: "testuser",
    email: "test@example.com",
    password: CryptoJS.AES.encrypt(
      "password123",
      process.env.SECRET
    ).toString(),
  });
  await user.save();

  const response = await request(app).post("/auth/login").send({
    username: "testuser",
    password: "password123",
  });

  expect(response.statusCode).toBe(200);
});
