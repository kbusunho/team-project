import React, { useState, useEffect } from "react";
import BucketForm from "./components/BucketForm";
import BucketList from "./components/BucketList";
import Header from "./components/Header";
import { api, ensureGuestAuth } from "./lib/api";  // ✅ Axios 가져오기
import "./App.css";

const users = [
  { uid: "user1", name: "최선호" },
  { uid: "user2", name: "하다민" },
  { uid: "user3", name: "홍유민" },
];

function App() {
  const [todos, setTodos] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

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
    const fetchTodos = async () => {
      try {
        await ensureGuestAuth();  // ✅ 앱 로드 시 게스트 auth 보장
        const { data } = await api.get('/api/buckets');
        setTodos(data);
      } catch (err) {
        console.error("데이터 불러오기 실패:", err);
      }
    };
    fetchTodos();
  }, []);

  const onCreate = async (text) => {
    if (!selectedUser) return;

    const newBucket = {
      name: selectedUser.name,
      goal: text,
      text,
      uid: selectedUser.uid,  // ✅ uid 포함
      isCompleted: false,
    };

    try {
      const { data } = await api.post('/api/buckets', newBucket);
      setTodos((prev) => [data, ...prev]);
    } catch (err) {
      console.error("버킷 생성 실패:", err);
    }
  };

  const onDelete = async (id) => {
    try {
      await api.delete(`/api/buckets/${id}`);
      setTodos((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  };

  const onUpdate = async (id, newText) => {
    try {
      const { data } = await api.patch(`/api/buckets/${id}/text`, { text: newText });
      const updated = data.bucket || data;
      setTodos((prev) =>
        prev.map((t) => (t._id === id ? updated : t))
      );
    } catch (err) {
      console.error("수정 실패:", err);
    }
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