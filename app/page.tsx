"use client";

import { useRef } from "react";
import { useChat } from "ai/react";
import va from "@vercel/analytics";
import clsx from "clsx";
import { VercelIcon, LoadingCircle, SendIcon } from "./icons";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Textarea from "react-textarea-autosize";
import { toast } from "sonner";
import Image from "next/image";
const socialMediaServices = [
  {
    name: "Trending Topics Assistant",
    description:
      "Generate content based on current events, trending hashtags, and popular conversations relevant to the user's industry or interests.",
  },
  {
    name: "Brand Voice Tailor",
    description:
      "Craft posts that align with the user's established brand voice and messaging guidelines, ensuring consistency across all social media channels.",
  },
  {
    name: "Interactive Content Creator",
    description:
      "Develop polls, quizzes, and interactive stories to engage with the user's audience and encourage participation.",
  },
  {
    name: "User-Generated Content Aggregator",
    description:
      "Curate and repurpose user-generated content that mentions or tags the user's brand, giving credit to the original creators.",
  },
  {
    name: "Visual Content Designer",
    description:
      "Assist in creating visually appealing graphics, photos, and videos tailored to the aesthetics of different social platforms.",
  },
  {
    name: "Hashtag Strategy Developer",
    description:
      "Generate effective hashtags for posts to increase reach and engagement, customized for specific campaigns or general brand awareness.",
  },
  {
    name: "Content Calendar Organizer",
    description:
      "Help plan and schedule posts with a content calendar that organizes themes, promotional cycles, and post timing for optimal engagement.",
  },
  {
    name: "Engagement Booster",
    description:
      "Suggest content that prompts user interaction, such as questions, call-to-actions, or content that sparks discussion and community-building.",
  },
  {
    name: "Analytics Reporter",
    description:
      "Summarize key metrics and insights from social media analytics to refine content strategy and identify successful types of posts.",
  },
  {
    name: "Campaign Kick-starter",
    description:
      "Assist in developing content for new product launches, events, or campaigns with a focused message and call-to-action.",
  },
  {
    name: "Influencer Collaboration Facilitator",
    description:
      "Generate ideas and outreach templates for collaborating with influencers and thought leaders in the user's niche.",
  },
  {
    name: "Crisis Communication Aide",
    description:
      "Offer templates and advice on how to handle sensitive issues or crises that arise on social media professionally and tactfully.",
  },
  {
    name: "Competitor Content Analyzer",
    description:
      "Gain insight by summarizing what competitors are posting, analyzing their engagement rates, and noting successful content strategies.",
  },
  {
    name: "SEO Content Enhancer",
    description:
      "Incorporate trending keywords and SEO best practices into social media content to improve visibility in social searches.",
  },
  {
    name: "Localization Specialist",
    description:
      "Adapt content for global audiences by considering cultural relevance and language preferences for different regions.",
  },
];
type Message = {
  id: string;
  role: "function" | "system" | "user" | "assistant";
  content: any;
};

export default function Chat() {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const handleFunctionResult = (result: any) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "function",
      content: result,
    };
    setMessages([...messages, newMessage]);
  };

  const { messages, input, setMessages, setInput, handleSubmit, isLoading } =
    useChat({
      onResponse: (response) => {
        if (response.status === 429) {
          toast.error("You have reached your request limit for the day.");
          va.track("Rate limited");
          return;
        } else {
          va.track("Chat initiated");
        }

        handleFunctionResult(response);
        console.log("###########################");
      },

      onError: (error) => {
        va.track("Chat errored", {
          input,
          error: error.message,
        });
      },
    });

  const disabled = isLoading || input.length === 0;

  return (
    <main className="flex flex-col items-center justify-between pb-40">
      <div className=" top-5  w-full justify-between px-5 ">
        <a
          href="https://aa-production.vercel.app/"
          target="_blank"
          className=" p-2 "
        >
          <Image
            src={"/logoAA.png"}
            width={80}
            height={80}
            alt="logo AA Production Agency"
          />
        </a>
      </div>
      {messages.length > 0 ? (
        messages.map((message, i) => (
          <div
            key={i}
            className={clsx(
              "flex w-full items-center justify-center border-b border-gray-200 ",
              message.role === "user" ? "bg-white" : "bg-gray-100",
            )}
          >
            <div className="flex w-full max-w-screen-md items-start space-x-4 px-5 sm:px-0">
              <div
                className={clsx(
                  "p-1.5 text-white",
                  message.role === "assistant" ? "bg-green-500" : "bg-black",
                  message.role === "function" ? "bg-blue-100" : "",
                )}
              >
                {message.role === "user" ? (
                  <User width={20} />
                ) : message.role === "assistant" ? (
                  <Bot width={20} />
                ) : (
                  // Add a default component here, for example, a div
                  <div></div>
                )}
              </div>
              <ReactMarkdown
                className="prose mt-1 w-full break-words prose-p:leading-relaxed"
                remarkPlugins={[remarkGfm]}
                components={{
                  // open links in new tab
                  a: (props) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                  ),
                }}
              >
                {typeof message.content === "object"
                  ? JSON.stringify(message.content)
                  : message.content}
              </ReactMarkdown>
            </div>
          </div>
        ))
      ) : (
        <div className="border-gray-200sm:mx-0 mx-5 max-w-screen-md rounded-md border sm:w-full">
          <div className="flex flex-col space-y-4 p-7 sm:p-10">
            <h1 className="text-lg font-semibold text-black">
              Your Social Media Content Assistant
            </h1>
          </div>
          <div className="flex flex-col space-y-4 border-t border-gray-200 bg-gray-50 p-7 sm:p-10">
            {socialMediaServices.map((service, i) => (
              <button
                key={i}
                className="group relative rounded-md border border-gray-200 bg-white px-5 py-3 text-left text-sm transition-all duration-75 hover:border-black hover:bg-gray-100 active:bg-gray-50"
                onClick={() => {
                  setInput(service.name + " : " + service.description);
                  inputRef.current?.focus();
                }}
                title={service.description}
              >
                <span className="font-bold">{service.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="fixed bottom-0 flex w-full flex-col items-center space-y-3 bg-gradient-to-b from-transparent via-gray-100 to-gray-100 p-5 pb-3 sm:px-0">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="relative w-full max-w-screen-md rounded-xl border border-gray-200 bg-white px-4 pb-2 pt-3 shadow-lg sm:pb-3 sm:pt-4"
        >
          <Textarea
            ref={inputRef}
            tabIndex={0}
            required
            rows={1}
            autoFocus
            placeholder="Send a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                formRef.current?.requestSubmit();
                e.preventDefault();
              }
            }}
            spellCheck={false}
            className="w-full pr-10 focus:outline-none"
          />
          <button
            className={clsx(
              "absolute inset-y-0 right-3 my-auto flex h-8 w-8 items-center justify-center rounded-md transition-all",
              disabled
                ? "cursor-not-allowed bg-white"
                : "bg-violet-500 hover:bg-blue-800",
            )}
            disabled={disabled}
          >
            {isLoading ? (
              <LoadingCircle />
            ) : (
              <SendIcon
                className={clsx(
                  "h-4 w-4",
                  input.length === 0 ? "text-gray-300" : "text-white",
                )}
              />
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
