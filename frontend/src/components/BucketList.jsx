import React from "react";
import BucketItem from "./BucketItem";

const BucketList = ({ todos, onDelete, onUpdate }) => {
  return (
    <div className="bucket-list">
      {todos.length === 0 ? (
        <p className="empty-msg">버킷리스트를 입력해주세요!!!</p>
      ) : (
        todos.map((todo) => (
          <BucketItem
            key={todo._id}
            todo={todo}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))
      )}
    </div>
  );
};

export default BucketList;