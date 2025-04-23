// This file would typically be part of your data or services directory
// For now, placing it along with the notification components

export interface Notification {
  id: string;
  type: string;
  subject: string;
  message: string;
  time: string;
  read: boolean;
  archived: boolean;
  favorite: boolean;
}

export const notificationsData: Notification[] = [
  {
    id: "1",
    type: "Progrès",
    subject: "Tu as atteint 80% de progrès en mathématiques.",
    message: "Bravo ! Tu as terminé ton exercice avec succès 🎉",
    time: "2 min",
    read: false,
    archived: false,
    favorite: false,
  },
  {
    id: "2",
    type: "Rappels",
    subject: "N'oublie pas de terminer les exercices de maths d'aujourd'hui.",
    message: "N'oublie pas de finir ton exercice de mathématiques 📚",
    time: "5 min",
    read: true,
    archived: false,
    favorite: false,
  },
  {
    id: "3",
    type: "Rappels",
    subject: "Nouveau défi : Géométrie disponible dans ton profil.",
    message: "Continue comme ça ! Chaque petit effort compte 💪",
    time: "12 min",
    read: false,
    archived: false,
    favorite: true,
  },
  {
    id: "4",
    type: "Mises à jour",
    subject: "La version 2.3.0 a été publiée ce matin.",
    message: "L'échéance de ton devoir est dans 2 jours ! 📆",
    time: "45 min",
    read: false,
    archived: true,
    favorite: false,
  },
  {
    id: "5",
    type: "Message",
    subject: "Ton prof a envoyé un message.",
    message: "Pense à réviser les fractions pour demain",
    time: "1 h",
    read: false,
    archived: false,
    favorite: false,
  },
  {
    id: "6",
    type: "Rappels",
    subject: "Tu es à 5 000 XP pour débloquer le prochain niveau.",
    message: "Continue à travailler dur !",
    time: "2 h",
    read: true,
    archived: false,
    favorite: false,
  },
  {
    id: "7",
    type: "Progrès",
    subject: "Chapitre 4 complété ! Félicitations.",
    message: "Excellente progression cette semaine",
    time: "3 h",
    read: true,
    archived: false,
    favorite: true,
  },
  {
    id: "8",
    type: "Conseils",
    subject:
      "Astuce : pratique 15 minutes par jour pour consolider tes compétences.",
    message: "Une routine quotidienne est importante",
    time: "4 h",
    read: false,
    archived: false,
    favorite: false,
  },
  {
    id: "9",
    type: "Trophée",
    subject: "Tu as obtenu le trophée 'Champion de calcul'.",
    message: "Continue de t'améliorer !",
    time: "5 h",
    read: true,
    archived: true,
    favorite: false,
  },
  {
    id: "10",
    type: "Rappels",
    subject: "N'oublie pas ton exercice de français.",
    message: "Il reste 4 questions à compléter",
    time: "6 h",
    read: true,
    archived: true,
    favorite: false,
  },
  {
    id: "11",
    type: "Progrès",
    subject: "Tu as maîtrisé la multiplication à deux chiffres !",
    message: "Super ! Tu progresses rapidement",
    time: "8 h",
    read: false,
    archived: false,
    favorite: false,
  },
  {
    id: "12",
    type: "Rappels",
    subject: "Pense à réviser avant ton test de demain.",
    message: "Le test portera sur les chapitres 5 et 6",
    time: "12 h",
    read: true,
    archived: false,
    favorite: false,
  },
];

// Function to get the count of notifications by type
export function getNotificationCounts() {
  return {
    all: notificationsData.length,
    unread: notificationsData.filter((n) => !n.read).length,
    read: notificationsData.filter((n) => n.read).length,
    favorite: notificationsData.filter((n) => n.favorite).length,
    archive: notificationsData.filter((n) => n.archived).length,
  };
}
