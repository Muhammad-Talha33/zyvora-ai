"use client";

import axios from "axios";
import React, { useState, KeyboardEvent, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { FaRegUserCircle } from "react-icons/fa";
import { SignedIn, UserButton } from "@clerk/nextjs";

interface ChatMessage {
  role: "user" | "bot";
  content: string;
}

const renderEnhancedContent = (content: string) => {
  // Convert **bold** to <strong>bold</strong>
  content = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Convert *italic* to <em>italic</em>
  content = content.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Convert `code` to <code>code</code>
  content = content.replace(/`(.*?)`/g, "<code>$1</code>");

  // Convert [text](url) to <a href="url">text</a>
  content = content.replace(
    /\[(.*?)\]\((.*?)\)/g,
    '<a href="$2" class="text-blue-500 underline hover:text-blue-600">$1</a>'
  );

  // Convert numbered lists (e.g., 1. Item 1)
  content = content.replace(
    /(\d+\.\s.*)(\n\s*-\s.*)*/g,
    (match) => `<ol class="list-decimal pl-6">${match}</ol>`
  );

  // Convert bullet points (e.g., - Item 1)
  content = content.replace(
    /(-\s.*)(\n\s*-\s.*)*/g,
    (match) => `<ul class="list-disc pl-6">${match}</ul>`
  );

  // Convert line breaks to <br />
  content = content.replace(/\n/g, "<br />");

  return content;
};

export default function Page() {
  const [question, setQuestion] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentTopic, setCurrentTopic] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  async function generateAnswer() {
    if (!question.trim()) return;

    setChatHistory((prev) => [...prev, { role: "user", content: question }]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await axios.post("/api/generateAnswer", {
        contents: [{ parts: [{ text: `${currentTopic} ${question}` }] }],
      });

      const responseText =
        res.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

      if (!currentTopic) setCurrentTopic(question);

      setChatHistory((prev) => [
        ...prev,
        { role: "bot", content: responseText },
      ]);
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        { role: "bot", content: "Error generating response" },
      ]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      generateAnswer();
    }
  }

  useEffect(() => {
    if (chatContainerRef.current) {
      // Use smooth scrolling to prevent jumps
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory]);

  return (
    <>
      <title>Zyvora AI</title>
      <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        {/* Added UserButton */}
        <div className="w-full flex justify-end p-4">
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>

        <div className="w-full max-w-4xl mt-10 p-6 flex flex-col space-y-4">
          <h1 className="text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Zyvora AI 🤖
          </h1>
          <div
            ref={chatContainerRef}
            className="flex flex-col space-y-4 h-[60vh] overflow-y-auto p-4 bg-white rounded-xl shadow-lg custom-scrollbar"
          >
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`flex ${
                  chat.role === "user" ? "justify-end" : "justify-start"
                } animate-fade-in`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-xs ${
                    chat.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  {chat.role === "bot" && (
                    <Bot className="text-purple-500" size={32} />
                  )}
                  {chat.role === "user" && (
                    <FaRegUserCircle className="text-blue-500 p-1" size={32} />
                  )}
                  <div
                    className={`px-4 py-2 text-sm rounded-3xl shadow-md ${
                      chat.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-black"
                    }`}
                  >
                    {/* Enhanced Rendering */}
                    <div
                      className="prose"
                      dangerouslySetInnerHTML={{
                        __html: renderEnhancedContent(chat.content),
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start items-center space-x-2 animate-pulse">
                <Bot className="text-purple-500" size={32} />
                <div className="bg-gray-100 text-black px-4 py-2 rounded-3xl shadow-md">
                  Thinking...
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col justify-end items-center space-x-2">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              rows={1}
              className="w-full p-3 border border-gray-300 text-black resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-3xl bg-white shadow-sm transition-all duration-200 hover:shadow-md"
            />
          </div>
          <div className="flex justify-center items-center space-x-4">
            <Button
              onClick={generateAnswer}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all rounded-3xl px-6 py-2 shadow-md"
            >
              Send
            </Button>
            <Button
              onClick={() => {
                setChatHistory([]);
                setCurrentTopic("");
              }}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all rounded-3xl px-6 py-2 shadow-md"
            >
              New Chat
            </Button>
          </div>
        </div>
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
        `}</style>
      </div>
    </>
  );
}