const { ENCRYPTION_KEY } = process.env
const CryptoJS = require("crypto-js")


function decryptData(data) {
  let decryptedData = [];
  data.forEach((d) => {
    const bytes = CryptoJS.AES.decrypt(d, ENCRYPTION_KEY)
    decryptedData.push(bytes.toString(CryptoJS.enc.Utf8));
  })
  return decryptedData
}

module.exports = { decryptData }