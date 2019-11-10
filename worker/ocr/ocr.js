const path = require('path');
const { TesseractWorker, OEM, PSM } = require('tesseract.js');
const image = path.resolve(__dirname, ('../../public/img/recibo.png'));
const tessWorker = new TesseractWorker();

console.log(`Reconhecendo ${image}`);

reconhecer = () => {
    return new Promise((resolve, reject) => {
        tessWorker.recognize(image, 'por', {
            tessedit_ocr_engine_mode: OEM.LSTM_ONLY,
            tessedit_pageseg_mode: PSM.PSM_SINGLE_COLUMN,
          }).progress((info) => {
              console.log(info);
          }).then((data) => {
              resolve(data.text);
          }).catch((error) => {
              reject(error)
          }).finally(() => {
            //   process.exit();
          });
    });
}

module.exports = {
    reconhecer: reconhecer
}