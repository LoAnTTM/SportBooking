import React from 'react';

const ClubList = () => {
  const clubs = [
    { id: 1, name: 'Club A' },
    { id: 2, name: 'Club B' },
    { id: 3, name: 'Club C' },
  ];

  return (
    <div>
      <h2>Club List</h2>
      <ul>
        {clubs.map(club => (
          <li key={club.id}>{club.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ClubList;