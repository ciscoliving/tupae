// src/features/engagement/Engagement.jsx
import React, { useState, useRef, useEffect } from "react";
import { BsEmojiSmile, BsPaperclip, BsSend } from "react-icons/bs";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaXTwitter, FaYoutube, FaTiktok } from "react-icons/fa6";
import { Tab } from "@headlessui/react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import clsx from "clsx";

// Dummy data
const dummyMessages = [
  { id: 1, platform: "instagram", name: "MK Shoes", message: "Wanakuwaje wameupload video ikiwa na nyimbo tayari", fromUser: false, time: "11:00 AM" },
  { id: 2, platform: "instagram", name: "MK Shoes", message: "Nitume jina lako kamili tafadhali.", fromUser: true, time: "11:02 AM" },
  { id: 3, platform: "facebook", name: "Nuru Boutique", message: "Je, kuna punguzo wiki hii?", fromUser: false, time: "10:00 AM" },
  { id: 4, platform: "facebook", name: "Nuru Boutique", message: "Ndiyo! Pata 15% off leo.", fromUser: true, time: "10:01 AM" },
];

const dummyComments = [
  {
    id: 1,
    name: "Jamila Styles",
    platform: "instagram",
    message: "Nimependa hii content 🔥🔥",
    time: "Yesterday at 2:35 PM",
    replies: [
      { id: 11, name: "Francisco", message: "Asante sana 🙏", time: "Yesterday at 3:00 PM", fromUser: true },
    ],
  },
  {
    id: 2,
    name: "Inno Graphics",
    platform: "facebook",
    message: "Tunaweza kupata ofa ya editing?",
    time: "Today at 9:12 AM",
    replies: [],
  },
];

const platforms = {
  facebook: <FaFacebookF />,
  instagram: <FaInstagram />,
  whatsapp: <FaWhatsapp />,
  x: <FaXTwitter />,
  youtube: <FaYoutube />,
  tiktok: <FaTiktok />,
};

