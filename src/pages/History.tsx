import React from 'react';

interface HistoryProps {
  searchTerms: string[];
  setSearchTerm: (term: string) => void;
}

const History: React.FC<HistoryProps> = ({ searchTerms, setSearchTerm }) => {
  const handleSearchTermClick = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div>
      <h2>Search Historyhhhhhhhhhhh</h2>
      <ul>
        {searchTerms.map((term, index) => (
          <li key={index} onClick={() => handleSearchTermClick(term)}>
            {term}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;
