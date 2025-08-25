import React, { useState } from "react";
import "./BucketForm.css";

const BucketForm = ({ onCreate, selectedUser }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedUser) {
      alert("사용자를 먼저 선택해주세요.");
      return;
    }
    if (!input.trim()) return;
    onCreate(input);
    setInput("");
  };

  return (
    <form className="bucket-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="하고 싶은 것을 입력하세요"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button type="submit" className="btn-add">
        추가
      </button>
    </form>
  );
};

export default BucketForm;
