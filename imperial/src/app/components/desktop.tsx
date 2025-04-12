'use client';

import React, { useState } from 'react';
import { Rnd } from 'react-rnd'
import Image from 'next/image';


// Types
type WindowType = {
  id: string;
  title: string;
  content: React.ReactNode;
  position: { x: number; y: number };
  isOpen: boolean;
  zIndex: number;
};

type IconType = {
  id: string;
  title: string;
  iconPath: string;
  windowContent: React.ReactNode;
};

// Mock data for your portfolio sections
const portfolioIcons: IconType[] = [
  {
    id: 'about',
    title: 'About Me',
    iconPath: '/icons/about.png',
    windowContent: <div className="p-4">About me content goes here...</div>
  },
  {
    id: 'projects',
    title: 'Projects',
    iconPath: '/icons/Egg_On_Toast_Icon.png',
    windowContent: <div className="p-4">My projects content goes here...</div>
  },
  {
    id: 'resume',
    title: 'Resume',
    iconPath: '/icons/Cappuccino_Icon.png',
    windowContent: <div className="p-4">Resume content goes here...</div>
  },
  {
    id: 'contact',
    title: 'Contact',
    iconPath: '/icons/contact.png',
    windowContent: <div className="p-4">Contact information goes here...</div>
  }
];

// Desktop Icon Component
const DesktopIcon: React.FC<{
  icon: IconType;
  onClick: () => void;
}> = ({ icon, onClick }) => {
  return (
    <div 
      className="flex flex-col items-center justify-center p-2 cursor-pointer hover:bg-blue-500/20 rounded"
      onClick={onClick}
    >
      <div className="w-12 h-12 mb-1 relative">
        {/* Placeholder div until you have your icon images */}
        <div className="w-full h-full bg-blue-400 rounded flex items-center justify-center text-white">
          {icon.title.charAt(0)}
        </div>
        <Image 
          src={icon.iconPath} 
          alt={icon.title} 
          layout="fill" 
          className="pixel-art" 
        />
      </div>
      <span className="text-sm text-white bg-black/50 px-1 rounded">{icon.title}</span>
    </div>
  );
};

// Window Component
const Window: React.FC<{
  window: WindowType;
  onClose: () => void;
  onFocus: () => void;
}> = ({ window, onClose, onFocus }) => {
  return (
    <div 
      className="absolute bg-white border-2 border-blue-600 shadow-lg rounded-md overflow-hidden"
      style={{ 
        left: window.position.x,
        top: window.position.y,
        zIndex: window.zIndex,
        width: '400px',
        height: '300px'
      }}
      onClick={onFocus}
    >
      {/* Window Title Bar */}
      <div className="bg-blue-600 text-white p-1 flex justify-between items-center">
        <span>{window.title}</span>
        <div className="flex gap-1">
          <button className="w-4 h-4 bg-yellow-400 rounded-sm"></button>
          <button className="w-4 h-4 bg-green-400 rounded-sm"></button>
          <button 
            className="w-4 h-4 bg-red-500 rounded-sm"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          ></button>
        </div>
      </div>
      
      {/* Window Content */}
      <div className="p-2 h-[calc(100%-28px)] overflow-auto">
        {window.content}
      </div>
    </div>
  );
};

const Desktop: React.FC = () => {
  // State for managing windows
  const [windows, setWindows] = useState<WindowType[]>([]);
  const [highestZIndex, setHighestZIndex] = useState(0);
  
  // Handler for opening a window
  const handleOpenWindow = (iconId: string) => {
    const icon = portfolioIcons.find(icon => icon.id === iconId);
    
    if (!icon) return;
    
    // Check if window is already open
    const existingWindowIndex = windows.findIndex(w => w.id === iconId);
    
    if (existingWindowIndex !== -1) {
      // Window already exists, bring it to front
      handleWindowFocus(iconId);
      return;
    }
    
    // Create new window
    const newZIndex = highestZIndex + 1;
    setHighestZIndex(newZIndex);
    
    const newWindow: WindowType = {
      id: iconId,
      title: icon.title,
      content: icon.windowContent,
      position: { 
        x: 100 + Math.random() * 100, 
        y: 100 + Math.random() * 100 
      },
      isOpen: true,
      zIndex: newZIndex
    };
    
    setWindows([...windows, newWindow]);
  };
  
  // Handler for closing a window
  const handleCloseWindow = (windowId: string) => {
    setWindows(windows.filter(w => w.id !== windowId));
  };
  
  // Handler for focusing a window (bringing to front)
  const handleWindowFocus = (windowId: string) => {
    const newZIndex = highestZIndex + 1;
    setHighestZIndex(newZIndex);
    
    setWindows(windows.map(w => 
      w.id === windowId 
        ? { ...w, zIndex: newZIndex } 
        : w
    ));
  };

  return (
    <div className="h-screen w-full relative bg-indigo-900 bg-opacity-75 overflow-hidden">
    {/* You can replace this with your actual desktop background */}
    {/* <Image src="/desktop-bg.png" fill className="object-cover" /> */}
    
    {/* Desktop icons */}
    <div className="grid grid-cols-6 gap-2 p-6">
      {portfolioIcons.map(icon => (
        <DesktopIcon 
          key={icon.id}
          icon={icon}
          onClick={() => handleOpenWindow(icon.id)}
        />
      ))}
    </div>
      {/* Windows */}
      {windows.map(window => (
        <Window
          key={window.id}
          window={window}
          onClose={() => handleCloseWindow(window.id)}
          onFocus={() => handleWindowFocus(window.id)}
        />
      ))}
    </div>
  );
};

export default Desktop;