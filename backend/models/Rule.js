const mongoose = require('mongoose');

const RuleSchema = new mongoose.Schema({
    ruleString: { type: String, required: true },
    astRepresentation: { type: Object, required: true }
});

module.exports = mongoose.model('Rule', RuleSchema);