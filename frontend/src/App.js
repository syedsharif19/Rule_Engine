import React, { useState } from 'react';

function App() {
  const [rule, setRule] = useState('');
  const [ruleId, setRuleId] = useState('');
  const [userData, setUserData] = useState('');
  const [result, setResult] = useState(null);

  const createRule = async () => {
    try {
      const response = await fetch('http://localhost:3000/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ruleString: rule })
      });

      if (!response.ok) throw new Error('Failed to create rule');

      const data = await response.json();
      setRuleId(data.rule._id);
    } catch (error) {
      alert(error.message);
    }
  };

  const evaluateRule = async () => {
    try {
      const response = await fetch(http://localhost:3000/rules/${ruleId}/evaluate, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userData: JSON.parse(userData) })
      });

      if (!response.ok) throw new Error('Failed to evaluate rule');

      const data = await response.json();
      setResult(data.eligible);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="App">
      <h1>Rule Engine</h1>

      <div>
        <h2>Create Rule</h2>
        <input 
          type="text" 
          value={rule} 
          onChange={(e) => setRule(e.target.value)} 
          placeholder="Enter rule" 
        />
        <button onClick={createRule}>Create Rule</button>
        {ruleId && <p>Rule ID: {ruleId}</p>}
      </div>

      <div>
        <h2>Evaluate Rule</h2>
        <textarea 
          value={userData} 
          onChange={(e) => setUserData(e.target.value)} 
          placeholder='Enter user data (JSON format)' 
        />
        <button onClick={evaluateRule}>Evaluate</button>
        {result !== null && <p>Eligible: {result ? 'Yes' : 'No'}</p>}
      </div>
    </div>
  );
}

export default App;