import React, { useState } from 'react';

const UnitForm = ({ onSubmit, initialData }) => {
  const [unitName, setUnitName] = useState(initialData ? initialData.name : '');
  const [unitDescription, setUnitDescription] = useState(initialData ? initialData.description : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name: unitName, description: unitDescription });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="unitName">Unit Name</label>
        <input
          type="text"
          id="unitName"
          value={unitName}
          onChange={(e) => setUnitName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="unitDescription">Unit Description</label>
        <textarea
          id="unitDescription"
          value={unitDescription}
          onChange={(e) => setUnitDescription(e.target.value)}
          required
        />
      </div>
      <button type="submit">Save Unit</button>
    </form>
  );
};

export default UnitForm;