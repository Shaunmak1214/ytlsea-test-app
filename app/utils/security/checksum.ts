import Config from "app/config"
import CryptoJS from "crypto-js"

const secretKey = Config.CHECKSUM_KEY

const generateChecksum = (data: any) => {
  const stringData = JSON.stringify(data)
  return CryptoJS.HmacSHA256(stringData, secretKey).toString()
}

export default generateChecksum
