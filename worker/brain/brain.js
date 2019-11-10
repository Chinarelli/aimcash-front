const fs                    = require('fs');
const brain                 = require('brain.js');
const data                  = require('./data');
const treinada              = require('./treinada');
const produtosService       = require('../../services/produtosService');
const departamentosService  = require('../../services/departamentosService');
const slug                  = require('slug.js');

let net = new brain.NeuralNetwork();
let trainedNet;
let longest;

prepare = () => {
    return new Promise((resolve, reject) => {
        console.log(`Wait...`);
        produtosService.findAll().then((produtos) => {
            departamentosService.findAll().then((departamentos) => {
                let produtosData = [];

                for(let i = 0; i < produtos.length; i++) {
                    console.log(produtos[i]);
                    produtosData.push({
                        "input": slug(produtos[i].input),
                        "output": {[produtos[i].output]: 1}
                    });
                }

                fs.writeFileSync(`./worker/brain/data.json`, JSON.stringify(produtosData));
                resolve(produtosData);
            }).catch((error) => {
                console.log(error);
            });
        }).catch((error) => {
            reject(error);
        });
    });
}

train = (data) => {
    return new Promise((resolve, reject) => {
        net.trainAsync(processTrainingData(data), {
            iterations: 2000,
            errorThresh: 0.005,
            log: true,
            logPeriod: 1,
            learningRate: 0.3,
            momentum: 0.1,
            callback: null,
            callbackPeriod: 10,
            timeout: Infinity
        }).then((response) => {
            fs.writeFileSync(`./worker/brain/treinada.json`, JSON.stringify(net.toJSON()));
            fs.writeFileSync(`./worker/brain/resumo.json`, JSON.stringify(response));
            trainedNet = net.toFunction();
            resolve(response);
        }).catch((error) => {
            reject(error);
        });
    });
}

encode = (arg) => {
    return arg.split('').map(x => (x.charCodeAt(0) / 400));
}

processTrainingData = (data) => {
    const processedValues = data.map(d => {
        return {
            input: encode(d.input),
            output: d.output
        }
    });
    
    return processedValues;
}

getTrainingData = () => {
    longest = data.reduce((a, b) => a.input.length > b.input.length ? a : b).input.length;

    for (let i = 0; i < data.length; i++) {
        data[i].input = adjustSize(data[i].input);
    }

    return data;
}

adjustSize = (string) => {
    while (string.length < longest) {
        string += ' ';
    }

    return string;  
}

get = (value) => {
    return trainedNet(encode(adjustSize(slug(value))));
}

trainData = () => {
    return new Promise((resolve, reject) => {
        train(getTrainingData()).then((response) => {
            resolve(response);
        }).catch((error) => {
            reject(error);
        });
    });
    
}

module.exports = {
    prepare: prepare,
    train: trainData,
    get: get
}