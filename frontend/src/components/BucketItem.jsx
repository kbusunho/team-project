import React, { useState } from "react";
import "./BucketItem.css";

const BucketItem = ({ todo, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(todo._id, editText.trim());
      setIsEditing(false);
    }
  };

  return (
    <div className="bucket-item">
      {isEditing ? (
        <>
          <input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <button className="btn btn-save" onClick={handleSave}>
            저장
          </button>
          <button
            className="btn btn-cancel"
            onClick={() => {
              setIsEditing(false);
              setEditText(todo.text);
            }}
          >
            취소
          </button>
        </>
      ) : (
        <>
          <span>{todo.text}</span>
          <div className="btns">
            <button className="btn btn-edit" onClick={() => setIsEditing(true)}>
              수정
            </button>
            <button
              className="btn btn-delete"
              onClick={() => onDelete(todo._id)}
            >
              삭제
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BucketItem;
