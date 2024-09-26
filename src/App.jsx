import React from 'react';
import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState({
    "rows": [
      {
        "id": "electronics",
        "label": "Electronics",
        "value": 0, 
        "originalValue": 0,
        "children": [
          {
            "id": "phones",
            "label": "Phones",
            "value": 800,
            "originalValue": 800,
          },
          {
            "id": "laptops",
            "label": "Laptops",
            "value": 700,
            "originalValue": 700,
          }
        ]
      },
      {
        "id": "furniture",
        "label": "Furniture",
        "value": 0, 
        "originalValue": 1000,
        "children": [
          {
            "id": "tables",
            "label": "Tables",
            "value": 400,
            "originalValue": 400,
          },
          {
            "id": "chairs",
            "label": "Chairs",
            "value": 700,
            "originalValue": 700,
          }
        ]
      }
    ]
  });

  const [inputValues, setInputValues] = useState({});


  const updateParentValues = (data) => {
    const updatedRows = data.rows.map(row => {
      if (row.children) {
        const totalChildValue = row.children.reduce((acc, child) => acc + child.value, 0);
        return {
          ...row,
          value: totalChildValue
        };
      }
      return row;
    });
    return { ...data, rows: updatedRows };
  };

  useEffect(() => {
    const updatedData = updateParentValues(data);
    setData(updatedData);
  }, []);

  const handleInputChange = (e, id) => {
    const value = e.target.value;
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [id]: value
    }));
  };

  const handleAllocationPercent = (id, percentage) => {
    const updatedRows = data.rows.map(row => {
      if (row.id === id) {
        row.value = row.value + (row.value * (percentage / 100));
        row.children.forEach(child => {
          child.value = child.value + (child.value * (percentage / 100));
        });
      } else if (row.children?.find(child => child.id === id)) {
        const child = row.children.find(child => child.id === id);
        child.value = child.value + (child.value * (percentage / 100));
      }
      return row;
    });
    const updatedData = updateParentValues({ rows: updatedRows });
    setData(updatedData);
  };


  const handleAllocationValue = (id, newValue) => {
    const updatedRows = data.rows.map(row => {
      if (row.id === id) {
        const newParentValue = Number(newValue);
        const oldParentValue = row.value;
        const variance = ((newParentValue - oldParentValue) / oldParentValue) * 100;
        row.value = newParentValue;
        row.originalValue = oldParentValue;
  
        const totalChildValue = row.children.reduce((acc, child) => acc + child.value, 0);
        row.children.forEach(child => {
          const contributionPercentage = (child.value / totalChildValue) * 100;
          const updatedChildValue = (contributionPercentage / 100) * newParentValue;
          child.value = Number(updatedChildValue.toFixed(2)); 
          child.variance = ((child.value - child.originalValue) / child.originalValue) * 100; 
        });
  
        
        return { ...row, variance: variance.toFixed(2) }; 
      }


      if (row.children?.find(child => child.id === id)) {
                  const childOrParent = row.id === id ? row : row.children.find(child => child.id === id);
                  const updatedValue = Number(childOrParent.value) + Number(newValue);
                  console.log(newValue, childOrParent.value)
                  childOrParent.value = updatedValue;
                }
                      
      return row;
    });
  
    const updatedData = updateParentValues({ rows: updatedRows });
    setData(updatedData);
  };
  
    
  const calculateVariance = (originalValue, newValue) => {
    if (originalValue === 0) return '';
    return (((newValue - originalValue) / originalValue) * 100).toFixed(2);
  };

  return (
    <div className="App">
      Sale App
      <table>
        <thead>
          <tr>
            <th>Label</th>
            <th>Value</th>
            <th>Input</th>
            <th>Allocation %</th>
            <th>Allocation Val</th>
            <th>Variance %</th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map(item => (
            <React.Fragment key={item.id}>
              <tr>
                <td>{item.label}</td>
                <td>{item.value.toFixed(2)}</td>
                <td>
                  <input
                    type="text"
                    value={inputValues[item.id] || ''}
                    onChange={(e) => handleInputChange(e, item.id)}
                  />
                </td>
                <td>
                  <button onClick={() => handleAllocationPercent(item.id, inputValues[item.id] || 0)}>
                    Apply %
                  </button>
                </td>
                <td>
                  <button onClick={() => handleAllocationValue(item.id, inputValues[item.id] || 0)}>
                    Apply Value
                  </button>
                </td>
                <td>{calculateVariance(item.originalValue, item.value)}%</td>
              </tr>
              {item.children && item.children.map(child => (
                <tr key={child.id}>
                  <td>-- {child.label}</td>
                  <td>{child.value.toFixed(2)}</td>
                  <td>
                    <input
                      type="text"
                      value={inputValues[child.id] || ''}
                      onChange={(e) => handleInputChange(e, child.id)}
                    />
                  </td>
                  <td>
                    <button onClick={() => handleAllocationPercent(child.id, inputValues[child.id] || 0)}>
                      Apply %
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleAllocationValue(child.id, inputValues[child.id] || 0)}>
                      Apply Value
                    </button>
                  </td>
                  <td>{calculateVariance(child.originalValue, child.value)}%</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        
        </tbody>
      </table>
    </div>
  );
}

export default App;