const Engagement = () => {
  const [selectedTab, setSelectedTab] = useState("Inbox");
  const [messages, setMessages] = useState(dummyMessages);
  const [comments, setComments] = useState(dummyComments);
  const [reply, setReply] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [activeConversation, setActiveConversation] = useState("MK Shoes");
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");
  const [commentReplies, setCommentReplies] = useState({});
  const [emojiReplyId, setEmojiReplyId] = useState(null);
  const [commentPlatformFilter, setCommentPlatformFilter] = useState("");

  const messageEndRef = useRef(null);

  const sendMessage = () => {
    if (!reply.trim()) return;
    const convoMessages = messages.filter((m) => m.name === activeConversation);
    const platform = convoMessages.length > 0 ? convoMessages[0].platform : "instagram";
    const newMessage = {
      id: messages.length + 1,
      platform,
      name: activeConversation,
      message: reply,
      fromUser: true,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages([...messages, newMessage]);
    setReply("");
    setShowEmoji(false);
  };

  const sendCommentReply = (commentId) => {
    const text = commentReplies[commentId];
    if (!text?.trim()) return;
    const updated = comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [
            ...comment.replies,
            {
              id: Date.now(),
              name: "Francisco",
              message: text,
              fromUser: true,
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ],
        };
      }
      return comment;
    });
    setComments(updated);
    setCommentReplies((prev) => ({ ...prev, [commentId]: "" }));
    setEmojiReplyId(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const conversationNames = Array.from(new Set(messages.map((msg) => msg.name)));

  const filteredConversations = conversationNames.filter((name) => {
    const latestMsg = messages.find((m) => m.name === name);
    return (!searchTerm || name.toLowerCase().includes(searchTerm.toLowerCase())) &&
           (!platformFilter || latestMsg?.platform === platformFilter);
  });

  const activeMessages = messages.filter((msg) => msg.name === activeConversation);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeConversation]);

  const filteredComments = comments.filter((c) => !commentPlatformFilter || c.platform === commentPlatformFilter);

  return (
    <div className="h-full w-full px-6 py-4 flex flex-col bg-white dark:bg-gray-900">
      <Tab.Group selectedIndex={selectedTab === "Inbox" ? 0 : 1} onChange={(i) => setSelectedTab(i === 0 ? "Inbox" : "Comments")}>
        <Tab.List className="flex space-x-6 border-b">
          {["Inbox", "Comments"].map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                clsx("px-4 py-2 text-sm font-medium focus:outline-none",
                  selected ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-blue-500")
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="flex-1 mt-4 overflow-hidden">
          {/* INBOX PANEL */}
          <Tab.Panel>
            <div className="flex h-[calc(100vh-8rem)] border rounded shadow overflow-hidden">
              <div className="w-1/3 border-r overflow-y-auto flex flex-col">
                <div className="p-3 flex gap-2">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-800 dark:text-white"
                  />
                  <select
                    value={platformFilter}
                    onChange={(e) => setPlatformFilter(e.target.value)}
                    className="px-2 py-2 border rounded text-sm dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">All</option>
                    {Object.keys(platforms).map((key) => (
                      <option key={key} value={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</option>
                    ))}
                  </select>
                </div>
                {filteredConversations.map((name) => {
                  const latestMsg = messages.filter((m) => m.name === name).slice(-1)[0];
                  return (
                    <div
                      key={name}
                      className={`p-4 border-b cursor-pointer flex items-start gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                        activeConversation === name ? "bg-gray-100 dark:bg-gray-800" : ""
                      }`}
                      onClick={() => setActiveConversation(name)}
                    >
                      <div className="text-lg text-gray-600">{platforms[latestMsg.platform]}</div>
                      <div>
                        <h4 className="font-semibold text-sm dark:text-white">{name}</h4>
                        <p className="text-xs text-gray-500 truncate max-w-[180px]">{latestMsg.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex-1 flex flex-col justify-between relative">
                <div className="p-4 border-b font-semibold dark:text-white">{activeConversation}</div>
                <div className="flex-1 px-4 overflow-y-auto space-y-4 py-4">
                  {activeMessages.map((msg) => (
                    <div key={msg.id} className={clsx("max-w-[75%] rounded-lg px-4 py-2 text-sm",
                      msg.fromUser ? "ml-auto bg-blue-600 text-white text-right" :
                        "mr-auto bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white text-left")}>
                      {msg.message}
                      <div className="text-[10px] opacity-60 pt-1">{msg.time}</div>
                    </div>
                  ))}
                  <div ref={messageEndRef} />
                </div>
                <div className="px-4 pb-1 text-xs text-gray-400">{activeConversation} is typing...</div>
                <div className="p-3 border-t bg-white dark:bg-gray-900 flex items-center gap-2 relative">
                  <button onClick={() => setShowEmoji(!showEmoji)}>
                    <BsEmojiSmile className="text-xl text-gray-500" />
                  </button>
                  <button><BsPaperclip className="text-xl text-gray-500" /></button>
                  <input
                    type="text"
                    className="flex-1 border rounded-full px-4 py-2 text-sm dark:bg-gray-800 dark:text-white"
                    placeholder="Type your reply..."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button onClick={sendMessage} className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700"><BsSend /></button>
                  {showEmoji && (
                    <div className="absolute bottom-20 left-10 z-50">
                      <Picker data={data} onEmojiSelect={(emoji) => setReply(reply + emoji.native)} theme="light" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Tab.Panel>

          {/* COMMENTS PANEL */}
          <Tab.Panel>
            <div className="p-3 flex justify-end">
              <select
                value={commentPlatformFilter}
                onChange={(e) => setCommentPlatformFilter(e.target.value)}
                className="px-3 py-2 border rounded text-sm dark:bg-gray-800 dark:text-white"
              >
                <option value="">All Platforms</option>
                {Object.keys(platforms).map((key) => (
                  <option key={key} value={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="h-[calc(100vh-10rem)] overflow-y-auto px-6 space-y-6">
              {filteredComments.map((comment) => (
                <div key={comment.id} className="space-y-2">
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="font-semibold text-sm text-gray-800 dark:text-white">{comment.name}</div>
                    <div className="text-sm dark:text-gray-300">{comment.message}</div>
                    <div className="text-[10px] text-gray-500 mt-1">{comment.time}</div>
                  </div>
                  <div className="pl-4 space-y-3">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className={clsx("p-3 rounded-lg text-sm",
                        reply.fromUser ? "bg-blue-600 text-white ml-auto" : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white")}>
                        <div className="font-medium">{reply.name}</div>
                        <div>{reply.message}</div>
                        <div className="text-[10px] opacity-70 pt-1">{reply.time}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <button onClick={() => setEmojiReplyId(emojiReplyId === comment.id ? null : comment.id)}>
                      <BsEmojiSmile className="text-xl text-gray-500" />
                    </button>
                    <input
                      type="text"
                      placeholder="Reply..."
                      value={commentReplies[comment.id] || ""}
                      onChange={(e) =>
                        setCommentReplies((prev) => ({ ...prev, [comment.id]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          sendCommentReply(comment.id);
                        }
                      }}
                      className="flex-1 border rounded-full px-4 py-2 text-sm dark:bg-gray-800 dark:text-white"
                    />
                    <button onClick={() => sendCommentReply(comment.id)} className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700"><BsSend /></button>
                    {emojiReplyId === comment.id && (
                      <div className="absolute z-50 mt-48 ml-4">
                        <Picker
                          data={data}
                          onEmojiSelect={(emoji) =>
                            setCommentReplies((prev) => ({
                              ...prev,
                              [comment.id]: (prev[comment.id] || "") + emoji.native,
                            }))
                          }
                          theme="light"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default Engagement;
