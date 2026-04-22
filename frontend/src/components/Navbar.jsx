import React from 'react';
import { Bot, Trash2, ArrowLeft } from 'lucide-react';

const Navbar = ({ user, onClear }) => {
  return (
    <header className="chat-header">
      <div className="header-left">
        <ArrowLeft className="cursor-pointer text-gray-400 hover:text-white" size={20} />
        <div className="logo-section">
          <div className="logo-icon"><Bot size={20} /></div>
          <h1 className="logo-text">BRAND AI</h1>
        </div>
      </div>

      <div className="header-right">
        <div className="user-profile">
          <div className="avatar">{user.name[0]}</div>
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-email">{user.email}</span>
          </div>
        </div>
        <button onClick={onClear} className="clear-btn flex items-center gap-2">
          <Trash2 size={16} /> CLEAR CHAT
        </button>
      </div>
    </header>
  );
};

export default Navbar;
