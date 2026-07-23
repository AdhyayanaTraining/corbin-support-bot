import ChatWidget from "@/src/presentation/features/chat-bot";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#071126",
            marginBottom: 12,
          }}
        >
          Caredata Bot Widget — Demo Host Page
        </h1>
        <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.6 }}>
          This page simulates a host application. The chat bubble in the
          bottom-right corner is the widget you will embed elsewhere. Click it
          to try the conversation flow.
        </p>
      </div>
      <ChatWidget />
    </main>
  );
}
