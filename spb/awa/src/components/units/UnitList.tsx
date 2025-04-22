import React from 'react';

const UnitList: React.FC = () => {
  // Sample data for units
  const units = [
    { id: 1, name: 'Unit A' },
    { id: 2, name: 'Unit B' },
    { id: 3, name: 'Unit C' },
  ];

  return (
    <div>
      <h2>Unit List</h2>
      <ul>
        {units.map(unit => (
          <li key={unit.id}>{unit.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default UnitList;