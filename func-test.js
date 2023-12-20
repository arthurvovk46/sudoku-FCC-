const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

  const puzzleValid = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
  const puzzleInvChar = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..600";
  const puzzleInvLen = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6";
  const puzzleInvalid = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..666";
  const solution = "769235418851496372432178956174569283395842761628713549283657194516924837947381625";
  let request = {};
  
  suite("1. Solve a puzzle", () => {

    test("1) with valid puzzle string", (done) => {

      request.puzzle = puzzleValid;
      
      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .send(request)
        .end((err, res) => {

          assert.equal(res.status, 200);
          assert.property(res.body, "solution");
          assert.equal(res.body.solution, solution);
          done();
        });
    });

    test("2) with missing puzzle string", (done) => {

      request.puzzle = "";

      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .send(request)
        .end((err, res) => {

          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, 'Required field missing');
          done();
        });
    });

    test("3) with invalid characters", (done) => {

      request.puzzle = puzzleInvChar;

      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .send(request)
        .end((err, res) => {

          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    });

    test("4) with incorrect length", (done) => {

      request.puzzle = puzzleInvLen;

      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .send(request)
        .end((err, res) => {

          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
    });

    test("5) that cannot be solved", (done) => {

      request.puzzle = puzzleInvalid;

      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .send(request)
        .end((err, res) => {

          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, 'Puzzle cannot be solved');
          done();
        });
    });
  });

  suite("2. Check a puzzle", () => {

    test("6) with all fields", (done) => {

      request.puzzle = puzzleValid;
      request.coordinate = "A1";
      request.value = "7";
      
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send(request)
        .end((err, res) => {

          assert.equal(res.status, 200);
          assert.property(res.body, "valid");
          assert.isTrue(res.body.valid);
          done();
        });
    });

    test("7) with single placement conflict", (done) => {

      request.puzzle = puzzleValid;
      request.coordinate = "A1";
      request.value = "6";

      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send(request)
        .end((err, res) => {

          assert.equal(res.status, 200);
          assert.property(res.body, "valid");
          assert.property(res.body, "conflict");
          assert.isFalse(res.body.valid);
          assert.isArray(res.body.conflict);
          assert.equal(res.body.conflict.length, 1);
          assert.equal(res.body.conflict[0], "column");
          done();
        });
    });

    test("8) with multiple placement conflicts", (done) => {

      request.puzzle = puzzleValid;
      request.coordinate = "A1";
      request.value = "1";

      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send(request)
        .end((err, res) => {

          assert.equal(res.status, 200);
          assert.property(res.body, "valid");
          assert.property(res.body, "conflict");
          assert.isFalse(res.body.valid);
          assert.isArray(res.body.conflict);
          assert.equal(res.body.conflict.length, 2);
          assert.equal(res.body.conflict[0], "row");
          assert.equal(res.body.conflict[1], "column");
          done();
        });
    });

    test("9) with all placement conflicts", (done) => {

      request.puzzle = puzzleValid;
      request.coordinate = "A1";
      request.value = "5";

      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send(request)
        .end((err, res) => {

          assert.equal(res.status, 200);
          assert.property(res.body, "valid");
          assert.property(res.body, "conflict");
          assert.isFalse(res.body.valid);
          assert.isArray(res.body.conflict);
          assert.equal(res.body.conflict.length, 3);
          assert.equal(res.body.conflict[0], "row");
          assert.equal(res.body.conflict[1], "column");
          assert.equal(res.body.conflict[2], "region");
          done();
        });
    });

    test("10) with missing required fields", (done) => {

      request.puzzle = "";
      request.coordinate = "";
      request.value = "";

      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send(request)
        .end((err, res) => {

          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Required field(s) missing");
          done();
        });
    });

    test("11) with invalid characters", (done) => {

      request.puzzle = puzzleInvChar;
      request.coordinate = "A1";
      request.value = "7";

      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send(request)
        .end((err, res) => {

          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });

    test("12) with incorrect length", (done) => {

      request.puzzle = puzzleInvLen;
      request.coordinate = "A1";
      request.value = "7";

      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send(request)
        .end((err, res) => {

          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
          done();
        });
    });

    test("13) with invalid placement coordinate", (done) => {

      request.puzzle = puzzleValid;
      request.coordinate = "z23";
      request.value = "7";

      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send(request)
        .end((err, res) => {

          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Invalid coordinate");
          done();
        });
    });

    test("14) with invalid placement value", (done) => {

      request.puzzle = puzzleValid;
      request.coordinate = "A1";
      request.value = "0";

      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send(request)
        .end((err, res) => {

          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Invalid value");
          done();
        });
    });
  });
});
