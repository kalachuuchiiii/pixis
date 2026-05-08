import { useProfileDetails } from "@/features/account/hooks/useProfileDetails.ts";
import { useAssistantChat } from "../hooks/useAssistantChat";
import { PromptInput } from "../components/PromptInput";
import { AssistantChatBubble } from "../components/AssistantChatBubble";
import { UserChatBubble } from "../components/UserChatBubble";
import { useEffect, useLayoutEffect, useRef } from "react";
import { Spinner } from "@/components/ui/spinner";
import { PixisAvatar } from "@/components/ui/PixisAvatar";

export function DynamicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      hue: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const isDark = () => document.documentElement.classList.contains("dark");

    const createParticle = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.5 + 0.5,
      speedX: Math.random() * 0.4 - 0.2,
      speedY: Math.random() * 0.4 - 0.2,
      opacity: Math.random() * 0.6 + 0.2,
      hue: isDark() ? Math.random() * 60 + 260 : Math.random() * 40 + 260, // purple-cyan range
    });

    const initParticles = () => {
      particles = [];
      const count = Math.floor((canvas.width * canvas.height) / 9000);
      for (let i = 0; i < count; i++) {
        particles.push(createParticle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const dark = isDark();

      particles.forEach((p, i) => {
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = `hsl(${p.hue}, 90%, ${dark ? "75%" : "65%"})`;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Soft glow
        if (dark) {
          ctx.shadowBlur = 12;
          ctx.shadowColor = `hsl(${p.hue}, 100%, 70%)`;
          ctx.fill();
        }

        ctx.restore();

        // Movement
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Gentle pulsing
        p.opacity = Math.sin(Date.now() / 800 + i) * 0.15 + 0.4;
      });

      requestAnimationFrame(animate);
    };

    resize();
    initParticles();
    animate();

    const handleResize = () => {
      resize();
      initParticles();
    };

    window.addEventListener("resize", handleResize);

    // Re-init on theme change
    const observer = new MutationObserver(() => {
      initParticles();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none bg-gradient-to-br from-background via-background to-purple-950/30 dark:to-violet-950/40"
    />
  );
}

const AssistantPage = () => {
  const { data: user } = useProfileDetails();
  const assistantChat = useAssistantChat();
  const {
    sendPrompt,
    isSendingPrompt,
    bottomRef,
    prompt,
    setPrompt,
    messages,
    previousRef,
    nextRef,
    isFetchingNextPage,
    isFetchingPreviousPage,
    containerRef,
    isLoading,
  } = assistantChat;

  if (isLoading) {
    return (
      <div className="w-full h-screen  flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-7xl">
      <DynamicBackground />
      {messages.reverse().length > 0 ? (
        <div>
          <div
            ref={containerRef}
            className=" flex flex-col  flex-col-reverse h-[70vh] overflow-y-auto px-2 py-6 lg:px-2 lg:p-2"
          >
            <div ref={bottomRef} />
            <div ref={nextRef} />
            {isFetchingNextPage && (
              <p className="py-8 text-center w-full opacity-75 font-medium">
                Loading messages...
              </p>
            )}
            {isSendingPrompt && (
              <div className="flex items-center  gap-2 w-full">
                <PixisAvatar />{" "}
                <p className="font-medium opacity-75 animate-pulse">
                  pixis is thinking...
                </p>
              </div>
            )}
            {messages.map(({ role, type, content, id }) =>
              role === "assistant" ? (
                <AssistantChatBubble
                  message={{ role, content, type, id }}
                  key={id}
                />
              ) : (
                <UserChatBubble
                  message={{ role, content, type, id }}
                  key={id}
                />
              )
            )}{" "}
            {isFetchingPreviousPage && (
              <p className="py-8 text-center w-full opacity-75 font-medium">
                Loading messages...
              </p>
            )}
            <div ref={previousRef} />
          </div>
        </div>
      ) : (
        <div>
          <div className="w-full relative">
            {/* Header */}
            <header className="text-center space-y-3 mt-40  ">
              <h1 className="text-6xl font-bold tracking-tighter ">
                Hello, {user.nickname || user.username}!
              </h1>
              <p className="text-xl text-muted-foreground font-light">
                How can I help you today?
              </p>
            </header>
          </div>
        </div>
      )}
      <PromptInput {...assistantChat} />
    </div>
  );
};

export default AssistantPage;
