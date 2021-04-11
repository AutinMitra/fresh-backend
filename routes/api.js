const express = require('express')
const multer = require('multer')
const {v4} = require('uuid')
const UploadModel = require('../schemas/upload')
const clustering = require('density-clustering')

const router = express.Router()

// Init multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'imageUploads/')
  },
  filename: (req, file, cb) => {
    // uuid all the things, anti-duplicates
    const split = file.originalname.split('.')
    cb(null, v4() + '.' + split[split.length-1])
  }
})
const upload = multer({storage})

// Routes
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // what is sanitization??? it's a hackathon :^)-|-<

    const upload = UploadModel({
      lat: req.body.lat,
      lng: req.body.lng,
      label: req.body.label,
      imagePath: req.file.path,
      uuid: v4()
    })
    await upload.save()

    res.send(req.file)
  } catch(err) {
    console.log(err)
    res.sendStatus(400)
  }
})

router.get('/allInfo', async (req, res) => {
  return res.send(await getAllData())
})

router.get('/cluster', async (req, res) => {
  let data = await getAllData();
  let dataSet = [];

  data.forEach((obj) => {
    dataSet.push([obj.lat, obj.lng])
  })

  var clusters;

  switch (req.query.algo) {
    // Use dbscan clustering
    case "dbscan":
      if (!req.query.radius || !req.query.radius || isNaN(req.query.radius) || isNaN(req.query.neighborhoodSize))
        return res.status(400).send({error: "Please provide the radius and neighborhood size!"})
      
      clusters = dbScan(dataSet, req.query.radius, req.query.neighborhoodSize)
      break

    // Use optics algorithm
    case "optics":
      if (!req.query.radius || !req.query.radius || isNaN(req.query.radius) || isNaN(req.query.neighborhoodSize))
        return res.status(400).send({error: "Please provide the radius and neighborhood size!"})
      
      clusters = optics(dataSet, req.query.radius, req.query.neighborhoodSize)
      break

    // Use kmeans clustering
    default:
      if (!req.query.numClusters || isNaN(req.query.numClusters))
        return res.status(400).send({error: "Please provide the number of clusters"})

      clusters = kMeans(dataSet, req.query.numClusters)
  }

  let finalRes = []

  clusters.forEach((cluster) => {
    finalRes.push(cluster.map((ind) => data[ind]))
  })

  return res.send(finalRes)
})

function dbScan(dataSet, radius, neighborhoodSize) {
  const algo = new clustering.DBSCAN()
  return algo.run(dataSet, radius, neighborhoodSize)
}

function optics(dataSet, radius, neighborhoodSize) {
  const algo = new clustering.OPTICS()
  return algo.run(dataSet, radius, neighborhoodSize)
}

function kMeans(dataSet, numClusters) {
  const algo = new clustering.OPTICS()
  return algo.run(dataSet, numClusters)
}

async function getAllData() {
  let allInfo = []

  await UploadModel.find({}, (err, uploads) => {
    uploads.forEach((obj) => {
      let {
        imagePath,
        lat,
        lng,
        label,
        uuid,
      } = obj

      allInfo.push({imagePath, lat, lng, label, uuid})
    })
  })

  return allInfo
}

module.exports = router
