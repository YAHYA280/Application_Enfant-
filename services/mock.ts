import { images } from "@/constants";

export enum StatusChallenge {
  ACTIF = "ACTIF",
  INACTIF = "INACTIF",
}

export enum DifficulteChallenge {
  FACILE = "FACILE",
  MOYEN = "MOYEN",
  DIFFICILE = "DIFFICILE",
}

export enum MethodCalculScore {
  SOMME_DES_POINTS = "SOMME_DES_POINTS",
  BASEE_SUR_LE_TEMPS = "BASEE_SUR_LE_TEMPS",
  AVEC_PENALITES = "AVEC_PENALITES",
}

export enum TypeExercice {
  QCM = "QCM",
  QUESTION_OUVERTES = "QUESTION_OUVERTES",
}

export interface Challenge {
  id: number;
  nom: string;
  niveauScolaire: string;
  status: StatusChallenge;
  datePublication: Date;
  difficulte: DifficulteChallenge;
  description: string;
  methodCalculScore: MethodCalculScore;
  prerequis: Challenge[];
  pourcentageReussite: number;
  duree: number;
  nombreTentatives: number;
  accessible: boolean;
  media: any;
  messageFailed: string;
  messageReuse: string;
}

export interface Exercice {
  id: number;
  titre: string;
  chrono: number;
  contenu: string;
  typeExercice: TypeExercice;
  choix: string[];
  reponseCorrecte: string;
  isLastQuestion: boolean;
  pointQuestion: number;
  dureeQuestion: number;
  media: string | null;
  options: string[]; // Added the missing property
}

