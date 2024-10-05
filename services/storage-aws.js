const aws = require("aws-sdk");
const multerS3 = require("multer-s3");

const endpoint = new aws.Endpoint("sgp1.digitaloceanspaces.com");

const s3 = new aws.S3({
  endpoint: endpoint,
  credentials: {
    accessKeyId: process.env.SPACES_ACCESS_KEY,
    secretAccessKey: process.env.SPACES_SECRET_KEY,
  },
});

const storageSpaces = (directory) =>
  multerS3({
    s3,
    bucket: process.env.SPACES_BUCKET + directory,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const filePath =
        new Date().toISOString().replace(/:/g, "-") + file.originalname;
      cb(null, filePath);
    },
  });

module.exports = { storageSpaces, s3 };
