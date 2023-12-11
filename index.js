/* eslint-disable max-len */
/* eslint-disable indent */
/* eslint-disable object-curly-spacing */
const admin = require("firebase-admin");

const serviceAccount = require("./permission.json");
const dataProject = require("./projects.json");
const dataEmployees = require("./employees.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://zero-api-a307a-default-rtdb.asia-southeast1.firebasedatabase.app"
});

// Setup app dependencies
const db = admin.firestore();
const express = require("express");
const app = express();
const PORT = 4000;
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const cors = require("cors");
app.use(cors({ origin: true }));
const jwt = require('jsonwebtoken'); 
const JWT_SECRET_KEY = "jwt_secret_key"
const TOKEN_HEADER_KEY = "token_header_key"
// use app to create route with request (req) and response (res)
// Basic test route
app.post("/login", (req, res) => {
  try {
    const {email, password} = req.body
    if(email === "zerot.host@gmail.com" && password === "admin@123"){ 
      let data = { 
        time: Date(), 
        data: {
          email: email,
          role: "admin"
        }, 
    } 
    const token = jwt.sign(data, JWT_SECRET_KEY); 
   return res.status(200).send(token); 
    }else{ 
        return res.status(401).send({message: "Unauthorized"}); 
    } 
} catch (error) { 
    return res.status(401).send(error); 
} 
});

