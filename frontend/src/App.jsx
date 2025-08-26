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
    console.log('API URL:', import.meta.env.VITE_API_URL); // ✅ 디버깅용 로그
    const fetchTodos = async () => {
      try {
        await ensureGuestAuth().catch(err => console.error("Guest auth failed:", err));
        const { data } = await api.get('/api/buckets');
        setTodos(data);
      } catch (err) {
        console.error("데이터 불러오기 실패:", err.response ? err.response.data : err.message);
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
      console.log('Creating bucket:', newBucket); // ✅ 디버깅용 로그
      const { data } = await api.post('/api/buckets', newBucket);
      setTodos((prev) => [data, ...prev]);
    } catch (err) {
      console.error("버킷 생성 실패:", err.response ? err.response.data : err.message);
    }
  };

  const onDelete = async (id) => {
    try {
      console.log('Deleting bucket with id:', id); // ✅ 디버깅용 로그
      await api.delete(`/api/buckets/${id}`);
      setTodos((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("삭제 실패:", err.response ? err.response.data : err.message);
    }
  };

  const onUpdate = async (id, newText) => {
    try {
      console.log('Updating bucket with id:', id, 'newText:', newText); // ✅ 디버깅용 로그
      const { data } = await api.patch(`/api/buckets/${id}/text`, { text: newText });
      const updated = data.bucket || data; // ✅ 백엔드 응답 구조에 맞게 처리
      if (!updated._id) throw new Error("업데이트 데이터가 유효하지 않음");
      setTodos((prev) =>
        prev.map((t) => (t._id === id ? updated : t))
      );
    } catch (err) {
      console.error("수정 실패:", err.response ? err.response.data : err.message);
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