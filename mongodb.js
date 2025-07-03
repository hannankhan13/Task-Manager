const { MongoClient, ObjectId } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

// const id = new ObjectId();
// console.log(id);
// console.log(id.id);
// console.log(id.getTimestamp());
// console.log(id.toHexString());
(async function main() {
  try {
    const client = await MongoClient.connect(connectionURL);
    const db = client.db(databaseName);
    // const result = await db.collection("users").insertMany([
    //   {
    //     name: "Jen",
    //     age: 22,
    //   },
    //   {
    //     name: "Max",
    //     age: 12,
    //   },
    //   {
    //     name: "Hank",
    //     age: 32,
    //   },
    // ]);

    // console.log(result);

    // const result2 = await db.collection("tasks").insertMany([
    //   {
    //     description: "Learn React",
    //     completed: false,
    //   },
    //   {
    //     description: "Learn Node",
    //     completed: false,
    //   },
    //   {
    //     description: "Learn MongoDB",
    //     completed: false,
    //   },
    // ]);
    // console.log({ result2 });

    // const result3 = await db.collection("users").findOne({ _id: new ObjectId("686502c8dce767bdbbe59497") });

    // console.log(result3);
    // const result4 = await db.collection("users").find({ age: 12 }).toArray();
    // console.log(result4);

    // const result5 = await db
    //   .collection("tasks")
    //   .find({ completed: false })
    //   .toArray();

    // console.log(result5);

    // const result6 = await db
    //   .collection("tasks")
    //   .findOne({ _id: new ObjectId("68650946108f3e3101d4ab35") });

    // console.log(result6);

    // db.collection("users")
    //   .updateOne(
    //     {
    //       _id: new ObjectId("68651231491105305018bc06"),
    //     },

    //     {
    //       $inc: {
    //         age: 10,
    //       },
    //       $set: {
    //         name: "Pinkman",
    //       },
    //     }
    //   )
    //   .then((user) => console.log(user))
    //   .catch((error) => console.log(error));

    // db.collection("tasks")
    //   .updateMany(
    //     { completed: false },
    //     {
    //       $set: {
    //         completed: true,
    //       },
    //     }
    //   )
    //   .then((result) => console.log(result))
    //   .catch((error) => console.log(error));

    // db.collection("users")
    //   .deleteMany({
    //     age: 22,
    //   })
    //   .then(console.log)
    //   .catch(console.log);

    db.collection("tasks")
      .deleteOne({
        description: "Learn Node",
      })
      .then(console.log)
      .catch(console.log);
  } catch (error) {
    console.log({ error });
  }
})();
