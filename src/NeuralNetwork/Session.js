const crypto = require('crypto');
const path = require("path");
const tf = require("@tensorflow/tfjs-node");
const use = require("@tensorflow-models/universal-sentence-encoder");

let model = undefined;
let sentenceEncoder = null;
let modelHistory = {};

async function loadDiskModel() {
    const modelJsonPath = path.resolve(__dirname, "..", "model", "model.json");
    return tf.loadLayersModel(tf.io.fileSystem(modelJsonPath));
}

module.exports = {
    history: function (id) {
        if (id && modelHistory[id]) {
            return modelHistory[id];
        }
        return Object.keys(modelHistory).map(key => ({
            id: key,
            ...modelHistory[key],
        }));
    },
    addModel(trainedModel, accuracy) {
        const id = crypto.randomBytes(16).toString('hex');
        modelHistory[id] = {
            model: trainedModel,
            json: typeof trainedModel?.toJSON === "function" ? trainedModel.toJSON() : null,
            weights: typeof trainedModel?.getWeights === "function" ? trainedModel.getWeights() : null,
            accuracy: accuracy,
        };
        model = trainedModel;
        return id;
    },
    setAsCurrentModel(id) {
        if (id && modelHistory[id]) {
            model = modelHistory[id].model;
        }
    },
    loadSentenceEncoder: async function() {
        if (!sentenceEncoder) {
            sentenceEncoder = await use.load();
          }
          return sentenceEncoder;
    },
    getModel: async function() {
        if (!model) {
            model = await loadDiskModel();
            this.addModel(model, "Default");
        }
        return model;
    },
    resetToDiskModel: async function() {
        const disk = await loadDiskModel();
        this.addModel(disk, "Disk");
        model = disk;
        return model;
    },
};
