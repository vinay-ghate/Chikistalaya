import React from "react";
import Sidebar from "../components/ui/Layout/SideBar";
import MediChat from "../components/Medichat/MainChat";


export default function MediChatPage() {
  const [activeTab, setActiveTab] = React.useState("medichat");
  return (
    <div className="flex h-screen w-screen bg-gradient-to-br from-purple-900 via-purple-950 to-indigo-950">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 flex items-center justify-center p-0">
        <MediChat />
      </main>
    </div>
  );
}

