const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//  middleware :
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4nkvsmn.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   serverApi: ServerApiVersion.v1,
});

// database connection function is here:-
const run = async () => {
   try {
      const database = client.db("blogBD-DB");
      const UserCollections = database.collection("users");

      /* =====================
            Users API's Start
      =======================
      */
      //  users get apies
      app.get("/users", async (req, res) => {
         const query = {};
         const users = await UserCollections.find(query).toArray();
         res.send(users);
      });
      // users post api
      app.post("/users", async (req, res) => {
         const { email, name } = req.body;
         console.log(email, name);
         const result = await UserCollections.insertOne({ email, name });
         res.send(result);
      });

      // single user get api:-
      app.get("/users/:email", async (req, res) => {
         // const email = req.query.email;
         // const query = {email};
         const { email } = req.params;
         const query = { email };
         const result = await UserCollections.findOne(query);
         res.send(result);
         console.log(req.params);
      });

      /* =====================
            Users API's End
      =======================
      */

      /* =====================
         JWT Token section:-
      =======================*/

      /* =====================
         JWT Token Section end :-
      ======================= */

      /* =====================
         Blog's Start:-
      =======================*/
      const BlogCollections = database.collection('blogs');
      app.get('/blogs', async(req,res)=>{
         const query = {}; 
         const cursor = BlogCollections.find(query).sort({date: -1}); 
         const blogs =await  cursor.toArray()
         res.send(blogs);
      })


     app.get('/blogs/:id', async(req,res)=>{
       const {id} = req.params; 
       const query ={
         _id: new ObjectId(id),
       }
       const blog = await BlogCollections.findOne(query);
       res.send(blog);
       
     })

      app.post('/blogs', async(req,res)=>{
         const {title, description, email, author, date, image} = req.body; 
         const result = await BlogCollections.insertOne({title, description, email, author, date, image}); 
         res.send(result); 
      })

      /*=====================
         Blog's end :-
      ======================= */
   } finally {
   }
};

run().catch((err) => console.dir(err));

// common api is here:-
app.get("/", (req, res) => {
   res.send("Blog BD server is starting now");
});

app.listen(port, () => {
   console.log(`serer is running on port: ${port}`);
});
