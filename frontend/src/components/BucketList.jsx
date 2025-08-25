import React from "react";
import BucketItem from "./BucketItem";

const BucketList = ({ buckets, onDelete, onUpdate }) => {
  console.log("Rendering BucketList with buckets:", buckets); // 렌더링 확인 로그
  return (
    <div className="bucket-list">
      {buckets.length === 0 ? (
        <p className="empty-msg">버킷리스트를 입력해주세요!!!</p>
      ) : (
        buckets.map((bucket) => (
          <BucketItem
            key={bucket._id} // key를 bucket._id로 유지
            bucket={bucket} // prop 이름 통일
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))
      )}
    </div>
  );
};

export default BucketList;