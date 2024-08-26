const express = require("express");
const router = express.Router();
const axios = require("axios");

// DAO
const DAO = require("./../db/sqlite");
const dao = new DAO();

const createCollectionId = (collectionName, model, useremail) =>
  collectionName + "_" + model + "_" + useremail;

/**
 * Create Collection
 */
router.post("/create_collection", async (req, res) => {
  const { useremail, token, collectionName, model } = req.body;

  /**
   * 0. Verify token first
   * 1. create the id of collection using colleectionName#model#useremail
   * 2. check if the id is present or not
   * 3. If not create a collection first in aws and second here in locale and respond with 201
   * 4. If yes throw an error with 400 bad request - collection exist
   */

  // create id
  const collectionId = createCollectionId(collectionName, model, useremail);

  // fetch collection details if exist
  const collectionDetails = await dao.get(
    `Select * FROM COLLECTIONS where id=?`,
    [collectionId]
  );

  if (collectionDetails.length) {
    return res.status(400).send({
      error_msg: "Collection already exist, Please use different name",
    });
  }

  // make call to python api
  // Create the request body
  const collectionData = JSON.stringify({
    model_type: model,
    collection_name: collectionId,
  });

  console.log(collectionData);

  let response;

  try {
    response = await axios.post(
      "http://20.51.121.137:5000/api/create_collection",
      collectionData,
      {
        headers: {
          "Content-Type": "application/json",
        }
      }
    );
    console.log("Response:", response.data);
  } catch (error) {
    console.log("Error", error);
    console.log("ererere");
    res.status(500).send("ererere");
  }

  console.log(response);

  // create collection in node js sqlite
  const insertCollection = await dao.run(
    `INSERT INTO COLLECTIONS (id, name, createdBy) VALUES (?, ?, ?)`,
    [collectionId, collectionName, useremail]
  );

  console.log(insertCollection);
  res.status(201).send(insertCollection);
});

router.get("/get_collection", async (req, res) => {
  console.log(req);
  const { useremail, token } = req.query;

  console.log(useremail);

  // fetch collections for given user
  const collectionDetails = await dao.get(
    `Select * FROM COLLECTIONS where createdBy=?`,
    [useremail]
  );

  res.status(200).send(
    collectionDetails.reduce((acc, collection) => {
      acc.push({
        id: collection.id,
        name: collection.name,
      });

      return acc;
    }, [])
  );
});

module.exports = router;
