import React, { useState } from 'react';

import { ChevronDown, ChevronRight } from 'lucide-react';

import type { FolderWithChildren } from '../../api/types';

interface FolderOptionProps {
  folder: FolderWithChildren;
  level: number;
  selectedFolderId: string | undefined;
  onSelect: (folderId: string) => void;
}

const FolderOption = ({ folder, level, selectedFolderId, onSelect }: FolderOptionProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div>
      <div
        className={`flex items-center px-3 py-2 cursor-pointer hover:bg-lightBg transition-colors duration-200 ${
          selectedFolderId === folder.id ? 'bg-primary/10 text-primary' : 'text-mainText'
        }`}
        style={{ paddingLeft: `${(level + 1) * 1}rem` }}
        onClick={() => onSelect(folder.id)}
      >
        {folder.children.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-1 hover:bg-lightBorder rounded mr-1"
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        )}
        <span className="truncate">{folder.name}</span>
      </div>

      {isExpanded && folder.children.length > 0 && (
        <div>
          {folder.children.map((child) => (
            <FolderOption key={child.id} folder={child} level={level + 1} selectedFolderId={selectedFolderId} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FolderOption;
