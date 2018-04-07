const axios = require('axios')
const fs = require('fs')
const sexes = [ 'm', 'f']

function getImageData(url) {
  return axios.request({
    responseType: 'arraybuffer',
    url: url,
    method: 'GET',
    headers: {
      'Content-Type': 'image/jpg',
    }
  }).then((result) => {
    return result.data
  })
}

function saveImage(raceId, sex, picId, fileData) {
  const outputDir = `./races/${raceId}`
  const outputFilename = `${outputDir}/npc_${sex}${picId}.jpg`
  if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir);
  }
  fs.writeFileSync(outputFilename, fileData)
}

async function runBatch() {
  for (raceId = 0; raceId < 100; raceId++) {
    for (sex of sexes) {
      for (picId = 1; picId < 10; picId++) {
        let fileData = await getImageData(`http://img.swcombine.com/races/${raceId}/npc_${sex}${picId}.jpg`).then(response => {
          console.log('got a response')
          if (!response) {
            return;
          } else {
              saveImage(raceId, sex, picId, response)
          }
        }).catch(error => {
          console.log(error)
          return;
        })
      }
    }
  }
}

runBatch()
