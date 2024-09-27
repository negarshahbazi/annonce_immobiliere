const request = require("supertest");
let app = require("../app");

beforeAll(() => {
  app = require("../app");
});

describe("POST /annonces", () => {
  it("should create a new annonce", async () => {
    const data = {
      titre: "Superbe appartement en centre-ville",
      description: "Un appartement charmant avec vue sur la rivière",
      prix: 250000,
      surface: 80,
      localisation: {
        ville: "Lyon",
        codePostal: "69000",
      },
      caractéristiques: {
        chambre: 2,
        salleDeBain: 1,
        balcon: true,
        jardin: false,
        parking: true,
      },
    };

    const res = await request(app).post("/annonces").send(data);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("_id");
  });
});

describe("GET /annonces", () => {
  it("should retrieve all annonces", async () => {
    const res = await request(app).get("/annonces");

    expect(res.statusCode).toEqual(200);
  });
});
