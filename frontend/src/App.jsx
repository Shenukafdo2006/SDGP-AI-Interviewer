import React, { useState } from 'react';
import CVMaker from './components/CVMaker';
import './App.css';

function App() {
  const [showCVMaker, setShowCVMaker] = useState(true);

  return (
    <div className="App">
      {showCVMaker && <CVMaker onBack={() => setShowCVMaker(false)} />}
    </div>
  );
}

export default App;