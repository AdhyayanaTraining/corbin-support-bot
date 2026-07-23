import ChatWidget from "@/src/presentation/features/chat-bot";

export const metadata = {
  title: "Caredata Bot",
};

// This route renders ONLY the widget, nothing else — no nav, no demo text.
// Other projects load this exact URL inside an <iframe> to embed the chatbot.
export default function EmbedPage() {
  return (
    <div style={{ background: "transparent" }}>
      <ChatWidget />
    </div>
  );
}
