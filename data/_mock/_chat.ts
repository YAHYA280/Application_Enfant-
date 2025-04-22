import type { AIResponse, ChatHistory } from "@/contexts/types/chat";

export const MOCK_AI_RESPONSES: AIResponse[] = [
  {
    id: "1",
    question: "Qu'est-ce qu'un dinosaure ?",
    answer:
      "Un dinosaure est un animal préhistorique qui a vécu il y a très longtemps. Certains étaient énormes comme le T-Rex, d'autres plus petits. Ils vivaient sur Terre avant l'apparition des humains.",
    illustration:
      "https://tse3.mm.bing.net/th?id=OIP.7rZGfgKq1iauqT1xiuLuNgHaHv&w=474&h=474&c=7",
  },
  {
    id: "2",
    question: "Comment fonctionne la lune ?",
    answer:
      "La lune est un satellite naturel qui tourne autour de la Terre. Elle n'émet pas sa propre lumière mais reflète celle du soleil, ce qui la fait briller dans le ciel la nuit.",
  },
];

export const MOCK_CHAT_HISTORY: ChatHistory[] = [
  {
    id: "1",
    title: "Espace et Lune",
    lastMessage: "La lune tourne autour de la Terre...",
    date: "25 Mars 2024",
    messages: [
      {
        id: "msg3",
        text: "Comment fonctionne la lune ?",
        sender: "child",
        timestamp: 1711382400000,
      },
      {
        id: "msg4",
        text: "La lune est un satellite naturel qui tourne autour de la Terre. Elle ne produit pas sa propre lumière mais reflète celle du soleil.",
        sender: "ai",
        timestamp: 1711382410000,
        liked: "dislike",
      },
    ],
  },
  {
    id: "2",
    title: "Dinosaures",
    lastMessage: "Un dinosaure est un animal préhistorique...",
    date: "26 Mars 2024",
    messages: [
      {
        id: "msg1",
        text: "Qu'est-ce qu'un dinosaure ?",
        sender: "child",
        timestamp: 1711468800000,
      },
      {
        id: "msg2",
        text: "Un dinosaure est un animal préhistorique qui a vécu il y a très longtemps. Certains étaient énormes comme le T-Rex, d'autres plus petits.",
        sender: "ai",
        timestamp: 1711468810000,
        mediaType: "image",
        mediaUrl:
          "https://tse3.mm.bing.net/th?id=OIP.7rZGfgKq1iauqT1xiuLuNgHaHv&w=474&h=474&c=7",
        liked: "like",
      },
    ],
  },
  {
    id: "3",
    title: "Les Animaux",
    lastMessage: "Les lions vivent en groupe...",
    date: "24 Mars 2024",
    messages: [
      {
        id: "msg5",
        text: "Comment vivent les lions ?",
        sender: "child",
        timestamp: 1711296000000,
      },
      {
        id: "msg6",
        text: "Les lions vivent en groupe appelé pride. Ils chassent ensemble et partagent leur territoire.",
        sender: "ai",
        timestamp: 1711296010000,
        mediaType: "image",
        mediaUrl:
          "https://tse2.mm.bing.net/th?id=OIP.y8s1DYlXA24j12vqS8SRogHaHa&w=474&h=474&c=7",
        liked: "none",
      },
    ],
  },
];