export const mockChallenges: Challenge[] = [
  {
    id: 1,
    nom: "Challenge 1",
    niveauScolaire: "CM1",
    status: StatusChallenge.ACTIF,
    datePublication: new Date("2025-02-15"),
    difficulte: DifficulteChallenge.FACILE,
    description: "Challenge pour apprendre les bases de la grammaire française",
    methodCalculScore: MethodCalculScore.SOMME_DES_POINTS,
    prerequis: [],
    pourcentageReussite: 85,
    duree: 5,
    nombreTentatives: 5,
    accessible: true,
    messageFailed:
      "👏 Félicitations ! Tu as brillamment relevé ce challenge ! 🎉 Ton travail acharné et ta persévérance ont payé. Continue sur cette lancée, chaque succès te rapproche encore plus de tes objectifs. 🚀🔥",
    messageReuse:
      "Ne te décourage pas ! 💪 Chaque échec est une leçon qui te rapproche de la réussite. Ce challenge n'était qu'une étape, pas une fin en soi. Analyse, apprends et reviens encore plus fort. Tu as tout ce qu'il faut pour y arriver ! 🚀🔥",
    media: images.course1,
  },
  {
    id: 2,
    nom: "Titre : Challenge 2",
    niveauScolaire: "CM1",
    status: StatusChallenge.ACTIF,
    datePublication: new Date("2025-02-20"),
    difficulte: DifficulteChallenge.MOYEN,
    description: "Maîtrisez la conjugaison des verbes en français",
    methodCalculScore: MethodCalculScore.SOMME_DES_POINTS,
    prerequis: [],
    pourcentageReussite: 50,
    duree: 5,
    nombreTentatives: 5,
    accessible: true,
    messageFailed:
      "👏 Félicitations ! Tu as brillamment relevé ce challenge ! 🎉 Ton travail acharné et ta persévérance ont payé. Continue sur cette lancée, chaque succès te rapproche encore plus de tes objectifs. 🚀🔥",
    messageReuse:
      "Ne te décourage pas ! 💪 Chaque échec est une leçon qui te rapproche de la réussite. Ce challenge n'était qu'une étape, pas une fin en soi. Analyse, apprends et reviens encore plus fort. Tu as tout ce qu'il faut pour y arriver ! 🚀🔥",
    media: images.course1,
  },
  {
    id: 3,
    nom: "Titre : Challenge 3",
    niveauScolaire: "CM1",
    status: StatusChallenge.ACTIF,
    datePublication: new Date("2025-02-25"),
    difficulte: DifficulteChallenge.MOYEN,
    description:
      "Enrichissez votre vocabulaire et améliorez votre compréhension",
    methodCalculScore: MethodCalculScore.AVEC_PENALITES,
    prerequis: [],
    pourcentageReussite: 50,
    duree: 5,
    nombreTentatives: 4,
    accessible: true,
    messageFailed:
      "👏 Félicitations ! Tu as brillamment relevé ce challenge ! 🎉 Ton travail acharné et ta persévérance ont payé. Continue sur cette lancée, chaque succès te rapproche encore plus de tes objectifs. 🚀🔥",
    messageReuse:
      "Ne te décourage pas ! 💪 Chaque échec est une leçon qui te rapproche de la réussite. Ce challenge n'était qu'une étape, pas une fin en soi. Analyse, apprends et reviens encore plus fort. Tu as tout ce qu'il faut pour y arriver ! 🚀🔥",
    media: images.course1,
  },
  {
    id: 4,
    nom: "Titre : Challenge 4",
    niveauScolaire: "CM1",
    status: StatusChallenge.ACTIF,
    datePublication: new Date("2025-03-01"),
    difficulte: DifficulteChallenge.FACILE,
    description: "Résolution d'équations mathématiques simples",
    methodCalculScore: MethodCalculScore.SOMME_DES_POINTS,
    prerequis: [],
    pourcentageReussite: 79,
    duree: 5,
    nombreTentatives: 2,
    accessible: false,
    messageFailed:
      "👏 Félicitations ! Tu as brillamment relevé ce challenge ! 🎉 Ton travail acharné et ta persévérance ont payé. Continue sur cette lancée, chaque succès te rapproche encore plus de tes objectifs. 🚀🔥",
    messageReuse:
      "Ne te décourage pas ! 💪 Chaque échec est une leçon qui te rapproche de la réussite. Ce challenge n'était qu'une étape, pas une fin en soi. Analyse, apprends et reviens encore plus fort. Tu as tout ce qu'il faut pour y arriver ! 🚀🔥",
    media: images.course1,
  },
  {
    id: 5,
    nom: "Titre : Challenge 5",
    niveauScolaire: "CM1",
    status: StatusChallenge.ACTIF,
    datePublication: new Date("2025-03-05"),
    difficulte: DifficulteChallenge.DIFFICILE,
    description: "Concepts de base en mécanique physique",
    methodCalculScore: MethodCalculScore.BASEE_SUR_LE_TEMPS,
    prerequis: [],
    pourcentageReussite: 65,
    duree: 5,
    nombreTentatives: 1,
    accessible: false,
    messageFailed:
      "👏 Félicitations ! Tu as brillamment relevé ce challenge ! 🎉 Ton travail acharné et ta persévérance ont payé. Continue sur cette lancée, chaque succès te rapproche encore plus de tes objectifs. 🚀🔥",
    messageReuse:
      "Ne te décourage pas ! 💪 Chaque échec est une leçon qui te rapproche de la réussite. Ce challenge n'était qu'une étape, pas une fin en soi. Analyse, apprends et reviens encore plus fort. Tu as tout ce qu'il faut pour y arriver ! 🚀🔥",
    media: images.course1,
  },
  {
    id: 6,
    nom: "Titre : challenge 6",
    niveauScolaire: "CM1",
    status: StatusChallenge.ACTIF,
    datePublication: new Date("2025-03-10"),
    difficulte: DifficulteChallenge.MOYEN,
    description: "Événements clés de l'histoire mondiale",
    methodCalculScore: MethodCalculScore.SOMME_DES_POINTS,
    prerequis: [],
    pourcentageReussite: 75,
    duree: 5,
    nombreTentatives: 1,
    accessible: false,
    messageFailed:
      "👏 Félicitations ! Tu as brillamment relevé ce challenge ! 🎉 Ton travail acharné et ta persévérance ont payé. Continue sur cette lancée, chaque succès te rapproche encore plus de tes objectifs. 🚀🔥",
    messageReuse:
      "Ne te décourage pas ! 💪 Chaque échec est une leçon qui te rapproche de la réussite. Ce challenge n'était qu'une étape, pas une fin en soi. Analyse, apprends et reviens encore plus fort. Tu as tout ce qu'il faut pour y arriver ! 🚀🔥",
    media: images.course1,
  },
];

mockChallenges[1].prerequis = [mockChallenges[0]];
mockChallenges[2].prerequis = [mockChallenges[0]];

