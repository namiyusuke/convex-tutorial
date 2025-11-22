import { useEffect, useState } from "react";
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated, AuthLoading, useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export default function App() {
  return (
    <main className="chat">
      <Unauthenticated>
        <header>
          <h1>Convex Chat</h1>
          <SignInButton />
        </header>
      </Unauthenticated>
      <AuthLoading>
        <p>Loading...</p>
      </AuthLoading>
      <Authenticated>
        <ChatContent />
      </Authenticated>
    </main>
  );
}

function ChatContent() {
  const { user } = useUser();
  const userName = user?.firstName || user?.username || "Anonymous";

  const sendMessage = useMutation(api.chat.sendMessage);
  const messages = useQuery(api.chat.getMessages);

  const [newMessageText, setNewMessageText] = useState("");

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 0);
  }, [messages]);

  return (
    <>
      <header>
        <h1>Convex Chat</h1>
        <p>
          Connected as <strong>{userName}</strong>
        </p>
        <UserButton />
      </header>
      {messages?.map((message) => (
        <article key={message._id} className={message.user === userName ? "message-mine" : ""}>
          <div>{message.user}</div>
          <p>{message.body}</p>
        </article>
      ))}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await sendMessage({
            user: userName,
            body: newMessageText,
          });
          setNewMessageText("");
        }}
      >
        <input
          value={newMessageText}
          onChange={(e) => setNewMessageText(e.target.value)}
          placeholder="Write a message…"
          autoFocus
        />
        <button type="submit" disabled={!newMessageText}>
          Send
        </button>
      </form>
    </>
  );
}
