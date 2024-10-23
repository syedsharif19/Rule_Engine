const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Rule = require('./models/Rule');
const { createAST, evaluateRule } = require('./utils/astEngine');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ruleEngine', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Create a new rule
app.post('/rules', async (req, res) => {
    try {
        const { ruleString } = req.body;
        const ast = createAST(ruleString);

        const newRule = new Rule({ ruleString, astRepresentation: ast });
        await newRule.save();

        res.status(201).json({ message: 'Rule created successfully', rule: newRule });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Evaluate a rule
app.post('/rules/:id/evaluate', async (req, res) => {
    try {
        const { id } = req.params;
        const { userData } = req.body;

        const rule = await Rule.findById(id);
        if (!rule) return res.status(404).json({ error: 'Rule not found' });

        const result = evaluateRule(rule.astRepresentation, userData);
        res.json({ eligible: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});