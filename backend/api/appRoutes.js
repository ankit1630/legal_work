const express = require("express");
const router = express.Router();
const axios = require("axios");
const fileUpload = require("express-fileupload");
router.use(fileUpload());
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

  let response;

  try {
    response = await axios.post(
      "http://20.51.121.137:5000/api/create_collection",
      collectionData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    res.status(500).send({ errorMsg: "Create collection error" });
    return;
  }

  // create collection in node js sqlite
  const insertCollection = await dao.run(
    `INSERT INTO COLLECTIONS (id, name, createdBy) VALUES (?, ?, ?)`,
    [collectionId, collectionName, useremail]
  );

  res.status(201).send(insertCollection);
});

/**
 * Get Collection
 */
router.get("/get_collection", async (req, res) => {
  const { useremail, token } = req.query;

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

/**
 * Create Master Json
 */
router.post("/create_master_json_template", async (req, res) => {
  const { useremail, token, collectionId, templateId } = req.body;

  const templatePayload = JSON.stringify({
    template_label: templateId,
    collection_name: collectionId,
  });

  let response;

  try {
    response = await axios.post(
      "http://20.51.121.137:5000/api/create_master_json",
      templatePayload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    res.status(500).send({ erroMsg: "template creation error" });
    return;
  }

  res
    .status(200)
    .send("Template creation started successfully " + response.data);
});

router.post("/upload_qdrant/:uploadType", async (req, res) => {
  const uploadType = req.params.uploadType;
  const { model_type, collection_name, useremail, token } = req.body;
  const file = req.files.file;
  const formData = new FormData();
  const fileBlob = new Blob([file.data], { type: file.mimetype });
  const fileName = file.name;
  const fileId = file.name;

  // for node db
  // const assestDetails = await dao.get(
  //   `Select * FROM ASSETS where id=? AND type=? AND collection=?`,
  //   [fileId, uploadType, collection_name]
  // );

  // if (assestDetails.length) {
  //   return res.status(400).send({
  //     error_msg: "Assest already exist, Please upload different assest",
  //   });
  // }

  formData.append("file", fileBlob, fileId);
  formData.append("model_type", model_type);
  formData.append("collection_name", collection_name + "_" + model_type);

  try {
    response = await axios.post(
      `http://20.51.121.137:5000/api/${uploadType}_upload_qdrant`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  } catch (error) {
    res.status(500).send({
      erroMsg: `Error in ${uploadType} upload: ${error.response.data}`,
    });
    return;
  }

  // for node db
  // create file name in sqlite
  // let insertedFile;
  // try {
  //   insertedFile = await dao.run(
  //     `INSERT INTO ASSETS (id, name, collection, type) VALUES (?, ?, ?, ?)`,
  //     [fileId, fileName, collection_name, uploadType]
  //   );
  // } catch (error) {
  //   console.log(error);
  // }
  console.log(response.data);
  res.status(201).send({ msg: response.data });
});

router.get("/get_assest", async (req, res) => {
  const { collection_name, assestType, useremail, token } = req.query;
  // const assestDetails = await dao.get(
  //   `Select * FROM ASSETS where collection=? AND type=?`,
  //   [collection_name, assestType]
  // );

  const urlEndpoint =
    assestType === "file" ? "get_all_filenames" : "get_all_folders";
  const payload = JSON.stringify({
    collection_name: collection_name,
  });
  console.log(urlEndpoint);
  try {
    response = await axios.post(
      `http://20.51.121.137:5000/api/${urlEndpoint}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    res.status(500).send({
      erroMsg: `Error in fetching ${assestType} upload: ${error.response.data}`,
    });
    return;
  }
  const assestDetails = response.data.map((item) => {
    return {
      id: item,
      name: item,
      collection: collection_name,
      type: assestType,
    };
  });
  res.status(200).send(assestDetails);
});

router.post("/delete_qdrant/:deleteType", async (req, res) => {
  const deleteType = req.params.deleteType;
  const { fileId, collection_name, useremail, token, model_type } = req.body;

  const deletePayload = JSON.stringify({
    filename: fileId,
    collection_name: collection_name + "_" + model_type,
  });

  let response;

  try {
    response = await axios.post(
      `http://20.51.121.137:5000/api/delete_${deleteType}`,
      deletePayload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    res.status(500).send({ erroMsg: "Error in deleting " + deleteType });
    return;
  }

  if (!response.data) {
    res.status(500).send({ erroMsg: "Error in deleting " + deleteType });
    return;
  }

  // delete file details from node server
  // DELETE FROM Customers WHERE CustomerName='Alfreds Futterkiste';

  // create file name in sqlite
  // const deletedAssest = await dao.run(`DELETE FROM ASSETS WHERE id=?`, [
  //   fileId,
  // ]);

  res.status(200).send({ msg: "Deleted successfully " + response.data });
});

router.get("/get_relevant_docs", async (req, res) => {
  const {
    query,
    no_of_source,
    user_prompt,
    model_type,
    collection_name,
    reset_memory,
    search_type,
    token,
    useremail,
    template_label,
  } = req.query;
  let reponse;

  try {
    const rel_doc_payload = JSON.stringify({
      query,
      no_of_source,
      user_prompt,
      model_type,
      collection_name,
      reset_memory,
      search_type,
      template_label,
    });
    response = await axios.post(
      "http://20.51.121.137:5000/api/get_relevant_docs",
      rel_doc_payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    res.status(500).send("Unable to find relevant docs");
    return;
  }

  res.status(200).send(response.data);
});

router.get("/get_answer", async (req, res) => {
  const {
    query,
    no_of_source,
    user_prompt,
    model_type,
    collection_name,
    reset_memory,
    search_type,
    token,
    useremail,
    template_label,
  } = req.query;
  let reponse;

  const get_ans_body = JSON.stringify({
    query,
    no_of_source,
    user_prompt,
    model_type,
    collection_name,
    reset_memory,
    search_type,
    template_label,
  });
  try {
    response = await axios.post(
      "http://20.51.121.137:5000/api/get_answer",
      get_ans_body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send("Unable to get answer");
    return;
  }

  res.status(200).send(response.data);
});
module.exports = router;
