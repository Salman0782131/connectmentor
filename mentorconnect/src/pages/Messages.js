import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";

function Messages() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState({});
  const [chatUsers, setChatUsers] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_email.eq.${user.email},receiver_email.eq.${user.email}`)
      .order("created_at", { ascending: true });

    setMessages(data || []);

    const unique = new Set();
    (data || []).forEach((m) => {
      if (m.sender_email !== user.email) unique.add(m.sender_email);
      if (m.receiver_email !== user.email) unique.add(m.receiver_email);
    });

    setChatUsers([...unique]);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase
        .from("users")
        .select("email, name");

      const map = {};
      data?.forEach((u) => (map[u.email] = u.name));
      setUsers(map);
    };
    fetchUsers();
  }, []);

  const sendMessage = async () => {
    if (!text.trim() || !selectedUser) return;

    const { data } = await supabase
      .from("messages")
      .insert([
        {
          sender_email: user.email,
          receiver_email: selectedUser,
          text: text.trim(),
        },
      ])
      .select();

    setMessages((prev) => [...prev, data[0]]);
    setText("");
  };

  const handleDelete = async (id) => {
    await supabase.from("messages").delete().eq("id", id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const saveEdit = async (id) => {
    await supabase
      .from("messages")
      .update({ text: editText })
      .eq("id", id);

    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, text: editText } : m))
    );

    setEditingId(null);
  };

  const filteredMessages = messages.filter(
    (m) =>
      (m.sender_email === user.email &&
        m.receiver_email === selectedUser) ||
      (m.sender_email === selectedUser &&
        m.receiver_email === user.email)
  );

  return (
    <div className="h-screen flex bg-gray-100">

      {/* 🔹 SIDEBAR */}
      <div className="w-1/3 bg-white border-r flex flex-col">

        <div className="p-4 text-xl font-bold border-b">
          Chats
        </div>

        <div className="flex-1 overflow-y-auto">
          {chatUsers.map((email) => (
            <div
              key={email}
              onClick={() => setSelectedUser(email)}
              className={`flex items-center gap-3 p-4 cursor-pointer transition 
                ${
                  selectedUser === email
                    ? "bg-blue-50"
                    : "hover:bg-gray-100"
                }`}
            >
              <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                {(users[email] || email)[0].toUpperCase()}
              </div>

              <div>
                <p className="font-medium">
                  {users[email] || email}
                </p>
                <p className="text-xs text-gray-400">
                  Tap to chat
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 CHAT PANEL */}
      <div className="w-2/3 flex flex-col">

        {!selectedUser ? (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">
            Select a conversation
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="bg-white border-b p-4 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                {(users[selectedUser] || selectedUser)[0].toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">
                  {users[selectedUser] || selectedUser}
                </p>
                <p className="text-xs text-gray-400">
                  Active now
                </p>
              </div>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">

              {filteredMessages.map((m) => (
                <div
                  key={m.id}
                  className={`group flex ${
                    m.sender_email === user.email
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div className="max-w-xs">

                    {/* EDIT MODE */}
                    {editingId === m.id ? (
                      <div className="bg-white border rounded p-2">
                        <input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full border p-1 mb-2"
                        />
                        <div className="flex gap-2 text-sm">
                          <button
                            onClick={() => saveEdit(m.id)}
                            className="text-green-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-gray-500"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`px-4 py-2 rounded-2xl shadow-sm relative
                          ${
                            m.sender_email === user.email
                              ? "bg-blue-600 text-white"
                              : "bg-white border"
                          }`}
                      >
                        {m.text}

                        {/* TIME */}
                        <p className="text-[10px] mt-1 text-right opacity-60">
                          {new Date(m.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </p>
                      </div>
                    )}

                    {/* 🔥 HOVER ACTIONS */}
                    {m.sender_email === user.email &&
                      editingId !== m.id && (
                        <div className="hidden group-hover:flex gap-3 text-xs mt-1 text-gray-400">
                          <button onClick={() => {
                            setEditingId(m.id);
                            setEditText(m.text);
                          }}>
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(m.id)}
                            className="text-red-400"
                          >
                            🗑 Delete
                          </button>
                        </div>
                      )}

                  </div>
                </div>
              ))}

            </div>

            {/* INPUT */}
            <div className="p-4 bg-white border-t flex items-center gap-3">

              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
              />

              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition"
              >
                Send
              </button>

            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default Messages;