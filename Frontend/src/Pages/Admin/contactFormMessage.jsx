import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiMail, FiUser, FiClock, FiMessageSquare, FiCheck, FiAlertCircle, FiSearch } from 'react-icons/fi';
import { IoIosArrowBack } from 'react-icons/io';

const ContactFormMessage = () => {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
    const [showMessageList, setShowMessageList] = useState(true);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.get('/api/v1/user/getcontactform', {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                });
                setMessages(response.data.data);
            } catch (err) {
                console.error('Failed to fetch messages:', err);
            }
        };
        fetchMessages();

        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const filteredMessages = messages.filter(msg => 
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const markAsSeen = async (id) => {
        try {
            const token = localStorage.getItem('accessToken');
            await axios.patch(`/api/v1/user/markasseen/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });
            setMessages(messages.map(msg => 
                msg.id === id ? {...msg, seen_status: 'seen'} : msg
            ));
            if (selectedMessage?.id === id) {
                setSelectedMessage({...selectedMessage, seen_status: 'seen'});
            }
        } catch (err) {
            console.error('Failed to mark message as seen:', err);
        }
    };

    const handleSelectMessage = (msg) => {
        setSelectedMessage(msg);
        if (msg.seen_status === 'unseen') {
            markAsSeen(msg.id);
        }
        if (isMobileView) {
            setShowMessageList(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-900 text-gray-100">
            {/* Sidebar with message list - shown always on desktop, conditionally on mobile */}
            {(showMessageList || !isMobileView) && (
                <div className={`${isMobileView ? 'w-full absolute z-10 bg-gray-800' : 'w-full md:w-1/3 lg:w-1/4'} border-r border-gray-700 bg-gray-800 flex flex-col h-full`}>
                    <div className="p-4 border-b border-gray-700 bg-gray-800 sticky top-0 z-10">
                        <div className="flex items-center justify-between mb-3">
                            <h1 className="text-xl font-bold text-white">Messages</h1>
                            {isMobileView && selectedMessage && (
                                <button 
                                    onClick={() => setShowMessageList(false)}
                                    className="p-1 rounded-full hover:bg-gray-700 text-gray-300"
                                >
                                    <IoIosArrowBack size={20} />
                                </button>
                            )}
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search messages..."
                                className="w-full py-2 pl-10 pr-4 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-700 text-white placeholder-gray-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto">
                        {filteredMessages.length === 0 ? (
                            <div className="p-4 text-center text-gray-400 flex flex-col items-center justify-center h-full">
                                <FiMail className="text-gray-600 mb-2" size={24} />
                                <p>No messages found</p>
                            </div>
                        ) : (
                            filteredMessages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`p-4 border-b border-gray-700 cursor-pointer transition-colors duration-150 flex items-start hover:bg-gray-700 ${
                                        selectedMessage?.id === msg.id ? 'bg-gray-700' : ''
                                    } ${msg.seen_status === 'unseen' ? 'bg-gray-700/50' : ''}`}
                                    onClick={() => handleSelectMessage(msg)}
                                >
                                    <div className="flex-shrink-0 mr-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-800 to-blue-600 flex items-center justify-center text-blue-200 font-medium">
                                            {msg.name.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-sm font-medium text-white truncate">
                                                {msg.name}
                                            </h3>
                                            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                                {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium text-blue-100 truncate mt-0.5">
                                            {msg.subject}
                                        </p>
                                        <p className="text-xs text-gray-400 truncate mt-1">
                                            {msg.message.substring(0, 60)}...
                                        </p>
                                        <div className="flex items-center mt-2">
                                            {msg.seen_status === 'seen' ? (
                                                <FiCheck className="text-green-400 mr-1" size={12} />
                                            ) : (
                                                <FiAlertCircle className="text-yellow-400 mr-1" size={12} />
                                            )}
                                            <span className="text-xs text-gray-400">
                                                {msg.email}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Message detail view - shown conditionally on mobile */}
            {(!showMessageList || !isMobileView) && (
                <div className={`${isMobileView ? 'w-full' : 'flex-1'} flex flex-col bg-gray-800 border-l border-gray-700 h-full`}>
                    {selectedMessage ? (
                        <>
                            <div className="p-4 border-b border-gray-700 bg-gray-800 sticky top-0 z-10 flex items-center">
                                {isMobileView && (
                                    <button 
                                        onClick={() => setShowMessageList(true)}
                                        className="mr-2 p-1 rounded-full hover:bg-gray-700 text-gray-300"
                                    >
                                        <IoIosArrowBack size={20} />
                                    </button>
                                )}
                                <div className="flex-shrink-0 mr-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-800 to-blue-600 flex items-center justify-center text-blue-200 font-medium">
                                        {selectedMessage.name.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="font-semibold text-white">{selectedMessage.name}</h2>
                                    <p className="text-sm text-gray-400 truncate">{selectedMessage.email}</p>
                                </div>
                                <div className="ml-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        selectedMessage.seen_status === 'seen'
                                            ? 'bg-green-900 text-green-300'
                                            : 'bg-yellow-900 text-yellow-300'
                                    }`}>
                                        {selectedMessage.seen_status}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 flex-1 overflow-y-auto">
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-lg font-semibold text-white">{selectedMessage.subject}</h3>
                                        <span className="text-xs text-gray-400">
                                            {new Date(selectedMessage.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="bg-gray-700 rounded-lg p-4">
                                        <p className="text-gray-100 whitespace-pre-line">{selectedMessage.message}</p>
                                    </div>
                                </div>

                                {/* Reply section */}
                                <div className="mt-8 border-t border-gray-700 pt-6">
                                    <h4 className="text-sm font-medium text-gray-300 mb-3">Reply to {selectedMessage.name}</h4>
                                    <textarea 
                                        className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-700 text-white placeholder-gray-400"
                                        rows="4"
                                        placeholder="Type your response here..."
                                    ></textarea>
                                    <div className="mt-3 flex justify-end">
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors">
                                            Send Reply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                            <div className="max-w-md">
                                <FiMessageSquare className="mx-auto text-gray-600 mb-4" size={48} />
                                <h3 className="text-lg font-medium text-gray-300 mb-2">No message selected</h3>
                                <p className="text-gray-500 mb-4">
                                    {isMobileView ? 'Tap on a message to view it' : 'Select a message from the list to view its contents'}
                                </p>
                                {isMobileView && (
                                    <button
                                        onClick={() => setShowMessageList(true)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
                                    >
                                        View Messages
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ContactFormMessage;