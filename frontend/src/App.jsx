import React, { useState, useEffect } from "react";
import BucketForm from "./components/BucketForm";
import BucketList from "./components/BucketList";
import Header from "./components/Header";
import { api, ensureGuestAuth } from "./lib/api";
import "./App.css";

const users = [
  { uid: "user1", name: "최선호" },
  { uid: "user2", name: "하다민" },
  { uid: "user3", name: "홍유민" },
];

function App() {
  const API = `${import.meta.env.VITE_API_URL}/api/buckets`;
  const [todos, setTodos] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // 사용자 선택
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    localStorage.setItem("selectedUser", JSON.stringify(user));
  };

  // 초기 데이터 로드
  useEffect(() => {
    const savedUser = localStorage.getItem("selectedUser");
    if (savedUser) setSelectedUser(JSON.parse(savedUser));

    const fetchTodos = async () => {
      try {
        await ensureGuestAuth();
        const res = await api.get(API, { withCredentials: true });
        const buckets = Array.isArray(res.data) ? res.data : res.data.todos ?? [];
        setTodos(buckets);
        console.log("전체 버킷 데이터:", buckets);
      } catch (err) {
        console.error("데이터 불러오기 실패:", err.response?.data || err.message);
      }
    };

    fetchTodos();
  }, []);

  // 생성
  const onCreate = async (bucketData) => {
    if (!selectedUser) return;
    try {
      const payload = { ...bucketData, uid: selectedUser.uid, name: selectedUser.name };
      const { data } = await api.post(API, payload, { withCredentials: true });
      setTodos((prev) => [data, ...prev]);
    } catch (err) {
      console.error("버킷 생성 실패:", err.response?.data || err.message);
    }
  };

  // 삭제
  const onDelete = async (id) => {
    if (!selectedUser) return;

    try {
      await api.delete(`${API}/${id}`, {
        data: { uid: selectedUser.uid },
        withCredentials: true,
      });
      setTodos((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("삭제 실패:", err.response?.data || err.message);
    }
  };

  // 수정
  const onUpdate = async (id, newText) => {
    if (!selectedUser) return;

    try {
      const { data } = await api.patch(
        `${API}/${id}/text`,
        { text: newText, uid: selectedUser.uid },
        { withCredentials: true }
      );

      setTodos((prev) =>
        prev.map((t) => (t._id === id ? data.bucket : t))
      );
    } catch (err) {
      console.error("수정 실패:", err.response?.data || err.message);
    }
  };

  // 선택 사용자 기준 필터링
  const filteredTodos = selectedUser
    ? todos.filter((t) => t.uid === selectedUser.uid)
    : todos;

  return (
    <div className="App">
      <Header users={users} selectedUser={selectedUser} onSelectUser={handleUserSelect} />
      <main>
        <BucketForm onCreate={onCreate} selectedUser={selectedUser} />
        <BucketList todos={filteredTodos} onDelete={onDelete} onUpdate={onUpdate} />
      </main>
    </div>
  );
}

export default App;
