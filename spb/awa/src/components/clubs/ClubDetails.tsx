import React from 'react';

const ClubDetails: React.FC<{ club: { name: string; description: string; members: number } }> = ({ club }) => {
  return (
    <div className="club-details">
      <h2>{club.name}</h2>
      <p>{club.description}</p>
      <p>Members: {club.members}</p>
    </div>
  );
};

export default ClubDetails;