export const mockExercices: Exercice[] = [
  {
    id: 101,
    titre: "Article défini",
    chrono: 30,
    contenu: "Quel est l'article défini pour 'livre' ?",
    typeExercice: TypeExercice.QCM,
    choix: ["la", "le", "l'", "un"],
    reponseCorrecte: "le",
    isLastQuestion: false,
    pointQuestion: 10,
    dureeQuestion: 30,
    media: images.course1,
    options: ["la", "le", "l'", "un"], // Added the required options property
  },
  {
    id: 102,
    titre: "Pluriel de 'cheval'",
    chrono: 30,
    contenu: "Quel est le pluriel du mot 'cheval' ?",
    typeExercice: TypeExercice.QCM,
    choix: ["chevals", "chevauls", "chevaux", "chevales"],
    reponseCorrecte: "chevaux",
    isLastQuestion: false,
    pointQuestion: 10,
    dureeQuestion: 30,
    media: "", // Fixed null assignment
    options: ["chevals", "chevauls", "chevaux", "chevales"], // Added the required options property
  },
  {
    id: 103,
    titre: "Féminin de 'acteur'",
    chrono: 30,
    contenu: "Quel est le féminin du mot 'acteur' ?",
    typeExercice: TypeExercice.QCM,
    choix: ["actrice", "acteuse", "acteure", "actresse"],
    reponseCorrecte: "actrice",
    isLastQuestion: true,
    pointQuestion: 10,
    dureeQuestion: 30,
    media: images.course4,
    options: ["actrice", "acteuse", "acteure", "actresse"], // Added the required options property
  },

  {
    id: 201,
    titre: "Conjugaison du verbe 'être'",
    chrono: 45,
    contenu:
      "Conjuguez le verbe 'être' à la première personne du singulier du présent : Je _____.",
    typeExercice: TypeExercice.QUESTION_OUVERTES,
    choix: [],
    reponseCorrecte: "suis",
    isLastQuestion: false,
    pointQuestion: 15,
    dureeQuestion: 45,
    media: images.course3,
    options: [], // Added the required options property
  },
  {
    id: 202,
    titre: "Conjugaison du verbe 'avoir'",
    chrono: 45,
    contenu:
      "Conjuguez le verbe 'avoir' à la deuxième personne du pluriel du présent : Vous _____.",
    typeExercice: TypeExercice.QUESTION_OUVERTES,
    choix: [],
    reponseCorrecte: "avez",
    isLastQuestion: false,
    pointQuestion: 15,
    dureeQuestion: 45,
    media: images.course4,
    options: [], // Added the required options property
  },
  {
    id: 203,
    titre: "Conjugaison du verbe 'aller'",
    chrono: 45,
    contenu:
      "Conjuguez le verbe 'aller' à la troisième personne du pluriel du présent : Ils _____.",
    typeExercice: TypeExercice.QUESTION_OUVERTES,
    choix: [],
    reponseCorrecte: "vont",
    isLastQuestion: false,
    pointQuestion: 15,
    dureeQuestion: 45,
    media: "", // Fixed null assignment
    options: [], // Added the required options property
  },

  {
    id: 301,
    titre: "Synonyme de 'beau'",
    chrono: 40,
    contenu: "Quel est un synonyme du mot 'beau' ?",
    typeExercice: TypeExercice.QCM,
    choix: ["laid", "joli", "grand", "petit"],
    reponseCorrecte: "joli",
    isLastQuestion: false,
    pointQuestion: 12,
    dureeQuestion: 40,
    media: images.course5,
    options: ["laid", "joli", "grand", "petit"], // Added the required options property
  },
  {
    id: 302,
    titre: "Antonyme de 'rapide'",
    chrono: 40,
    contenu: "Quel est un antonyme du mot 'rapide' ?",
    typeExercice: TypeExercice.QCM,
    choix: ["lent", "vite", "prompt", "accéléré"],
    reponseCorrecte: "lent",
    isLastQuestion: false,
    pointQuestion: 12,
    dureeQuestion: 40,
    media: images.course6,
    options: ["lent", "vite", "prompt", "accéléré"], // Added the required options property
  },
  {
    id: 303,
    titre: "Compréhension de texte",
    chrono: 60,
    contenu:
      "Lisez le texte suivant et répondez à la question : 'Le soleil se couchait à l'horizon, teintant le ciel de nuances de rose et d'orange. Marie contemplait ce spectacle depuis son balcon.' À quel moment de la journée se passe cette scène ?",
    typeExercice: TypeExercice.QCM,
    choix: ["Matin", "Midi", "Après-midi", "Soir"],
    reponseCorrecte: "Soir",
    isLastQuestion: true,
    pointQuestion: 20,
    dureeQuestion: 60,
    media: images.course7,
    options: ["Matin", "Midi", "Après-midi", "Soir"], // Added the required options property
  },
];

export const challengeExerciceMap: Record<number, number[]> = {
  1: [101, 102, 103],
  2: [201, 202, 203],
  3: [301, 302, 303],
  4: [401],
  5: [501],
  6: [601],
};
