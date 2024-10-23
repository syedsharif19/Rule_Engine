class Node {
    constructor(nodeType, left = null, right = null, value = null) {
        this.nodeType = nodeType; 
        this.left = left; 
        this.right = right;
        this.value = value;
    }
}

function parseCondition(condition) {
    const match = condition.match(/(\w+)\s*(==|>|<|>=|<=)\s*([\w']+)/);
    if (match) {
        return match.slice(1);
    } else {
        throw new Error(Invalid condition: ${condition});
    }
}

function createAST(ruleString) {
    if (ruleString.includes(" AND ")) {
        const conditions = ruleString.split(" AND ");
        const left = createAST(conditions[0].trim());
        const right = createAST(conditions[1].trim());
        return new Node("operator", left, right, "AND");
    } else if (ruleString.includes(" OR ")) {
        const conditions = ruleString.split(" OR ");
        const left = createAST(conditions[0].trim());
        const right = createAST(conditions[1].trim());
        return new Node("operator", left, right, "OR");
    } else {
        const [leftOperand, operator, rightOperand] = parseCondition(ruleString);
        return new Node("operand", null, null, { leftOperand, operator, rightOperand });
    }
}

function evaluateRule(astNode, userData) {
    if (astNode.nodeType === "operand") {
        const { leftOperand, operator, rightOperand } = astNode.value;
        const userValue = userData[leftOperand];

        // Handle undefined or unexpected user values
        if (userValue === undefined) {
            throw new Error(User data for ${leftOperand} is undefined);
        }

        switch (operator) {
            case "==":
                return userValue == rightOperand;
            case ">":
                return userValue > rightOperand;
            case "<":
                return userValue < rightOperand;
            case ">=":
                return userValue >= rightOperand;
            case "<=":
                return userValue <= rightOperand;
            default:
                throw new Error(Unknown operator: ${operator});
        }
    } else if (astNode.nodeType === "operator") {
        const leftResult = evaluateRule(astNode.left, userData);
        const rightResult = evaluateRule(astNode.right, userData);

        if (astNode.value === "AND") {
            return leftResult && rightResult;
        } else if (astNode.value === "OR") {
            return leftResult || rightResult;
        }
    }
    return false;
}

module.exports = { createAST, evaluateRule };