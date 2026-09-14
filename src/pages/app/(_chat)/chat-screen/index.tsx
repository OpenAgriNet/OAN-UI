import { ChatScreenWebLayout } from "@/components/screens-component/chat-screen/web-layout";
import { ChatScreenMobileLayout } from "@/components/screens-component/chat-screen/mob-layout";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect } from "react";

function ChatScreen() {
  const isMobile = useIsMobile();

  useEffect(() => {
    const shouldBlockBack = sessionStorage.getItem("oan:callback-no-back") === "1";
    if (!shouldBlockBack) return;

    sessionStorage.removeItem("oan:callback-no-back");
    window.history.pushState({ callbackNoBack: true }, "", window.location.href);

    const handlePopState = () => {
      window.history.go(1);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return isMobile ? <ChatScreenMobileLayout /> : <ChatScreenWebLayout />;
}

export default ChatScreen;