app.post("/tracking", (req, res) => {
  (async () => {
    try {
      const query = db.collection("tracking");
      const response = [];
      await query
        .get()
        .then((querySnapshot) => {
          const docs = querySnapshot.docs; // the result of our query
          for (const doc of docs) {
            // add each doc to our JSON response
            const selectedItem = {
              id: doc.id,
              ...doc.data(),
            };
            response.push(selectedItem);
          }
        })
        .then(async (respro) => {
          const id = response.length + 1;
          await db
            .collection("tracking")
            .doc("/" + id + "/")
            .create({ ...req.body, createdAt: new Date().toISOString() });
          return res.status(200).send({msg: 'Success', data: { ...req.body, createdAt: new Date().toISOString() }});
        });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

app.get("/tracking/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("tracking").doc(req.params.id);
      const user = await document.get();
      const response = user.data();
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

app.get("/tracking", (req, res) => {
  (async () => {
    try {
      const query = db.collection("tracking");
      const response = [];
      await query.get().then((querySnapshot) => {
        const docs = querySnapshot.docs; // the result of our query
        for (const doc of docs) {
          // add each doc to our JSON response
          const selectedItem = {
            id: doc.id,
            ...doc.data(),
          };
          response.push(selectedItem);
        }
        return response; // each then should return a value
      });
      return res.status(200).send(response); // end of async function should return a value
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

app.patch("/tracking/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("tracking").doc(req.params.id);
      await document.update(req.body);
      return res.status(200).send(req.body);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// Create
app.post("/employees", (req, res) => {
  (async () => {
    try {
      const query = db.collection("employees");
      const response = [];
      await query
        .get()
        .then((querySnapshot) => {
          const docs = querySnapshot.docs; // the result of our query
          for (const doc of docs) {
            // add each doc to our JSON response
            const selectedItem = {
              id: doc.id,
              ...doc.data(),
            };
            response.push(selectedItem);
          }
        })
        .then(async (respro) => {
          const id = response.length + 1;
          await db
            .collection("employees")
            .doc("/" + id + "/")
            .create({
              ...req.body,
              createdAt: new Date().toISOString(),
              status: "active",
            });
          return res.status(200).send({msg: 'success',data: {
            ...req.body,
            createdAt: new Date().toISOString(),
            status: "active",
          }});
        });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// // Read item
app.get("/employees/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("employees").doc(req.params.id);
      const user = await document.get();
      const response = user.data();
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// // Read all
app.get("/employees", (req, res) => {
  (async () => {
    try {
      const query = db.collection("employees");
      const response = [];
      await query.get().then((querySnapshot) => {
        const docs = querySnapshot.docs; // the result of our query
        for (const doc of docs) {
          // add each doc to our JSON response
          const selectedItem = {
            id: doc.id,
            ...doc.data(),
          };
          response.push(selectedItem);
        }
        return response; // each then should return a value
      });
      return res.status(200).send(response); // end of async function should return a value
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// // Update
app.patch("/employees/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("employees").doc(req.params.id);
      await document.update(req.body);
      return res.status(200).send(req.body);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// // Delete
app.delete("/employees/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("employees").doc(req.params.id);
      await document.update({ deletedAt: new Date().toISOString() });
      return res.status(200).send({msg: 'success'});
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});


app.post("/projects", (req, res) => {
  (async () => {
    try {
      const query = db.collection("projects");
      const response = [];
      await query
        .get()
        .then((querySnapshot) => {
          const docs = querySnapshot.docs; // the result of our query
          for (const doc of docs) {
            // add each doc to our JSON response
            const selectedItem = {
              id: doc.id,
              ...doc.data(),
            };
            response.push(selectedItem);
          }
        })
        .then(async (respro) => {
          const id = response.length + 1;
          await db
            .collection("projects")
            .doc("/" + id + "/")
            .create({ ...req.body, createdAt: new Date().toISOString() });
          return res.status(200).send({msg: 'Success', data: { ...req.body, createdAt: new Date().toISOString() }});
        });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// // Read item
app.get("/projects/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("projects").doc(req.params.id);
      const user = await document.get();
      const response = user.data();
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// // Read all
app.get("/projects", (req, res) => {
  (async () => {
    try {
      const query = db.collection("projects");
      const response = [];
      await query.get().then((querySnapshot) => {
        const docs = querySnapshot.docs; // the result of our query
        for (const doc of docs) {
          // add each doc to our JSON response
          const selectedItem = {
            id: doc.id,
            ...doc.data(),
          };
          response.push(selectedItem);
        }
        return response; // each then should return a value
      });
      return res.status(200).send(response); // end of async function should return a value
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// // Update
app.patch("/projects/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("projects").doc(req.params.id);
      await document.update(req.body);
      return res.status(200).send(req.body);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// // Delete
app.delete("/projects/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("projects").doc(req.params.id);
      await document.update({ deletedAt: new Date().toISOString() });
      return res.status(200).send({msg: "Success"});
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

app.post("/orders", (req, res) => {
  (async () => {
    try {
      const query = db.collection("orders");
      const response = [];
      await query
        .get()
        .then((querySnapshot) => {
          const docs = querySnapshot.docs; // the result of our query
          for (const doc of docs) {
            // add each doc to our JSON response
            const selectedItem = {
              id: doc.id,
              ...doc.data(),
            };
            response.push(selectedItem);
          }
        })
        .then(async (respro) => {
          const id = response.length + 1;
          await db
            .collection("orders")
            .doc("/" + id + "/")
            .create({ ...req.body, createdAt: new Date().toISOString() });
          return res.status(200).send();
        });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// // Read item
app.get("/orders/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("orders").doc(req.params.id);
      const user = await document.get();
      const response = user.data();
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// // Read all
app.get("/orders", (req, res) => {
  (async () => {
    try {
      const query = db.collection("orders");
      const response = [];
      await query.get().then((querySnapshot) => {
        const docs = querySnapshot.docs; // the result of our query
        for (const doc of docs) {
          // add each doc to our JSON response
          const selectedItem = {
            id: doc.id,
            ...doc.data(),
          };
          response.push(selectedItem);
        }
        return response; // each then should return a value
      });
      return res.status(200).send(response); // end of async function should return a value
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// // Update
app.patch("/orders/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("orders").doc(req.params.id);
      await document.update(req.body);
      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// // Delete
app.delete("/orders/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("orders").doc(req.params.id);
      await document.update({ deletedAt: new Date().toISOString() });
      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

// Expose our CRUD app as a single Cloud Function :)
app.listen(PORT, () => {
  console.log(`Backend is running on http://localhost:${PORT}`);
});
