// 📁 src/components/SearchBar.tsx
import React from 'react';

interface SearchBarProps {
  query: string;
  setQuery: (val: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ query, setQuery }) => {
  return (
    <div style={{ marginBottom: '30px', width: '100%' }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <span style={{ position: 'absolute', left: '15px', color: '#9ca3af', fontSize: '18px' }}>
          🔍
        </span>
        <input
          type="text"
          placeholder="Search for hardware specs (e.g., RTX, Mouse, Keyboard)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '14px 14px 14px 45px',
            backgroundColor: '#16171d',
            border: '1px solid #2e303a',
            borderRadius: '8px',
            color: '#f3f4f6',
            fontSize: '16px',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s ease'
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = '#c084fc'}
          onBlur={(e) => e.currentTarget.style.borderColor = '#2e303a'}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            style={{ position: 'absolute', right: '15px', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '16px' }}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};