"use strict";

(() => {
  const STORAGE_KEY = "aol-language";
  const SUPPORTED_LANGUAGES = ["en", "fr"];
  const DEFAULT_LANGUAGE = "en";

  const translations = {
    fr: {
      "Adventures of Life GH | Trips Across Ghana": "Adventures of Life GH | Voyages au Ghana",
      "Adventures": "Aventures",
      "Adventures of Life": "Adventures of Life",
      "Menu": "Menu",
      "Home": "Accueil",
      "Language": "Langue",
      "Journeys": "Voyages",
      "Community": "Communauté",
      "About": "À propos",
      "Contact": "Contact",
      "Routes": "Parcours",
      "Start planning": "Commencer à planifier",
      "Pick a route": "Choisir un parcours",
      "Ask about the next trip": "Demander le prochain voyage",
      "Route journal": "Carnet de route",
      "Book your slot": "Réserver ta place",
      "Read the reviews": "Lire les avis",
      "Explore routes": "Explorer les parcours",
      "All routes": "Tous les parcours",
      "Read the story": "Lire l'histoire",
      "Plan a trip with Zico": "Planifier avec Zico",
      "Send Zico a message": "Envoyer un message à Zico",
      "Meet the community": "Découvrir la communauté",
      "See the routes": "Voir les parcours",
      "Back to journeys": "Retour aux voyages",
      "Book a slot now": "Réserver une place maintenant",
      "Secure your slot now": "Réserve ta place maintenant",
      "Secure your Côte d’Ivoire slot": "Réserve ta place pour la Côte d'Ivoire",
      "Send Zico a message": "Envoyer un message à Zico",
      "Send your review": "Envoyer ton avis",
      "Post review": "Publier l'avis",
      "Leave a review": "Laisser un avis",
      "Loading reviews...": "Chargement des avis...",
      "WhatsApp": "WhatsApp",

      "Oboadaka Waterfall / Ghana / 50+ people": "Cascade d'Oboadaka / Ghana / 50+ personnes",
      "Shai Reserve + Kwaminga Park / Ghana": "Réserve de Shai + Kwaminga Park / Ghana",
      "Togo Vibe Experience / Lome, Togo": "Togo Vibe Experience / Lomé, Togo",
      "Nkyinkyim Museum + Ada / Ghana": "Musée Nkyinkyim + Ada / Ghana",
      "Asenema Waterfall / Eastern Region, Ghana": "Cascade d'Asenema / Région de l'Est, Ghana",
      "Hike Adakluto / Volta Region, Ghana": "Randonnée Adakluto / Région de la Volta, Ghana",
      "Swipe the photo to see every trip.": "Fais glisser la photo pour voir chaque voyage.",
      "Oboadaka Waterfall, Ghana. Slide 1 of 6.": "Cascade d'Oboadaka, Ghana. Diapositive 1 sur 6.",
      "You can already tell": "On le voit déjà",
      "it was a good day.": "c'était une belle journée.",
      "Base": "Base",
      "Ghana / West Africa": "Ghana / Afrique de l'Ouest",
      "Latest trip": "Dernier voyage",
      "Oboadaka Waterfall / 50+ joined": "Cascade d'Oboadaka / 50+ participants",
      "At Oboadaka": "À Oboadaka",
      "Trips done": "Voyages réalisés",
      "Countries reached": "Pays visités",
      "The trips": "Les voyages",
      "These are the days people keep asking about.": "Voici les journées dont tout le monde continue de parler.",
      "Pick the one that feels like you.": "Choisis celle qui te ressemble.",
      "Waterfall + jungle day": "Cascade + journée jungle",
      "Latest trip · 50+ joined": "Dernier voyage · 50+ participants",
      "Oboadaka Waterfall": "Cascade d'Oboadaka",
      "Our first 50+ turnout traded dry clothes for waterfall spray, crowded the black rocks, and left with a group photo that barely fit the frame.": "Notre première sortie à plus de 50 personnes a échangé les vêtements secs contre la brume de la cascade, rempli les rochers noirs et laissé une photo de groupe qui tenait à peine dans le cadre.",
      "Trail climb day": "Journée de montée",
      "Hike Adakluto": "Randonnée Adakluto",
      "You meet at the bottom, do the climb together, and earn the summit photo at the top.": "On se retrouve en bas, on grimpe ensemble, puis on mérite la photo du sommet.",
      "Gorge climb day": "Journée gorge",
      "Akwamu Gorge": "Gorge d'Akwamu",
      "Harder on the legs, bigger at the top, and worth every complaint on the way up.": "Plus dur pour les jambes, plus grandiose au sommet, et ça vaut chaque plainte pendant la montée.",
      "Forest waterfall day": "Journée cascade en forêt",
      "Asenema Waterfalls": "Cascades d'Asenema",
      "Forest walk, cold water at the end, and a ride home full of people asking when it runs again.": "Marche en forêt, eau froide à l'arrivée, et un retour où tout le monde demande déjà la prochaine date.",
      "Weekend": "Week-end",
      "Keta 3 Days": "Keta 3 jours",
      "Tents, fort stop, sea air, and the weekend people still bring up months later.": "Tentes, arrêt au fort, air marin, et un week-end que les gens mentionnent encore des mois après.",
      "Museum / lagoon day": "Musée / journée lagune",
      "Ada / Nkyinkyim Museum": "Ada / Musée Nkyinkyim",
      "Museum grounds, water, portraits, and a slower day that still gives you a lot to remember.": "Musée, eau, portraits, et une journée plus douce qui laisse quand même beaucoup de souvenirs.",
      "Reserve + cave day": "Réserve + journée grotte",
      "Shai Reserve & Kwaminga Park": "Réserve de Shai & Kwaminga Park",
      "Reserve ground, cave air, and the outdoor day that tightened the group faster than anyone expected.": "Sol de réserve, air de grotte, et une journée dehors qui a rapproché le groupe plus vite que prévu.",
      "Since 2023": "Depuis 2023",
      "Three friends. One trip.": "Trois amis. Un voyage.",
      "Now 60+ travellers.": "Aujourd'hui 60+ voyageurs.",
      "It started with one trip and a group chat. No agency, no itinerary software, just people moving because somebody finally picked a date and said let's go.": "Tout a commencé avec un voyage et un groupe WhatsApp. Pas d'agence, pas de logiciel d'itinéraire, juste des gens qui bougent parce que quelqu'un a enfin choisi une date et dit: on y va.",
      "What the trip feels like": "Ce que le voyage fait ressentir",
      "You join the group.": "Tu rejoins le groupe.",
      "The day still feels like yours.": "La journée reste à toi.",
      "Strangers only at pickup": "Inconnus seulement au départ",
      "By the first stop, names stick. By the ride home, the group chat has its own jokes.": "Au premier arrêt, les prénoms restent. Au retour, le groupe a déjà ses propres blagues.",
      "The scenery does not sit still": "Le décor ne reste jamais immobile",
      "Road gives way to trail, trail to water, and the next stop changes the mood before the energy drops.": "La route devient sentier, le sentier devient eau, et l'arrêt suivant change l'ambiance avant que l'énergie ne retombe.",
      "Your own moment still fits": "Ton moment à toi a aussi sa place",
      "Swim. Wander. Take the photo. Sit with the view. You move with the group without spending every minute in a crowd.": "Nage. Marche. Prends la photo. Assieds-toi devant la vue. Tu avances avec le groupe sans passer chaque minute dans la foule.",
      "A day on the route": "Une journée sur la route",
      "How the day unfolds": "Comment la journée se déroule",
      "between meet-up and ride home.": "entre le rendez-vous et le retour.",
      "Start of the climb": "Début de la montée",
      "At the start, everybody is still introducing themselves.": "Au début, tout le monde se présente encore.",
      "The climb has not humbled anyone yet. That part comes later.": "La montée n'a encore calmé personne. Ça vient après.",
      "Top of Adakluto": "Sommet d'Adakluto",
      "This is why you kept climbing.": "Voilà pourquoi tu as continué à grimper.",
      "The view earns itself. Nobody needs to be told to stop and look.": "La vue se mérite. Personne n'a besoin qu'on lui dise de s'arrêter et regarder.",
      "Somewhere in the middle": "Quelque part au milieu",
      "The group clicks. That part always happens faster than people expect.": "Le groupe se connecte. Ça arrive toujours plus vite qu'on ne pense.",
      "You came as strangers. By afternoon, that is already not quite true.": "Vous êtes arrivés inconnus. L'après-midi, ce n'est déjà plus vraiment vrai.",
      "Inside Oboadaka": "À Oboadaka",
      "Nobody stayed on the sidelines.": "Personne n'est resté de côté.",
      "Water in the air. Bare feet on black rock. Fifty-plus people making room for one another under the falls.": "De l'eau dans l'air. Pieds nus sur la roche noire. Plus de cinquante personnes qui se font de la place sous la cascade.",
      "Why people come back": "Pourquoi les gens reviennent",
      "It feels personal": "Ça paraît personnel",
      "because it is.": "parce que ça l'est.",
      "Scouted before we invite anyone": "Repéré avant d'inviter qui que ce soit",
      "Every trip is checked on the ground first, so people are not walking into guesswork. If the road is bad, we know before you do.": "Chaque sortie est vérifiée sur place d'abord, pour que personne n'arrive dans l'inconnu. Si la route est difficile, on le sait avant toi.",
      "Hosted with local instinct": "Guidé avec l'instinct du terrain",
      "You are with someone who knows the stops, the timing, and when the group should move or stay a little longer. Not a guide reading from a script.": "Tu es avec quelqu'un qui connaît les arrêts, le timing, et le moment où le groupe doit bouger ou rester un peu plus longtemps. Pas un guide qui lit un script.",
      "Planned enough to feel easy": "Assez organisé pour être simple",
      "There is a clear day ahead of you, but it never feels stiff or over-managed. The loose parts are where the good things happen.": "La journée est claire, mais jamais rigide ni trop contrôlée. Les meilleurs moments arrivent souvent dans les espaces libres.",
      "You go home with something to show": "Tu rentres avec quelque chose à montrer",
      "Photos, voice notes, inside jokes, and a group chat that usually stays alive well past the trip. That part is not planned. It just happens.": "Photos, notes vocales, blagues internes, et un groupe WhatsApp qui reste souvent actif bien après le voyage. Cette partie n'est pas planifiée. Elle arrive toute seule.",
      "On recent trips": "Sur les voyages récents",
      "No stock. No setup.": "Pas de stock. Pas de mise en scène.",
      "Just the days as they happened.": "Juste les journées comme elles se sont passées.",
      "Waterfall spray, reserve paths, lagoon air, and beach nights.": "Brume de cascade, chemins de réserve, air de lagune et nuits à la plage.",
      "Right under the falls": "Juste sous la cascade",
      "Under the falls": "Sous la cascade",
      "Oboadaka crew": "La team Oboadaka",
      "Fresh off Shai": "Tout juste de Shai",
      "Lagoon edge": "Au bord de la lagune",
      "Ada day": "Journée Ada",
      "Camp night": "Nuit de camp",
      "Beach stay": "Séjour à la plage",
      "50+ showed up": "50+ étaient là",
      "One waterfall day": "Une journée cascade",
      "Start with the trip": "Commence par le voyage",
      "Tell Zico the trip you have in mind.": "Dis à Zico le voyage que tu as en tête.",
      "He will point you to the right one.": "Il t'orientera vers le bon.",
      "Send your dates, group size, or the mood you want, and Zico will tell you which route fits best.": "Envoie tes dates, la taille du groupe ou l'ambiance que tu veux, et Zico te dira quel parcours convient le mieux.",
      "Trip request": "Demande de voyage",
      "Do not fill this out:": "Ne remplis pas ceci :",
      "Name": "Nom",
      "Email": "Email",
      "Trip": "Voyage",
      "Private group": "Groupe privé",
      "Custom": "Sur mesure",
      "Notes": "Notes",
      "Send inquiry": "Envoyer la demande",
      "Or message Zico directly on": "Ou écris directement à Zico sur",
      "Next trip / 28 August to 2 September": "Prochain voyage / 28 août au 2 septembre",
      "La Côte d’Ivoire Experience Briefing": "Briefing de l'expérience Côte d'Ivoire",
      "So it's a four days trip where we depart from Accra on 28th August to Abidjan then return back to Accra on 2nd September. We leave Accra in the evening and get to Abidjan in the morning of the following making it a 10 to 12hrs journey of which we would be asleep most of the night so it wouldn't be stressful and by the time we would've wake up then we're already at the côte d'ivoire boarder going through customs and immigration to proceed into Abidjan.": "C'est un voyage de quatre jours : nous quittons Accra le 28 août pour Abidjan, puis nous revenons à Accra le 2 septembre. Le départ se fait le soir depuis Accra et nous arrivons à Abidjan le lendemain matin. Le trajet dure environ 10 à 12 heures, mais la plupart du voyage se fait pendant la nuit, donc ce ne sera pas stressant. Au réveil, nous serons déjà à la frontière de la Côte d'Ivoire pour les formalités de douane et d'immigration avant de continuer vers Abidjan.",
      "We're spending 3 nights and 4 days in Abidjan where we get to explore four cities and different tourists sites while enjoying the rich culture of côte d'ivoire.": "Nous passerons 3 nuits et 4 jours à Abidjan, avec l'occasion d'explorer quatre villes, différents sites touristiques, et de profiter de la richesse culturelle de la Côte d'Ivoire.",
      "The total package of 3,300 Cedis includes the transportation, accommodations, feeding throughout the trip, tourist site fees and all other details listed on the flyer.": "Le forfait total de 3 300 cedis comprend le transport, l'hébergement, les repas pendant tout le voyage, les frais des sites touristiques et tous les autres détails indiqués sur le flyer.",
      "About the payment, we have an installment payment plan where you pay 500 cedis to secure a slot for the côte d'ivoire trip and pay the rest in installments and ways that's suitable for you or after paying the 500 cedis to secure a slot, you can make all the full payment at once if you feel you can. Remember you choose which payment options you can.": "Pour le paiement, nous avons un plan par versements : tu paies 500 cedis pour réserver ta place pour le voyage en Côte d'Ivoire, puis tu règles le reste en plusieurs versements selon ce qui te convient. Après avoir payé les 500 cedis pour réserver, tu peux aussi régler tout le solde en une fois si tu préfères. C'est toi qui choisis l'option de paiement qui te convient.",
      "One thing you can be assured of on this côte d'ivoire trip is everyone on board is going to make you feel comfortable and get along well in a way you're going to feel like you've been one of us.": "Une chose est sûre pour ce voyage en Côte d'Ivoire : les personnes à bord feront en sorte que tu te sentes à l'aise, accueilli et intégré, comme si tu faisais déjà partie du groupe.",
      "If there's any other information you'd like to know, you can feel free to contact CEO(Zico)": "Si tu veux d'autres informations, tu peux contacter librement le CEO (Zico).",
      "La Côte d’Ivoire Experience": "L'expérience Côte d'Ivoire",
      "Three nights, four days and four cities, with transport, accommodation, meals and attraction fees included.": "Trois nuits, quatre jours et quatre villes, avec transport, hébergement, repas et frais de visite inclus.",
      "GHS 3,300 total": "3 300 GHS au total",
      "GHS 500 deposit": "Acompte de 500 GHS",
      "Installments accepted": "Paiement échelonné accepté",
      "See trip details & secure your slot": "Voir les détails et réserver ta place",
      "Trips around Ghana that feel like someone local invited you along.": "Des voyages au Ghana qui donnent l'impression qu'un local t'a invité.",
      "Copyright": "Copyright",
      "Adventures of Life.": "Adventures of Life.",

      "Journeys | Adventures of Life GH": "Voyages | Adventures of Life GH",
      "Journeys / Upcoming trips": "Voyages / Prochains départs",
      "See what already happened, then pick the next one with your name on it.": "Regarde ce qui s'est déjà passé, puis choisis le prochain voyage qui porte ton nom.",
      "Ada started the year. Togo crossed the border. Shai wrapped. Oboadaka is done. Côte d’Ivoire is next.": "Ada a lancé l'année. Le Togo a franchi la frontière. Shai est terminé. Oboadaka aussi. La Côte d'Ivoire est la prochaine.",
      "Need the traveller version first?": "Tu veux d'abord l'avis des voyageurs ?",
      "Trips already done": "Voyages déjà faits",
      "Next stop marked": "Prochain arrêt marqué",
      "Dates confirmed": "Dates confirmées",
      "Border runs": "Voyages frontaliers",
      "Adventures of Life GH - 2026 trips": "Adventures of Life GH - voyages 2026",
      "This year's trips, all in one place.": "Les voyages de l'année, au même endroit.",
      "See what's done. See what's next.": "Vois ce qui est fait. Vois ce qui arrive.",
      "Ada, Togo, Shai, and Oboadaka are already behind us. Côte d’Ivoire is next, then the rest of the year is lined up here so you can see what's coming and decide where you want in.": "Ada, Togo, Shai et Oboadaka sont déjà derrière nous. La Côte d'Ivoire arrive ensuite, puis le reste de l'année est aligné ici pour que tu voies ce qui vient et où tu veux entrer.",
      "Ghana trips": "Voyages au Ghana",
      "Nkyinkyim Museum & Ada Island": "Musée Nkyinkyim & île d'Ada",
      "Done": "Terminé",
      "The year opened with shoreline, sculpture, and the kind of easy first day that made people want the next date fast.": "L'année a commencé avec la plage, la sculpture, et ce genre de première journée qui donne vite envie de la prochaine date.",
      "Museum + island day": "Musée + journée île",
      "Ada shoreline, Ghana": "Rivage d'Ada, Ghana",
      "The Togo Vibe Experience": "The Togo Vibe Experience",
      "The first passport stamp came early. Three days over the line, a different rhythm, and a bigger sense of where the year could go.": "Le premier tampon de passeport est arrivé tôt. Trois jours de l'autre côté, un autre rythme, et une vision plus large de l'année.",
      "3-day border run": "Voyage frontalier de 3 jours",
      "Togo Republic": "République du Togo",
      "BORDER RUN": "PASSAGE DE FRONTIÈRE",
      "Lome, Togo": "Lomé, Togo",
      "Shai gave the year its first real outdoor memory: reserve ground, cave air, tired legs, and the moment the group stopped feeling new to each other.": "Shai a donné à l'année son premier vrai souvenir en plein air : sol de réserve, air de grotte, jambes fatiguées, et ce moment où le groupe ne paraît plus nouveau.",
      "Reserve + cave day": "Réserve + journée grotte",
      "Shai Reserve, Ghana": "Réserve de Shai, Ghana",
      "Oboadaka Waterfall X Party in the Jungle": "Cascade d'Oboadaka X Party in the Jungle",
      "A water reset after the early movement, and the crew photo now sits with the first half of the year as one of the days people still bring up.": "Un reset dans l'eau après les premiers voyages, et la photo de groupe fait déjà partie des journées dont les gens reparlent.",
      "Waterfall day": "Journée cascade",
      "Oboadaka, Ghana": "Oboadaka, Ghana",
      "Next up": "Prochain départ",
      "4 Days in Côte d’Ivoire": "4 jours en Côte d'Ivoire",
      "Overnight road, Abidjan mornings, and four days that open the year beyond Ghana.": "Route de nuit, matins à Abidjan, et quatre jours qui ouvrent l'année au-delà du Ghana.",
      "4-day crossing": "Traversée de 4 jours",
      "Côte d’Ivoire": "Côte d'Ivoire",
      "West border": "Frontière ouest",
      "Wli Waterfalls Camp": "Camp aux cascades de Wli",
      "Back into Ghana for the camp stop, where the road trades border motion for Volta air and long-night energy.": "Retour au Ghana pour l'étape camping, où la route échange l'élan frontalier contre l'air de la Volta et l'énergie des longues nuits.",
      "Highland camp": "Camp en altitude",
      "Volta Region": "Région de la Volta",
      "Amedzofe": "Amedzofe",
      "The highlands close the home run, carrying the year right up to the edge of the finale.": "Les hauteurs ferment le parcours au Ghana et portent l'année jusqu'au bord du final.",
      "Volta highlands": "Hautes terres de la Volta",
      "Benin / End Of Year Party": "Bénin / fête de fin d'année",
      "The year ends loud: one last crossing, one last stamp, and a December trip people start talking about months ahead.": "L'année se termine fort : une dernière traversée, un dernier tampon, et un voyage de décembre dont on parle déjà des mois avant.",
      "End of year": "Fin d'année",
      "BENIN REPUBLIC": "RÉPUBLIQUE DU BÉNIN",
      "\"The page should already feel alive before the middle of the year. Start with culture, cross the border early, come back home stronger, then close with a finale people plan around.\"": "\"La page doit déjà sembler vivante avant le milieu de l'année. Commencer par la culture, traverser tôt la frontière, revenir plus fort au pays, puis finir avec un final que les gens préparent à l'avance.\"",
      "— Zico · Founder": "— Zico · Fondateur",
      "January to April": "Janvier à avril",
      "Set the tone early.": "Donner le ton tôt.",
      "Ada opened with shoreline and story. Togo put the first passport stamp on the year before it had time to settle.": "Ada a commencé avec le rivage et l'histoire. Le Togo a posé le premier tampon de passeport avant que l'année ne s'installe.",
      "May to August": "Mai à août",
      "Come back home, then push west.": "Revenir à la maison, puis pousser vers l'ouest.",
      "Shai and Oboadaka Waterfall reset the body. Côte d’Ivoire widens the frame and pushes the year west again.": "Shai et Oboadaka Waterfall remettent le corps en mouvement. La Côte d'Ivoire élargit le cadre et pousse l'année encore vers l'ouest.",
      "October to December": "Octobre à décembre",
      "Close in the highlands, finish across the border.": "Clore dans les hauteurs, finir de l'autre côté de la frontière.",
      "Wli Waterfalls Camp and Amedzofe carry the home stretch. Benin gives the year one last loud finish.": "Wli Waterfalls Camp et Amedzofe portent la dernière ligne droite. Le Bénin offre à l'année un dernier final puissant.",
      "Ready to get on the right list?": "Prêt à entrer sur la bonne liste ?",
      "Pick the month.": "Choisis le mois.",
      "Send the message.": "Envoie le message.",
      "If one month already has your attention, send the message now. Zico will tell you what still has room and which list is tightening first.": "Si un mois attire déjà ton attention, envoie le message maintenant. Zico te dira où il reste de la place et quelle liste se remplit le plus vite.",
      "Choose the month that feels right. Zico will handle the next step with you.": "Choisis le mois qui te parle. Zico fera la suite avec toi.",

      "Community | Adventures of Life GH": "Communauté | Adventures of Life GH",
      "Latest community day": "Dernière journée communauté",
      "More than 50 people came for the waterfall.": "Plus de 50 personnes sont venues pour la cascade.",
      "Oboadaka felt like the whole community arrived at once.": "Oboadaka donnait l'impression que toute la communauté était arrivée d'un coup.",
      "Joined at Oboadaka": "Participants à Oboadaka",
      "Strangers left by day three": "Inconnus restés au troisième jour",
      "The trips so far": "Les voyages jusqu'ici",
      "Every one of these happened.": "Chacun d'eux a vraiment eu lieu.",
      "You should have been there.": "Tu aurais dû être là.",
      "Oboadaka Waterfall 2026": "Cascade d'Oboadaka 2026",
      "50+ people": "50+ personnes",
      "More than 50 people showed up for the waterfall.": "Plus de 50 personnes sont venues pour la cascade.",
      "The headcount passed 50 before departure. At Oboadaka, the crowd split between the water, the rocks, and the camera, then came back together for a group picture that barely fit the frame.": "Le nombre a dépassé 50 avant le départ. À Oboadaka, le groupe s'est réparti entre l'eau, les rochers et les caméras, puis s'est retrouvé pour une photo de groupe qui tenait à peine dans le cadre.",
      "Oboadaka became the first Adventures of Life trip to cross 50 travellers.": "Oboadaka est devenu le premier voyage Adventures of Life à dépasser 50 voyageurs.",
      "Hike Adakluto 2025": "Randonnée Adakluto 2025",
      "16 people": "16 personnes",
      "The first climb everyone remembered.": "La première montée dont tout le monde se souvient.",
      "Early call time. Long ride. Most people had barely met. Halfway up the hill the jokes started, and by the time they came down nobody felt like a stranger anymore.": "Départ tôt. Long trajet. La plupart se connaissaient à peine. À mi-chemin, les blagues ont commencé, et à la descente plus personne ne se sentait inconnu.",
      "That climb turned a bus full of strangers into a real group.": "Cette montée a transformé un bus d'inconnus en vrai groupe.",
      "Asenema Waterfalls 2025": "Cascades d'Asenema 2025",
      "14 people": "14 personnes",
      "The one with no flyer.": "Celui sans flyer.",
      "No flyer. No Instagram post. Zico just texted his people. The spots filled quickly, and it became obvious that the crowd was already there, ready to show up.": "Pas de flyer. Pas de post Instagram. Zico a juste écrit à ses gens. Les places sont parties vite, et c'est devenu évident que le public était déjà là, prêt à venir.",
      "By then, the crowd was already there. It only needed a date.": "À ce moment-là, le public était déjà là. Il ne lui manquait qu'une date.",
      "The day that moved at a gentler pace.": "La journée qui avançait plus doucement.",
      "Ada slowed the pace without lowering the energy. Museum grounds first, then water, then portraits, then the conversations that only happen when nobody is checking the time.": "Ada a ralenti le rythme sans baisser l'énergie. D'abord le musée, puis l'eau, les portraits, et ces conversations qui arrivent quand personne ne regarde l'heure.",
      "A reminder that the quieter days can stay with people just as hard.": "Un rappel que les journées plus calmes peuvent marquer tout autant.",
      "Akwamu Gorge 2025": "Gorge d'Akwamu 2025",
      "20 people": "20 personnes",
      "The hike nobody expected.": "La randonnée que personne n'avait prévue.",
      "The gorge hike was hard and everybody said so. They still kept climbing, got the view at the top, and came home with the pictures that made everyone else ask what they missed.": "La randonnée dans la gorge était dure, et tout le monde l'a dit. Ils ont quand même continué, ont eu la vue au sommet, et sont rentrés avec les photos qui ont fait demander aux autres ce qu'ils avaient raté.",
      "After Akwamu, a lot more people started paying attention.": "Après Akwamu, beaucoup plus de gens ont commencé à regarder.",
      "Keta 3-Day Trip / December 2025": "Voyage Keta 3 jours / décembre 2025",
      "33 people": "33 personnes",
      "The biggest one.": "Le plus grand.",
      "Christmas season. Keta. Beach camp, fort stop, house-party energy, and 33 people who started as strangers and left with something much closer than that.": "Période de Noël. Keta. Camp à la plage, arrêt au fort, ambiance house party, et 33 personnes qui ont commencé inconnues et sont reparties bien plus proches.",
      "Fastest sell-out. Biggest energy. Still one of the loudest stories in the community.": "Vente la plus rapide. Plus grande énergie. Encore l'une des histoires les plus fortes de la communauté.",
      "Togo 2026": "Togo 2026",
      "First border trip": "Premier voyage frontalier",
      "The first border run came back with its own energy.": "Le premier passage de frontière est revenu avec sa propre énergie.",
      "Three days over the line and the energy shifted immediately. Lome gave the trip its own pace: landmark stops, portraits, road moments, and the feeling that the community had properly stretched beyond Ghana.": "Trois jours de l'autre côté et l'énergie a changé tout de suite. Lomé a donné son propre rythme au voyage : monuments, portraits, moments de route, et la sensation que la communauté s'étendait vraiment au-delà du Ghana.",
      "That trip proved the group could cross the line and still feel like itself.": "Ce voyage a prouvé que le groupe pouvait traverser la frontière tout en restant lui-même.",
      "Trip reviews": "Avis des voyageurs",
      "What travellers shared.": "Ce que les voyageurs ont partagé.",
      "Say how your trip went.": "Raconte comment ton voyage s'est passé.",
      "Verified review links are sent after each trip. If yours is missing, ask Zico to resend it on WhatsApp.": "Les liens d'avis vérifiés sont envoyés après chaque voyage. Si le tien manque, demande à Zico de le renvoyer sur WhatsApp.",
      "Your name": "Ton nom",
      "WhatsApp or email": "WhatsApp ou email",
      "Trip joined": "Voyage rejoint",
      "Select the trip": "Choisir le voyage",
      "Nkyinkyim Museum and Ada Island": "Musée Nkyinkyim et île d'Ada",
      "Shai Reserve and Kwaminga Park": "Réserve de Shai et Kwaminga Park",
      "Other Adventures of Life trip": "Autre voyage Adventures of Life",
      "When did you go?": "Quand es-tu parti ?",
      "Rating": "Note",
      "Select a rating": "Choisir une note",
      "5 - Excellent": "5 - Excellent",
      "4 - Strong": "4 - Très bon",
      "3 - Good": "3 - Bien",
      "2 - Fair": "2 - Moyen",
      "1 - Needs work": "1 - À améliorer",
      "Your review": "Ton avis",
      "Prefer voice note or chat?": "Tu préfères une note vocale ou un message ?",
      "Send it on WhatsApp": "Envoie-le sur WhatsApp",
      "Fresh off Oboadaka": "Tout juste d'Oboadaka",
      "50+ showed up.": "50+ étaient là.",
      "Abidjan is next.": "Abidjan est le prochain départ.",
      "More than 50 people joined us at Oboadaka Waterfall. Now the next group leaves Accra for Côte d’Ivoire on 28 August. Secure your place with GHS 500, then spread the rest across the installment plan that suits you.": "Plus de 50 personnes nous ont rejoints à la cascade d'Oboadaka. Maintenant, le prochain groupe quitte Accra pour la Côte d'Ivoire le 28 août. Réserve ta place avec 500 GHS, puis règle le reste avec le plan d'acompte qui te convient.",
      "Most people come once and start waiting for the next date.": "La plupart viennent une fois et commencent à attendre la prochaine date.",

      "About | Adventures of Life GH": "À propos | Adventures of Life GH",
      "Chapter four": "Quatrième étape",
      "\"Whatever trip we embark on,": "\"Quel que soit le voyage que nous faisons,",
      "they are all adventures surrounding our lives.\"": "ce sont tous des aventures autour de nos vies.\"",
      "Zico / Founder": "Zico / Fondateur",
      "Since 2023": "Depuis 2023",
      "The origin": "L'origine",
      "He did not start a company.": "Il n'a pas lancé une entreprise.",
      "He started taking people": "Il a commencé à emmener des gens",
      "to the Ghana he knew.": "dans le Ghana qu'il connaissait.",
      "Adventures of Life did not come out of a pitch deck. It came from Zico taking people to places he already loved, then doing it again when they came back asking for another date.": "Adventures of Life n'est pas né d'une présentation business. C'est né de Zico qui emmenait des gens dans des endroits qu'il aimait déjà, puis qui recommençait quand ils revenaient demander une autre date.",
      "How it happened": "Comment c'est arrivé",
      "From three people": "De trois personnes",
      "to 60+, honestly.": "à plus de 60, simplement.",
      "One trip. Three people. No plan.": "Un voyage. Trois personnes. Pas de plan.",
      "Zico, his close friend, and Shoddy B took one trip the whole year. No brand, no flyer, no strategy. Just a shared belief that Ghana had more to offer than most people were seeing.": "Zico, son ami proche et Shoddy B ont fait un seul voyage cette année-là. Pas de marque, pas de flyer, pas de stratégie. Juste la conviction commune que le Ghana avait plus à offrir que ce que beaucoup voyaient.",
      "16 strangers. One minibus. Easter weekend.": "16 inconnus. Un minibus. Week-end de Pâques.",
      "The first proper group trip. Beach, tents, music, and a minibus full of people who barely knew each other turning familiar by day three.": "Le premier vrai voyage de groupe. Plage, tentes, musique, et un minibus plein de gens qui se connaissaient à peine et qui sont devenus familiers au troisième jour.",
      "A waterfall. A thought. A text message.": "Une cascade. Une idée. Un message.",
      "Asenema filled from a simple text. Akwamu Gorge proved the tougher routes could work. Keta brought the biggest crowd yet and made the community visible to more people.": "Asenema s'est rempli avec un simple message. La gorge d'Akwamu a prouvé que les parcours plus durs pouvaient marcher. Keta a amené la plus grande foule jusque-là et rendu la communauté visible à plus de monde.",
      "Togo took the group across the border.": "Le Togo a emmené le groupe de l'autre côté de la frontière.",
      "The January island day widened the circle. Togo added the first passport stamp. What began with Ghana weekends now has real cross-border pull.": "La journée insulaire de janvier a élargi le cercle. Le Togo a ajouté le premier tampon de passeport. Ce qui a commencé avec des week-ends au Ghana attire maintenant au-delà des frontières.",
      "Why the name": "Pourquoi ce nom",
      "He did not want \"Travel with Zico.\"": "Il ne voulait pas de \"Travel with Zico\".",
      "He wanted something bigger.": "Il voulait quelque chose de plus grand.",
      "Adventures of Life works because it still sounds like what the trips are. They are adventures. They are part of people's actual lives. The name keeps meaning the same thing every time somebody says it.": "Adventures of Life fonctionne parce que le nom ressemble encore à ce que sont les voyages. Ce sont des aventures. Elles font partie de la vraie vie des gens. Le nom garde le même sens chaque fois que quelqu'un le dit.",
      "The standard": "Le standard",
      "Three things Zico": "Trois choses que Zico",
      "does not compromise on.": "ne négocie pas.",
      "The route has to earn its place.": "Le parcours doit mériter sa place.",
      "Every destination is personally visited first. If the terrain does not deliver, it never becomes a published trip.": "Chaque destination est visitée personnellement d'abord. Si le terrain ne tient pas ses promesses, il ne devient jamais un voyage publié.",
      "He knows your name before you arrive.": "Il connaît ton nom avant ton arrivée.",
      "Small groups mean real hosting, not crowd management. People feel that difference almost immediately.": "Les petits groupes permettent un vrai accueil, pas une gestion de foule. Les gens sentent la différence presque tout de suite.",
      "You leave with something to keep.": "Tu repars avec quelque chose à garder.",
      "Photos, shared moments, and the record of the day are treated like part of the trip, not something tacked on later.": "Les photos, les moments partagés et la mémoire de la journée font partie du voyage, pas un ajout après coup.",
      "Behind the trips": "Derrière les voyages",
      "One lead.": "Un responsable.",
      "Zero shortcuts.": "Zéro raccourci.",
      "Founder": "Fondateur",
      "Zico": "Zico",
      "Still scouts the routes, sets the timing, hosts the trips, and replies to the first message himself.": "Il repère toujours les parcours, fixe le timing, accueille les voyageurs et répond lui-même au premier message.",
      "Route check": "Vérification du parcours",
      "Every route is walked first": "Chaque parcours est d'abord testé à pied",
      "Climbs, waterfall paths, border stops, and timing are checked before the group arrives, so the day feels smooth when it is time to move.": "Montées, chemins de cascade, arrêts frontaliers et timing sont vérifiés avant l'arrivée du groupe, pour que la journée soit fluide au moment de bouger.",
      "2026 and beyond": "2026 et au-delà",
      "Three friends became 60+.": "Trois amis sont devenus plus de 60.",
      "Where do you want to join in?": "Où veux-tu rejoindre ?",
      "Togo took the trips beyond Ghana. More West African routes are on the way, and Zico still reads the messages himself.": "Le Togo a emmené les voyages au-delà du Ghana. D'autres routes ouest-africaines arrivent, et Zico lit toujours lui-même les messages.",
      "Built by someone who hosts the trip, not just sells it.": "Construit par quelqu'un qui accueille le voyage, pas seulement qui le vend.",

      "Côte d'Ivoire Trip From Accra | 28 August | Adventures of Life GH": "Voyage en Côte d'Ivoire depuis Accra | 28 août | Adventures of Life GH",
      "See all journeys": "Voir tous les voyages",
      "Trip details": "Détails du voyage",
      "Next trip / 28 August to 2 September 2026": "Prochain voyage / 28 août au 2 septembre 2026",
      "Leave Accra in the evening, wake up near the border, and spend three nights discovering four cities with a group that makes the road feel shorter.": "Quitte Accra le soir, réveille-toi près de la frontière et passe trois nuits à découvrir quatre villes avec un groupe qui rend la route plus courte.",
      "3 nights / 4 days": "3 nuits / 4 jours",
      "Four cities": "Quatre villes",
      "GHS 3,300": "3 300 GHS",
      "GHS 500 deposit": "Acompte de 500 GHS",
      "Secure your slot": "Réserver ta place",
      "See the full lineup": "Voir tout le programme",
      "See Côte d’Ivoire trip details": "Voir les détails du voyage en Côte d'Ivoire",
      "Installment payments are available after the GHS 500 deposit.": "Le paiement échelonné est disponible après l'acompte de 500 GHS.",
      "Official trip flyer / Adventures of Life GH": "Flyer officiel du voyage / Adventures of Life GH",
      "The trip at a glance": "Le voyage en un coup d'œil",
      "Four days across Côte d’Ivoire.": "Quatre jours à travers la Côte d'Ivoire.",
      "One overnight road from Accra.": "Une route de nuit depuis Accra.",
      "Travel dates": "Dates du voyage",
      "28 Aug - 2 Sep": "28 août - 2 septembre",
      "Depart Accra on the evening of 28 August and arrive back in Accra on 2 September.": "Départ d'Accra le soir du 28 août et retour à Accra le 2 septembre.",
      "Stay": "Séjour",
      "The overnight drive gets the group into Abidjan in the morning, ready for four days in Côte d’Ivoire.": "Le trajet de nuit amène le groupe à Abidjan le matin, prêt pour quatre jours en Côte d'Ivoire.",
      "Payment": "Paiement",
      "GHS 500 holds your slot": "500 GHS réservent ta place",
      "Pay the remaining balance in installments that work for you, or complete the full payment at once.": "Règle le solde en plusieurs versements adaptés à ton budget, ou paie la totalité en une fois.",
      "Abidjan and beyond": "Abidjan et au-delà",
      "City mornings, coastlines and culture.": "Matins en ville, littoral et culture.",
      "Four places, one crew.": "Quatre lieux, un seul groupe.",
      "Abidjan is the base, with time planned across Grand-Bassam, Assinie and Yamoussoukro. Expect a mix of city energy, historic stops, coastal views and the everyday culture that makes crossing the border worth it.": "Abidjan sert de base, avec des étapes prévues à Grand-Bassam, Assinie et Yamoussoukro. Attends-toi à un mélange d'énergie urbaine, de lieux historiques, de vues côtières et de culture ivoirienne au quotidien.",
      "The journey begins overnight, so most of the long drive passes while the group sleeps. By morning, the border formalities are the last step before the experience properly begins.": "Le voyage commence de nuit, donc la majeure partie de la route se fait pendant que le groupe dort. Au matin, les formalités à la frontière sont la dernière étape avant le vrai début de l'expérience.",
      "Included in GHS 3,300": "Inclus dans les 3 300 GHS",
      "The essentials are already covered.": "L'essentiel est déjà compris.",
      "You can focus on the experience.": "Tu peux profiter pleinement de l'expérience.",
      "Transport": "Transport",
      "Return group transport between Accra and Côte d’Ivoire, plus the movement planned for the trip.": "Transport aller-retour en groupe entre Accra et la Côte d'Ivoire, ainsi que les déplacements prévus pendant le voyage.",
      "Accommodation and meals": "Hébergement et repas",
      "Three nights of accommodation and feeding throughout the four-day experience.": "Trois nuits d'hébergement et les repas pendant les quatre jours.",
      "Tourist-site access": "Accès aux sites touristiques",
      "Entry fees, tourist-site charges and the trip details listed on the official flyer.": "Frais d'entrée, accès aux sites touristiques et prestations indiquées sur le flyer officiel.",
      "Before you book": "Avant de réserver",
      "The questions people ask first.": "Les premières questions que les voyageurs posent.",
      "When do we leave and return?": "Quand partons-nous et quand revenons-nous ?",
      "The group leaves Accra on the evening of": "Le groupe quitte Accra le soir du",
      "and returns to Accra on": "et revient à Accra le",
      "How much do I need to secure a slot?": "Combien faut-il pour réserver une place ?",
      "secures your slot. The remaining balance can be paid in installments or in full.": "réservent ta place. Le solde peut être payé en plusieurs fois ou en totalité.",
      "Who can I contact for more information?": "Qui contacter pour plus d'informations ?",
      "Use the WhatsApp booking button below to speak directly with Zico about your slot and payment plan.": "Utilise le bouton WhatsApp ci-dessous pour parler directement à Zico de ta place et de ton plan de paiement.",
      "Secure your place": "Réserve ta place",
      "Start with GHS 500.": "Commence avec 500 GHS.",
      "Choose how you pay the rest.": "Choisis comment régler le reste.",
      "Message Zico with your name and say you want a slot for the Côte d’Ivoire trip departing 28 August.": "Écris à Zico avec ton nom et précise que tu veux une place pour le voyage en Côte d'Ivoire du 28 août.",
      "Secure your slot on WhatsApp": "Réserver ta place sur WhatsApp",
      "Trips around Ghana and West Africa that feel like someone local invited you along.": "Des voyages au Ghana et en Afrique de l'Ouest qui donnent l'impression qu'un local t'a invité.",
      "A four-day group trip from Accra to Cote d'Ivoire with Adventures of Life GH, including transport, accommodation, meals and attraction fees.": "Un voyage de groupe de quatre jours d'Accra vers la Côte d'Ivoire avec Adventures of Life GH, comprenant le transport, l'hébergement, les repas et les frais de visite.",
      "La Cote d'Ivoire Experience": "L'expérience Côte d'Ivoire",
      "Privacy": "Confidentialité",
      "Booking terms": "Conditions de réservation",
      "Next trip": "Prochain voyage",
      "Privacy / Plain language": "Confidentialité / En langage clair",
      "Your information should help us host you.": "Tes informations doivent nous aider à bien t'accueillir.",
      "It should not travel further than it needs to.": "Elles ne doivent pas aller plus loin que nécessaire.",
      "Effective 10 July 2026": "En vigueur le 10 juillet 2026",
      "What we collect": "Ce que nous collectons",
      "When you ask about a trip, we collect your name, email address, chosen trip, message, and the page where you submitted the form. When a verified attendee posts a review, we store the attendee name and contact supplied for verification, the trip, rating, review text, and submission date. Public reviews show a shortened name, not the attendee contact.": "Lorsque tu demandes des informations sur un voyage, nous collectons ton nom, ton adresse e-mail, le voyage choisi, ton message et la page depuis laquelle tu as envoyé le formulaire. Lorsqu'un participant vérifié publie un avis, nous conservons son nom et son contact de vérification, le voyage, la note, le texte de l'avis et la date d'envoi. Les avis publics affichent un nom abrégé, jamais le contact du participant.",
      "Security information": "Informations de sécurité",
      "We process an IP address for short-term rate limiting and use Cloudflare Turnstile to distinguish real submissions from automated abuse. Cloudflare may process technical request information under its own privacy terms. We do not use this security information to build advertising profiles.": "Nous traitons une adresse IP pour limiter temporairement les abus et utilisons Cloudflare Turnstile afin de distinguer les vrais envois des attaques automatisées. Cloudflare peut traiter des informations techniques selon ses propres conditions de confidentialité. Nous n'utilisons pas ces données de sécurité pour créer des profils publicitaires.",
      "How we use the information": "Comment nous utilisons les informations",
      "We use inquiry details to answer questions, arrange bookings, share trip instructions, and follow up about the trip requested. We use verified reviews to show genuine attendee feedback. We use operational records to prevent fraud, investigate abuse, and keep the service working.": "Nous utilisons les demandes pour répondre aux questions, organiser les réservations, transmettre les consignes et assurer le suivi du voyage demandé. Les avis vérifiés servent à présenter de vrais retours de participants. Les données opérationnelles servent à prévenir la fraude, enquêter sur les abus et maintenir le service.",
      "Who receives it": "Qui reçoit ces informations",
      "Information is stored in Cloudflare D1 and processed through Cloudflare Pages and Turnstile. If operational notifications are enabled, a signed copy may be sent to an automation endpoint controlled by Adventures of Life GH. We do not sell personal information. We disclose it only when required by law or necessary to deliver a requested trip.": "Les informations sont stockées dans Cloudflare D1 et traitées via Cloudflare Pages et Turnstile. Si les notifications opérationnelles sont activées, une copie signée peut être envoyée vers un service d'automatisation contrôlé par Adventures of Life GH. Nous ne vendons aucune information personnelle. Nous ne la communiquons que si la loi l'exige ou si cela est nécessaire pour fournir le voyage demandé.",
      "How long we keep it": "Durée de conservation",
      "Trip inquiries are automatically deleted 24 months after the most recent inbox update. Expired review links and their attendee contact details are removed after a 30-day operational grace period; used or revoked links are removed after 24 months. Rate-limit records are deleted after approximately 48 hours. Published reviews remain visible until the attendee asks for removal or the review is withdrawn for safety, accuracy, or policy reasons.": "Les demandes de voyage sont automatiquement supprimées 24 mois après la dernière mise à jour dans la boîte de réception. Les liens d'avis expirés et les coordonnées des participants associées sont supprimés après un délai opérationnel de 30 jours ; les liens utilisés ou révoqués sont supprimés après 24 mois. Les données de limitation sont supprimées après environ 48 heures. Les avis publiés restent visibles jusqu'à ce que le participant demande leur suppression ou qu'ils soient retirés pour des raisons de sécurité, d'exactitude ou de politique.",
      "Your choices": "Tes choix",
      "You may ask to see, correct, or delete the personal information Adventures of Life GH holds about you. You may also ask for a public review to be removed. Some booking or transaction records may need to be retained where the law or an unresolved dispute requires it.": "Tu peux demander à consulter, corriger ou supprimer les informations personnelles qu'Adventures of Life GH détient à ton sujet. Tu peux aussi demander le retrait d'un avis public. Certains documents de réservation ou de transaction peuvent devoir être conservés lorsque la loi ou un litige non résolu l'exige.",
      "Send a privacy request to Zico on": "Envoie ta demande de confidentialité à Zico sur",
      "WhatsApp at 055 147 2190": "WhatsApp au 055 147 2190",
      ". We may ask for enough information to confirm the request belongs to you before changing or deleting a record.": ". Nous pouvons demander suffisamment d'informations pour confirmer que la demande vient bien de toi avant de modifier ou supprimer un dossier.",
      "Booking terms / Before you pay": "Conditions de réservation / Avant de payer",
      "Clear expectations before the road.": "Des règles claires avant le départ.",
      "No surprise policy after payment.": "Aucune surprise après le paiement.",
      "When a slot is secured": "Quand une place est réservée",
      "A message or inquiry does not reserve a place. A slot is secured only after Adventures of Life GH confirms availability, gives you the trip-specific payment and cancellation terms in writing, and confirms receipt of the required deposit or payment.": "Un message ou une demande ne réserve pas une place. La place est confirmée uniquement après qu'Adventures of Life GH a validé la disponibilité, communiqué par écrit les conditions de paiement et d'annulation propres au voyage, puis confirmé la réception de l'acompte ou du paiement demandé.",
      "Prices and installment plans": "Prix et paiements échelonnés",
      "The price, deposit, payment dates, and included items shown on the current trip page or sent directly by Zico apply to that trip. Where installments are offered, the traveller chooses an available payment schedule and remains responsible for completing it by the agreed deadline.": "Le prix, l'acompte, les dates de paiement et les prestations indiqués sur la page du voyage ou envoyés directement par Zico s'appliquent à ce voyage. Lorsqu'un paiement échelonné est proposé, le voyageur choisit un calendrier disponible et doit le terminer avant l'échéance convenue.",
      "Traveller cancellation": "Annulation par le voyageur",
      "Tell Zico as early as possible if you cannot travel. Before accepting payment, Adventures of Life GH will state whether the deposit is refundable and identify any supplier costs that may become non-refundable. Any refund after a traveller cancellation is based on those written trip-specific terms and the money that can actually be recovered from transport, accommodation, attraction, and other suppliers.": "Préviens Zico le plus tôt possible si tu ne peux plus voyager. Avant d'accepter le paiement, Adventures of Life GH précisera si l'acompte est remboursable et quels frais de prestataires peuvent devenir non remboursables. Tout remboursement après une annulation du voyageur dépend des conditions écrites du voyage et des sommes réellement récupérables auprès des transporteurs, hébergements, sites et autres prestataires.",
      "If Adventures of Life GH cancels": "Si Adventures of Life GH annule",
      "If Adventures of Life GH cancels a trip and does not provide an alternative accepted by the traveller, amounts paid for services that will not be delivered will be returned. A traveller will be told promptly about the cancellation and the expected refund route. Costs booked independently by a traveller are not covered unless Adventures of Life GH agreed to them in writing.": "Si Adventures of Life GH annule un voyage sans proposer d'alternative acceptée par le voyageur, les montants payés pour les services non fournis seront remboursés. Le voyageur sera informé rapidement de l'annulation et du mode de remboursement prévu. Les dépenses réservées indépendamment ne sont pas couvertes, sauf accord écrit d'Adventures of Life GH.",
      "Changes caused by weather, borders, or safety": "Changements liés à la météo, aux frontières ou à la sécurité",
      "Road conditions, weather, opening hours, border controls, and safety concerns can require a stop, time, accommodation, or route to change. A reasonable replacement may be used where necessary. A major change will be explained as soon as practical, together with any choice or refund required by the trip-specific terms.": "L'état des routes, la météo, les horaires, les contrôles frontaliers ou la sécurité peuvent imposer un changement d'étape, d'heure, d'hébergement ou d'itinéraire. Une solution de remplacement raisonnable peut être utilisée si nécessaire. Tout changement important sera expliqué dès que possible, avec les choix ou remboursements prévus par les conditions du voyage.",
      "Documents and border travel": "Documents et voyages transfrontaliers",
      "For international trips, each traveller is responsible for carrying the passport, identification, vaccination evidence, visa, and other documents required for their circumstances. Ask before paying if you are unsure. Adventures of Life GH can share general guidance but cannot guarantee entry by immigration authorities.": "Pour les voyages internationaux, chaque voyageur doit disposer du passeport, de la pièce d'identité, des preuves de vaccination, du visa et des autres documents exigés selon sa situation. Demande avant de payer si tu as un doute. Adventures of Life GH peut donner des indications générales mais ne peut pas garantir l'admission par les services d'immigration.",
      "Safety and conduct": "Sécurité et comportement",
      "Travellers must follow reasonable safety instructions, respect other attendees and local communities, and disclose any condition that could materially affect safe participation. Serious harassment, violence, illegal activity, or conduct that puts the group at risk may result in removal without reimbursement of costs already used.": "Les voyageurs doivent suivre les consignes de sécurité raisonnables, respecter les autres participants et les communautés locales, et signaler toute condition pouvant affecter leur participation en sécurité. Le harcèlement grave, la violence, une activité illégale ou un comportement mettant le groupe en danger peuvent entraîner une exclusion sans remboursement des frais déjà engagés.",
      "Photos and privacy": "Photos et confidentialité",
      "Trip photos may be used to document the community and promote future trips. Tell Zico before or during the trip if you do not want a close-up image of you published. Personal information is handled under the": "Les photos du voyage peuvent servir à documenter la communauté et promouvoir de futurs voyages. Préviens Zico avant ou pendant le voyage si tu ne veux pas qu'un portrait rapproché soit publié. Les informations personnelles sont traitées selon l'",
      "privacy and data-retention notice": "avis de confidentialité et de conservation des données",
      "Questions or a refund request": "Questions ou demande de remboursement",
      "Keep your payment confirmation and the written terms sent for your trip. Contact Zico on": "Conserve ta confirmation de paiement et les conditions écrites de ton voyage. Contacte Zico sur",
      "with the traveller name, trip, payment date, and the issue to be reviewed.": "avec le nom du voyageur, le voyage, la date de paiement et le problème à examiner.",

      "Most people come for one trip. A lot of them end up staying in touch.": "La plupart viennent pour un voyage. Beaucoup finissent par rester en contact.",
      "Copyright 2026 Adventures of Life GH / Ghana": "Copyright 2026 Adventures of Life GH / Ghana"
    }
  };

  const attributeTranslations = {
    fr: {
      "Adventures of Life home": "Accueil Adventures of Life",
      "Primary": "Navigation principale",
      "Social links": "Liens sociaux",
      "WhatsApp": "WhatsApp",
      "TikTok": "TikTok",
      "Instagram": "Instagram",
      "Snapchat": "Snapchat",
      "Completed Adventures of Life trips": "Voyages Adventures of Life déjà réalisés",
      "Show previous trip photo": "Afficher la photo précédente",
      "Show next trip photo": "Afficher la photo suivante",
      "Choose a trip photo": "Choisir une photo de voyage",
      "Show Oboadaka Waterfall": "Afficher la cascade d'Oboadaka",
      "Show Shai Reserve and Kwaminga Park": "Afficher Shai Reserve et Kwaminga Park",
      "Show the Togo Vibe Experience": "Afficher le Togo Vibe Experience",
      "Show Nkyinkyim Museum and Ada": "Afficher le musée Nkyinkyim et Ada",
      "Show Asenema Waterfall": "Afficher la cascade d'Asenema",
      "Show Hike Adakluto": "Afficher la randonnée Adakluto",
      "Pause automatic slideshow": "Mettre le diaporama automatique en pause",
      "Resume automatic slideshow": "Reprendre le diaporama automatique",
      "Close next trip popup": "Fermer la fenêtre du prochain voyage",
      "Official flyer for La Cote d'Ivoire Experience": "Flyer officiel de l'expérience Côte d'Ivoire",
      "Ask about the Cote d'Ivoire trip on WhatsApp": "Demander le voyage en Côte d'Ivoire sur WhatsApp",
      "Chat on WhatsApp": "Discuter sur WhatsApp",
      "First name is fine": "Le prénom suffit",
      "What did the trip actually feel like?": "Qu'est-ce que le voyage t'a vraiment fait ressentir ?",
      "Hello Adventures of Life, I want help planning a trip in Ghana or nearby West African countries.": "Bonjour Adventures of Life, je veux de l'aide pour planifier un voyage au Ghana ou dans un pays voisin d'Afrique de l'Ouest.",
      "Hello Adventures of Life, I want to secure a slot for the Cote d'Ivoire trip.": "Bonjour Adventures of Life, je veux réserver une place pour le voyage en Côte d'Ivoire.",
      "Hello Adventures of Life, I want to ask about the next trip.": "Bonjour Adventures of Life, je veux demander des informations sur le prochain voyage.",
      "Hello Adventures of Life, I want to start planning a trip.": "Bonjour Adventures of Life, je veux commencer à planifier un voyage.",
      "Hello Adventures of Life, I want details about the Pre-Cote d'Ivoire House Party on 31 July.": "Bonjour Adventures of Life, je veux des informations sur la House Party pré-Côte d'Ivoire du 31 juillet.",
      "Hello Adventures of Life, I want to ask about Wli Waterfalls Camping on 12 September.": "Bonjour Adventures of Life, je veux des informations sur le camping aux cascades de Wli du 12 septembre.",
      "Hello Adventures of Life, I want to ask about the Amedzofe Canopy Walkway trip on 17 October.": "Bonjour Adventures of Life, je veux des informations sur la sortie à la passerelle de canopée d'Amedzofe du 17 octobre.",
      "Hello Adventures of Life, I want to ask about the Sporting Activities and Food Festival on 14 November.": "Bonjour Adventures of Life, je veux des informations sur les activités sportives et le festival culinaire du 14 novembre.",
      "Hello Adventures of Life, I want to ask about the Benin end-of-year celebration on 24 December.": "Bonjour Adventures of Life, je veux des informations sur la célébration de fin d'année au Bénin du 24 décembre."
    }
  };

  const pageMetaTranslations = {
    fr: {
      "Adventures of Life GH | Trips Across Ghana": "Adventures of Life GH | Voyages au Ghana",
      "Adventures of Life GH | Trips in Ghana and West Africa": "Adventures of Life GH | Voyages au Ghana et en Afrique de l'Ouest",
      "Group trips across Ghana with hikes, waterfalls, beach weekends, museum days, and routes people keep talking about after the ride home.": "Voyages de groupe au Ghana avec randonnées, cascades, week-ends plage, musées et parcours dont les gens parlent encore après le retour.",
      "Journeys | Adventures of Life GH": "Voyages | Adventures of Life GH",
      "Group trips in Ghana and West Africa from Adventures of Life GH: day trips, border runs, waterfall routes, camp weekends, and upcoming travel dates.": "Voyages de groupe au Ghana et en Afrique de l'Ouest avec Adventures of Life GH : sorties d'une journée, passages de frontière, cascades, week-ends camping et prochaines dates.",
      "See the confirmed Adventures of Life GH 2026 lineup: completed Ghana and Togo trips, the 31 July house party, Cote d'Ivoire, Wli, Amedzofe, the sports and food festival, and Benin.": "Découvre le programme 2026 confirmé d'Adventures of Life GH : voyages déjà réalisés au Ghana et au Togo, House Party du 31 juillet, Côte d'Ivoire, Wli, Amedzofe, festival sportif et culinaire, puis Bénin.",
      "Community | Adventures of Life GH": "Communauté | Adventures of Life GH",
      "Real trip photos, real group memories, and verified reviews from Adventures of Life GH travellers across Ghana and West Africa.": "Vraies photos de voyage, vrais souvenirs de groupe et avis vérifiés des voyageurs Adventures of Life GH au Ghana et en Afrique de l'Ouest.",
      "About | Adventures of Life GH": "À propos | Adventures of Life GH",
      "The story behind Adventures of Life GH, founded by Zico to host real group trips across Ghana and nearby West African countries.": "L'histoire d'Adventures of Life GH, fondé par Zico pour organiser de vrais voyages de groupe au Ghana et dans les pays voisins d'Afrique de l'Ouest.",
      "Côte d'Ivoire Trip From Accra | 28 August | Adventures of Life GH": "Voyage en Côte d'Ivoire depuis Accra | 28 août | Adventures of Life GH",
      "Côte d'Ivoire Trip From Accra | 28 August": "Voyage en Côte d'Ivoire depuis Accra | 28 août",
      "Join a four-day Cote d'Ivoire group trip from Accra, departing 28 August 2026. GHS 3,300 total, with a GHS 500 deposit and installment payments available.": "Rejoins un voyage de groupe de quatre jours en Côte d'Ivoire depuis Accra, au départ du 28 août 2026. 3 300 GHS au total, avec un acompte de 500 GHS et paiement échelonné.",
      "Four cities, three nights and four days in Cote d'Ivoire. Depart Accra on 28 August with a GHS 500 deposit to secure your slot.": "Quatre villes, trois nuits et quatre jours en Côte d'Ivoire. Départ d'Accra le 28 août avec un acompte de 500 GHS pour réserver ta place.",
      "Privacy & Data Retention | Adventures of Life GH": "Confidentialité et conservation des données | Adventures of Life GH",
      "How Adventures of Life GH collects, uses, protects, and deletes personal information from trip inquiries, bookings, and verified reviews.": "Comment Adventures of Life GH collecte, utilise, protège et supprime les informations personnelles liées aux demandes, réservations et avis vérifiés.",
      "Booking, Cancellation & Refund Terms | Adventures of Life GH": "Conditions de réservation, d'annulation et de remboursement | Adventures of Life GH",
      "Plain-language booking, payment, cancellation, refund, itinerary, and traveller responsibility terms for Adventures of Life GH trips.": "Conditions claires concernant la réservation, le paiement, l'annulation, le remboursement, l'itinéraire et les responsabilités des voyageurs Adventures of Life GH."
    }
  };

  window.AOL_I18N_DATA = {
    translations,
    attributeTranslations,
    pageMetaTranslations,
  };

  const originalText = new WeakMap();
  const originalAttributes = new WeakMap();
  let currentLanguage = DEFAULT_LANGUAGE;
  let isApplyingLanguage = false;

  const normalize = (value) => value.replace(/\s+/g, " ").trim();
  const getLanguage = () => {
    const staticLocale = document.body?.dataset.staticLocale;
    if (SUPPORTED_LANGUAGES.includes(staticLocale)) return staticLocale;

    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return SUPPORTED_LANGUAGES.includes(saved) ? saved : DEFAULT_LANGUAGE;
    } catch (error) {
      return DEFAULT_LANGUAGE;
    }
  };

  const saveLanguage = (language) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch (error) {
      // Language switching should still work for the current page if storage is blocked.
    }
  };

  const getAttributeOriginal = (element, attribute) => {
    let map = originalAttributes.get(element);
    if (!map) {
      map = {};
      originalAttributes.set(element, map);
    }
    if (!(attribute in map)) {
      map[attribute] = element.getAttribute(attribute) || "";
    }
    return map[attribute];
  };

  const restoreAttribute = (element, attribute) => {
    const map = originalAttributes.get(element);
    if (map && attribute in map) {
      element.setAttribute(attribute, map[attribute]);
    }
  };

  const shouldSkipNode = (node) => {
    const parent = node.parentElement;
    if (!parent) return true;
    if (parent.closest("[data-i18n-skip]")) return true;
    return Boolean(parent.closest("script, style, noscript, svg, textarea, code, pre"));
  };

  const translateTextNode = (node, language) => {
    if (shouldSkipNode(node)) return;
    if (!originalText.has(node)) {
      originalText.set(node, node.nodeValue);
    }

    const source = originalText.get(node) || "";
    const key = normalize(source);
    if (!key) return;

    if (language === DEFAULT_LANGUAGE) {
      if (node.nodeValue !== source) node.nodeValue = source;
      return;
    }

    const translated = translations[language]?.[key];
    if (!translated) return;

    const leading = source.match(/^\s*/)?.[0] || "";
    const trailing = source.match(/\s*$/)?.[0] || "";
    const nextValue = `${leading}${translated}${trailing}`;
    if (node.nodeValue !== nextValue) node.nodeValue = nextValue;
  };

  const translateTextWithin = (root, language) => {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      translateTextNode(root, language);
      return;
    }

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      translateTextNode(node, language);
      node = walker.nextNode();
    }
  };

  const translateAttributes = (root, language) => {
    if (!root.querySelectorAll) return;
    const dictionary = attributeTranslations[language] || {};
    const attributes = ["aria-label", "title", "placeholder", "data-message"];

    root.querySelectorAll("[aria-label], [title], [placeholder], [data-message]").forEach((element) => {
      attributes.forEach((attribute) => {
        if (!element.hasAttribute(attribute)) return;
        const source = getAttributeOriginal(element, attribute);
        if (language === DEFAULT_LANGUAGE) {
          restoreAttribute(element, attribute);
          return;
        }
        const translated = dictionary[normalize(source)];
        if (translated) {
          element.setAttribute(attribute, translated);
        }
      });
    });
  };

  const translateMeta = (language) => {
    const dictionary = pageMetaTranslations[language] || {};
    const titleSource = document.documentElement.dataset.i18nTitle || document.title;
    document.documentElement.dataset.i18nTitle = titleSource;
    document.title = language === DEFAULT_LANGUAGE ? titleSource : dictionary[titleSource] || titleSource;

    document
      .querySelectorAll('meta[name="description"], meta[property="og:title"], meta[property="og:description"], meta[name="twitter:title"], meta[name="twitter:description"]')
      .forEach((meta) => {
        const source = meta.dataset.i18nContent || meta.getAttribute("content") || "";
        meta.dataset.i18nContent = source;
        meta.setAttribute("content", language === DEFAULT_LANGUAGE ? source : dictionary[source] || source);
      });
  };

  const updateWhatsAppLinks = () => {
    const number = "233551472190";
    document.querySelectorAll("[data-whatsapp-link], [data-next-trip-cta]").forEach((link) => {
      const message = link.getAttribute("data-message");
      if (!message) return;
      link.setAttribute("href", `https://wa.me/${number}?text=${encodeURIComponent(message.trim())}`);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noreferrer");
    });
  };

  const updateSwitcherState = () => {
    document.querySelectorAll("[data-lang-option]").forEach((button) => {
      const isActive = button.dataset.langOption === currentLanguage;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  };

  const applyLanguage = (language) => {
    if (!SUPPORTED_LANGUAGES.includes(language)) return;
    isApplyingLanguage = true;
    currentLanguage = language;
    saveLanguage(language);
    document.documentElement.lang = language;
    document.body.dataset.language = language;
    translateMeta(language);
    translateTextWithin(document.body, language);
    translateAttributes(document, language);
    updateWhatsAppLinks();
    updateSwitcherState();
    isApplyingLanguage = false;
  };

  const buildSwitcher = () => {
    if (document.querySelector("[data-language-switcher]")) return;
    const actions = document.querySelector(".site-menu-actions");
    const target = actions || document.querySelector(".header-inner");
    if (!target) return;

    const switcher = document.createElement("div");
    switcher.className = "language-switcher";
    switcher.setAttribute("data-language-switcher", "");
    switcher.setAttribute("aria-label", "Language");

    const label = document.createElement("span");
    label.className = "language-switcher-label";
    label.textContent = "Language";

    const buildLanguageButton = (language, text, isActive) => {
      const button = document.createElement("button");
      button.className = "language-switcher-button";
      button.type = "button";
      button.dataset.langOption = language;
      button.setAttribute("aria-pressed", String(isActive));
      button.textContent = text;
      return button;
    };

    switcher.append(
      label,
      buildLanguageButton("en", "EN", true),
      buildLanguageButton("fr", "FR", false)
    );

    target.appendChild(switcher);
    switcher.addEventListener("click", (event) => {
      const button = event.target.closest("[data-lang-option]");
      if (!button) return;
      const language = button.dataset.langOption;
      const alternate = document.querySelector(`link[rel="alternate"][hreflang="${language}"]`);
      if (alternate?.href && new URL(alternate.href).pathname !== window.location.pathname) {
        saveLanguage(language);
        const alternateUrl = new URL(alternate.href);
        window.location.assign(`${window.location.origin}${alternateUrl.pathname}${alternateUrl.search}${alternateUrl.hash}`);
        return;
      }
      applyLanguage(language);
    });
  };

  const observeNewContent = () => {
    const observer = new MutationObserver((mutations) => {
      if (isApplyingLanguage || currentLanguage === DEFAULT_LANGUAGE) return;
      isApplyingLanguage = true;
      mutations.forEach((mutation) => {
        if (mutation.type === "characterData") {
          translateTextNode(mutation.target, currentLanguage);
        }
        mutation.addedNodes.forEach((node) => {
          translateTextWithin(node, currentLanguage);
          if (node.nodeType === Node.ELEMENT_NODE) {
            translateAttributes(node, currentLanguage);
          }
        });
      });
      updateWhatsAppLinks();
      isApplyingLanguage = false;
    });

    observer.observe(document.body, {
      childList: true,
      characterData: true,
      subtree: true
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    currentLanguage = getLanguage();
    if (!document.body?.dataset.staticLocale && currentLanguage !== DEFAULT_LANGUAGE) {
      const alternate = document.querySelector(
        `link[rel="alternate"][hreflang="${currentLanguage}"]`
      );
      if (alternate?.href) {
        const alternateUrl = new URL(alternate.href);
        window.location.replace(
          `${window.location.origin}${alternateUrl.pathname}${alternateUrl.search}${alternateUrl.hash}`
        );
        return;
      }
    }
    buildSwitcher();
    observeNewContent();
    applyLanguage(currentLanguage);
  });
})();
