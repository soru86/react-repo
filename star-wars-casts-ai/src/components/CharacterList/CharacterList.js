import React, { useMemo } from 'react';
import { List, AutoSizer } from 'react-virtualized';
import 'react-virtualized/styles.css';
import Pagination from '../Pagination/Pagination';
import './CharacterList.css';

const ITEMS_PER_PAGE = 10;

const CharacterList = ({ characters, sortField, sortDirection, searchTerm, onSort, currentPage = 1, onPageChange }) => {
  const sortedAndFilteredCharacters = useMemo(() => {
    let filtered = characters.filter((character) => {
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase().trim();
      return (
        character.name?.toLowerCase().includes(term) ||
        character.gender?.toLowerCase().includes(term) ||
        character.birth_year?.toLowerCase().includes(term) ||
        character.height?.toLowerCase().includes(term) ||
        character.mass?.toLowerCase().includes(term)
      );
    });

    if (!sortField) return filtered;

    return [...filtered].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'height' || sortField === 'mass') {
        aValue = aValue === 'unknown' ? 0 : parseInt(aValue.replace(/,/g, ''), 10);
        bValue = bValue === 'unknown' ? 0 : parseInt(bValue.replace(/,/g, ''), 10);
      } else {
        aValue = (aValue || '').toString().toLowerCase();
        bValue = (bValue || '').toString().toLowerCase();
      }

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [characters, sortField, sortDirection, searchTerm]);

  // Pagination logic
  const totalItems = sortedAndFilteredCharacters.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  // Ensure currentPage is within valid range
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedCharacters = sortedAndFilteredCharacters.slice(startIndex, endIndex);

  const rowRenderer = ({ index, key, style }) => {
    const character = paginatedCharacters[index];
    if (!character) return null;

    return (
      <div key={key} style={style} className="character-row">
        <div className="character-card">
          <div className="character-header">
            <h3 className="character-name">{character.name}</h3>
          </div>
          <div className="character-details">
            <div className="detail-item">
              <span className="detail-label">Gender:</span>
              <span className="detail-value">{character.gender || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Birth Year:</span>
              <span className="detail-value">{character.birth_year || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Height:</span>
              <span className="detail-value">{character.height || 'N/A'} cm</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Mass:</span>
              <span className="detail-value">{character.mass || 'N/A'} kg</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Hair Color:</span>
              <span className="detail-value">{character.hair_color || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Skin Color:</span>
              <span className="detail-value">{character.skin_color || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Eye Color:</span>
              <span className="detail-value">{character.eye_color || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return '⇅';
    }
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const handleSort = (field) => {
    if (sortField === field) {
      onSort(field, sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(field, 'asc');
    }
  };

  return (
    <div className="character-list-container">
      <div className="list-header">
        <div className="header-cell sortable" onClick={() => handleSort('name')}>
          Name {getSortIcon('name')}
        </div>
        <div className="header-cell sortable" onClick={() => handleSort('gender')}>
          Gender {getSortIcon('gender')}
        </div>
        <div className="header-cell sortable" onClick={() => handleSort('birth_year')}>
          Birth Year {getSortIcon('birth_year')}
        </div>
        <div className="header-cell sortable" onClick={() => handleSort('height')}>
          Height {getSortIcon('height')}
        </div>
        <div className="header-cell sortable" onClick={() => handleSort('mass')}>
          Mass {getSortIcon('mass')}
        </div>
      </div>
      <div className="list-content">
        {sortedAndFilteredCharacters.length === 0 ? (
          <div className="no-results">No characters found</div>
        ) : (
          <AutoSizer>
            {({ height, width }) => (
              <List
                width={width}
                height={height}
                rowCount={paginatedCharacters.length}
                rowHeight={200}
                rowRenderer={rowRenderer}
                overscanRowCount={3}
              />
            )}
          </AutoSizer>
        )}
      </div>
      {sortedAndFilteredCharacters.length > 0 && onPageChange && (
        <Pagination
          currentPage={validCurrentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={sortedAndFilteredCharacters.length}
        />
      )}
    </div>
  );
};

export default CharacterList;

