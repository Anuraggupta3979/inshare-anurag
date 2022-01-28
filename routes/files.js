const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const File = require("../models/file");
const { v4: uuidv4 } = require("uuid");
//basic configrrutaion of multer

let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqeName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqeName);
  },
});

let upload = multer({
  storage: storage,
  limit: { fileSize: 1000000 * 100 },
}).single("myfile");
router.post("/", (req, res) => {
  //store file
  upload(req, res, async (err) => {
    //validate request
    if (!req.file) {
      return res.json({ error: "All fields are required" });
    }

    if (err) {
      return res.status(500).send({ error: err.message });
    }
    //store into database
    const file = new File({
      filename: req.file.filename,
      uuid: uuidv4(),
      path: req.file.path,
      size: req.file.size,
    });
    const response = await file.save();
    console.log(req.file);
    return res.json({
      // file: `${process.env.APP_BASE_URL}`,

      file: `http://localhost:3000/files/${response.uuid}`,
    });
  });

  //respose ->link
});

router.post("/send", async (req, res) => {
  const { uuid, emailTo, emailFrom } = req.body;
  //validate request
  if (!uuid || !emailTo || !emailFrom) {
    return res.status(422).send({ error: "All fields are requires." });
  }
  //Get data from database
  const file = await File.findOne({ uuid: uuid });
  if (file.sender) {
    return res.status(422).send({ error: "Emaiol Already Sent." });
  }
  file.sender = emailFrom;
  file.receiver = emailTo;
  const responce = await file.save();
  //send email
  const sendMail = require("../services/emailService");
  sendMail({
    from: emailFrom,
    to: emailTo,
    subject: "inShare file sharing",
    text: `${emailFrom} shared a file with you
    `,
    html: require("../services/emailTemplate")({
      emailFrom: emailFrom,
      downloadLink: `http://localhost:3000/files/${file.uuid}`,
      size: parseInt(file.size / 1000) + "KB",
      expires: "24 hours",
    }),
  });
  return res.send({ success: true });
});

module.exports = router;
