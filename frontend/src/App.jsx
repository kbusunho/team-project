import React, { useState, useEffect } from "react";
import BucketForm from "./components/BucketForm";
import BucketList from "./components/BucketList";
import Header from "./components/Header";
import "./App.css";

const users = [
  { uid: "user1", name: "최선호" },
  { uid: "user2", name: "하다민" },
  { uid: "user3", name: "홍유민" },
];

function App() {
  const [todos, setTodos] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const API_URL = "http://localhost:3000/api/buckets";
  

  useEffect(() => {
    const savedUser = localStorage.getItem("selectedUser");
    if (savedUser) {
      setSelectedUser(JSON.parse(savedUser));
    }
  }, []);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    localStorage.setItem("selectedUser", JSON.stringify(user));
  };

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error("데이터 불러오기 실패:", err));
  }, []);

  const onCreate = (text) => {
    if (!selectedUser) return;

    const newBucket = {
      name: selectedUser.name,
      goal: text,
      text,
      uid: selectedUser.uid,
      isCompleted: false,
    };

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBucket),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.uid) data.uid = selectedUser.uid;
        setTodos((prev) => [data, ...prev]);
      })
      .catch((err) => console.error("버킷 생성 실패:", err));
  };

  const onDelete = (id) => {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then(() => setTodos((prev) => prev.filter((t) => t._id !== id)))
      .catch((err) => console.error("삭제 실패:", err));
  };

  const onUpdate = (id, newText) => {
    fetch(`${API_URL}/${id}/text`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newText }),
    })
      .then((res) => res.json())
      .then((data) => {
        const updated = data.bucket || data; // 응답 구조에 맞춰 안전 처리
        setTodos((prev) =>
          prev.map((t) => (t._id === id ? updated : t))
        );
      })
      .catch((err) => console.error("수정 실패:", err));
  };

  const filteredTodos = selectedUser
    ? todos.filter((t) => t.uid === selectedUser.uid)
    : [];

  return (
    <div className="App">
      <Header
        users={users}
        selectedUser={selectedUser}
        onSelectUser={handleUserSelect}
      />
      <main>
        <BucketForm onCreate={onCreate} selectedUser={selectedUser} />
        <BucketList
          todos={filteredTodos}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      </main>
    </div>
  );
}

export default App;
