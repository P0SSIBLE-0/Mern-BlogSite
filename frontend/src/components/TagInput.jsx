import React, { useState } from 'react';

const TagInput = ({tags, setTags, inputValue, setInputValue}) => {

  const handleAddTag = (e) => {
    e.preventDefault();
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
      setInputValue('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter(tag => tag !== tagToDelete));
  };

  return (
    <div>
      <form onSubmit={handleAddTag}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a tag"
        />
        <button type="submit">Add Tag</button>
      </form>
      <div>
        {tags.map((tag, index) => (
          <span key={index} style={{ margin: '5px', padding: '5px', border: '1px solid #ccc', borderRadius: '3px' }}>
            {tag}
            <button onClick={() => handleDeleteTag(tag)} style={{ marginLeft: '5px', cursor: 'pointer' }}>x</button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagInput;
