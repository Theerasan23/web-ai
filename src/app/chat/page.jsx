"use client";

import { useState, useEffect, useRef } from "react";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CodeIcon from '@mui/icons-material/Code';

import SendIcon from '@mui/icons-material/Send';
import ScheduleSendIcon from '@mui/icons-material/ScheduleSend';

export default function ChatAi() {

    const messagesEndRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: "user", content: input };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/gen", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: input }),
            });

            if (!response.ok) {
                throw new Error("Failed to get response");
            }
            const data = await response.json();
            const aiMessage = { role: "assistant", content: data.message };
            setMessages((prevMessages) => [...prevMessages, aiMessage]);


        } catch (error) {
            console.error("Error:", error);
            const errorMessage = { role: "assistant", content: "Sorry, I encountered an error while processing your request." };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col w-full rounded-2xl justify-between h-screen p-2">
            <div className="flex-1 w-full p-4 overflow-y-scroll bg-[#0e1f29]">
                {messages.map((message, index) => (
                    <div key={index} className={`mb-2 ${message.role === "user" ? "text-right" : "text-left"}`}>
                        {message.role === "user" ? (
                            <div className="w-full flex justify-end">
                                <p className="p-2 text-white bg-blue-950 font-bold rounded-sm">
                                    <AdminPanelSettingsIcon className=" text-green-300 " />
                                    {message.content}
                                </p>
                            </div>
                        ) : (
                            <div className="text-sm font-bold p-3 rounded-lg  text-gray-200">
                                <CodeIcon />
                                <hr className=" text-gray-600 " />
                                <div className="mt-5">
                                    <ReactMarkdown
                                        components={{
                                            code({ inline, className, children, ...props }) {
                                                const match = /language-(\w+)/.exec(className || "");
                                                return !inline && match ? (
                                                    <SyntaxHighlighter
                                                        style={oneDark}
                                                        language={match[1]}
                                                        wrapLongLines
                                                        className="shadow-2xl font-semibold"
                                                        {...props}
                                                    >
                                                        {String(children).replace(/\n$/, "")}
                                                    </SyntaxHighlighter>
                                                ) : (
                                                    <code className="bg-gray-800 text-white px-1 rounded shadow-2xl bord">{children}</code>
                                                );
                                            },
                                        }}
                                    >
                                        {message.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex justify-between items-center p-4 border-t">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-1 outline-none p-2 pl-10 text-sm text-[#00ffff] rounded-lg focus:ring-2 focus:ring-gray-600 w-full"
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`ml-2 p-2 rounded-md px-2 ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#00ffff] hover:bg-blue-700 text-white"}`}
                >
                    {isLoading ? (
                        <ScheduleSendIcon />
                    ) : (
                        <SendIcon />
                        
                    )}
                    
                </button>
            </form>
        </div>
    );
}
