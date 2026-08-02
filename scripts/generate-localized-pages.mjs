import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const base = "https://myshiftplanner.app";
const locales = ["en", "es", "fr", "de", "pt-br", "ja"];
const localeNames = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  "pt-br": "Português (Brasil)",
  ja: "日本語"
};

const appStoreBadges = {
  es: { file: "es-es.svg", width: "119.66407" },
  fr: { file: "fr-fr.svg", width: "126.51549" },
  de: { file: "de-de.svg", width: "119.66407" },
  "pt-br": { file: "pt-br.svg", width: "119.66407" },
  ja: { file: "ja-jp.svg", width: "108.85157" }
};

const copy = {
  es: {
    lang: "es",
    name: "Español",
    locale: "es_ES",
    siteName: "Mi Planificador de Turnos",
    brandLine: "Calendarios de turnos privados",
    language: "Idioma",
    nav: { home: "Inicio", nurse: "Enfermería", work: "Trabajo", about: "Acerca de" },
    home: {
      title: "Planificadores de turnos para trabajo y enfermería",
      description: "Organiza turnos, horas trabajadas e ingresos estimados con un calendario privado para enfermería o para otros trabajos por turnos.",
      eyebrow: "Dos planificadores especializados",
      h1: "Elige el planificador que se adapta a tu horario",
      lead: "Organiza turnos cambiantes, consulta tus horas y estima tus ingresos sin depender de hojas de cálculo ni calendarios genéricos.",
      choose: "Elige según tu trabajo",
      chooseText: "Ambas apps ofrecen planificación privada, perfiles de trabajo, estimaciones e informes. La terminología y los tipos de turno se adaptan a cada contexto.",
      scheduleTitle: "Tu horario, de un vistazo",
      scheduleText: "Añade turnos individuales, planifica varios días, aplica rotaciones y consulta qué viene después.",
      payTitle: "Horas e ingresos estimados",
      payText: "Registra horas, pluses, horas extra y bonificaciones para obtener una estimación mensual antes del pago.",
      privacyTitle: "Privado desde el inicio",
      privacyText: "Los datos se guardan primero en tu dispositivo. La sincronización con iCloud es opcional.",
      faqTitle: "Preguntas frecuentes",
      faqs: [
        ["¿Sustituye al horario oficial de mi empresa?", "No. Es un planificador personal. Confirma siempre los horarios y los datos de nómina en los sistemas oficiales de tu empresa."],
        ["¿Puedo organizar varios lugares de trabajo?", "Sí. Puedes crear varios perfiles con su centro, función, tarifa y turnos correspondientes."],
        ["¿Las estimaciones de ingresos son una nómina exacta?", "No. Son estimaciones basadas en los datos que introduces. Los impuestos, convenios, reglas locales y redondeos pueden cambiar el importe final."],
        ["¿Puedo exportar mis turnos?", "Sí. Ambas apps permiten crear informes CSV y PDF mensuales y anuales."]
      ]
    },
    nurse: {
      name: "Mis Turnos de Enfermería",
      title: "Calendario de turnos y control de ingresos para enfermería",
      description: "Planifica turnos de enfermería, controla horas e ingresos estimados y organiza varios centros en un calendario privado.",
      eyebrow: "Diseñado para horarios de enfermería",
      h1: "Tus turnos de enfermería, organizados en un solo lugar",
      lead: "Planifica turnos de día y noche, guardias, avisos, horas extra, vacaciones y bajas con una vista mensual pensada para el trabajo sanitario.",
      cta: "Ver en el App Store",
      imageAlt: "Pantalla en español de Mis Turnos de Enfermería con horas e ingresos estimados",
      features: ["Calendario mensual", "Turnos de día y noche", "Guardias y avisos", "Horas extra", "Hasta 10 perfiles", "Exportación CSV y PDF"],
      sections: [
        ["Planifica horarios sanitarios reales", "Registra turnos de día, tarde y noche, guardias, avisos, horas extra, formación, vacaciones, bajas y turnos cancelados. Las rotaciones y la planificación de varios días reducen el trabajo repetitivo."],
        ["Sigue horas e ingresos", "Configura tarifa por hora, plus nocturno, fin de semana, festivos, horas extra, descansos y bonificaciones. Las cifras son estimaciones para planificar, no cálculos oficiales de nómina."],
        ["Varios centros, una sola vista", "Crea perfiles para hospitales, unidades, clínicas, agencias o trabajo eventual y asigna cada turno al lugar correcto."]
      ],
      detailsTitle: "Qué puedes organizar",
      details: ["Turnos diurnos, nocturnos y rotativos", "Guardias, avisos y horas extra", "Vacaciones, bajas, formación y cancelaciones", "Perfiles con tarifas y lugares distintos", "Recordatorios locales antes de los turnos", "Widgets de inicio y pantalla bloqueada"],
      faqTitle: "Preguntas sobre el planificador de enfermería",
      faqs: [
        ["¿Está pensado solo para hospitales?", "No. También sirve para clínicas, agencias, residencias, atención domiciliaria y otros entornos sanitarios."],
        ["¿Puedo registrar turnos de 12 horas?", "Sí. Puedes configurar la hora de inicio y fin, incluidos turnos que terminan al día siguiente."],
        ["¿Mis datos se envían a un servidor propio?", "La app prioriza el almacenamiento local. Si activas iCloud, Apple sincroniza los datos seleccionados entre tus dispositivos."],
        ["¿Se necesita una suscripción?", "La descarga es gratuita. El acceso completo requiere una suscripción autorrenovable después de la prueba gratuita aplicable."]
      ]
    },
    work: {
      name: "Mis Turnos de Trabajo",
      title: "Calendario laboral, horas e ingresos estimados",
      description: "Organiza turnos de trabajo, horas, varios empleos e ingresos estimados en un calendario privado para iPhone y iPad.",
      eyebrow: "Para cualquier trabajo por turnos",
      h1: "Tu calendario laboral, siempre organizado",
      lead: "Planifica turnos cambiantes, controla horas y estima ingresos en distintos centros, contratos o empleos desde una sola app privada.",
      cta: "Ver en el App Store",
      imageAlt: "Pantalla en español de Mis Turnos de Trabajo con calendario mensual",
      features: ["Calendario de turnos", "Varios empleos", "Reglas de horas extra", "Ingresos estimados", "Temas de color", "Informes CSV y PDF"],
      sections: [
        ["Hecho para horarios variables", "Organiza turnos de día, tarde y noche, horas extra, guardias, disponibilidad, turnos partidos o dobles, formación, reuniones, vacaciones, bajas y cancelaciones."],
        ["Cada trabajo, bien separado", "Gestiona hasta 10 perfiles para tiendas, hoteles, fábricas, logística, servicios públicos, contratos o empleos a tiempo parcial."],
        ["Planifica antes del día de pago", "Añade tarifas, pluses, descansos, bonificaciones y reglas de horas extra para ver una estimación mensual. El resultado es orientativo y no sustituye a la nómina."]
      ],
      detailsTitle: "Herramientas para tu jornada",
      details: ["Planificación individual o de varios días", "Rotaciones y ciclos personalizados", "Horas, pluses y bonificaciones", "Perfiles de trabajo independientes", "Temas suaves para personalizar la app", "Widgets, notificaciones e informes"],
      faqTitle: "Preguntas sobre el planificador de trabajo",
      faqs: [
        ["¿Sirve para distintos sectores?", "Sí. Está pensado para cualquier persona con horarios por turnos, variables o repartidos entre varios lugares."],
        ["¿Puedo usar diferentes tarifas?", "Sí. Cada perfil puede tener su propia configuración de pago y sus turnos asignados."],
        ["¿Calcula automáticamente los impuestos?", "No. Muestra una estimación bruta basada en tus ajustes. La nómina real depende de tu empresa y de las reglas locales."],
        ["¿Puedo cambiar el aspecto?", "Sí. Puedes elegir entre varios temas de colores suaves sin cambiar los colores de las etiquetas de turno."]
      ]
    },
    about: {
      title: "Acerca de My Shift Planner",
      description: "Conoce al desarrollador de My Shift Planner y el propósito, la experiencia de producto y los límites de este sitio.",
      eyebrow: "Quién está detrás del producto",
      h1: "Herramientas prácticas para horarios que cambian",
      lead: "My Shift Planner reúne dos apps independientes creadas para ayudar a personas con turnos a organizar su propio calendario, sus horas y sus estimaciones de ingresos.",
      cards: [
        ["Desarrollo independiente", "My Nurse Shift Planner y My Work Shift Planner se diseñan, desarrollan, prueban y mantienen de forma independiente, junto con este sitio."],
        ["Por qué existen estas apps", "Los horarios por turnos no encajan bien en muchos calendarios genéricos. El objetivo es ofrecer una vista personal y sencilla para rotaciones, turnos nocturnos, varios lugares e ingresos estimados."],
        ["Experiencia directa con el producto", "El contenido sobre funciones, flujos y cálculos se basa en la implementación y las pruebas directas de las apps. Los artículos se revisan cuando cambia el producto."],
        ["Límites importantes", "No somos una empresa de nóminas, un empleador ni un servicio médico o jurídico. Las horas oficiales, la nómina y las normas laborales deben confirmarse con las fuentes correspondientes."]
      ]
    }
  },
  fr: {
    lang: "fr", name: "Français", locale: "fr_FR", siteName: "Mon Planning de Travail", brandLine: "Plannings privés pour horaires postés", language: "Langue",
    nav: { home: "Accueil", nurse: "Infirmier", work: "Travail", about: "À propos" },
    home: {
      title: "Planning de travail et planning infirmier", description: "Organisez vos postes, vos heures et votre rémunération estimée avec un planning privé adapté au travail posté ou aux soins infirmiers.", eyebrow: "Deux plannings spécialisés", h1: "Choisissez le planning adapté à votre rythme", lead: "Organisez des horaires variables, suivez vos heures et estimez votre rémunération sans feuille de calcul ni calendrier générique.", choose: "Choisissez selon votre activité", chooseText: "Les deux apps proposent un planning privé, des profils de travail, des estimations et des exports. Le vocabulaire et les types de poste sont adaptés à chaque métier.", scheduleTitle: "Votre planning en un coup d'œil", scheduleText: "Ajoutez un poste, planifiez plusieurs dates, appliquez une rotation et consultez la suite de votre planning.", payTitle: "Heures et rémunération estimée", payText: "Suivez les heures, majorations, heures supplémentaires et primes pour obtenir une estimation mensuelle.", privacyTitle: "Privé dès le départ", privacyText: "Les données sont d'abord enregistrées sur votre appareil. La synchronisation iCloud reste facultative.", faqTitle: "Questions fréquentes",
      faqs: [["L'app remplace-t-elle le planning officiel de mon employeur ?", "Non. Il s'agit d'un planning personnel. Vérifiez toujours les horaires et la paie dans les outils officiels de votre employeur."], ["Puis-je gérer plusieurs lieux de travail ?", "Oui. Créez plusieurs profils avec leur lieu, fonction, taux horaire et postes associés."], ["Les estimations correspondent-elles exactement à la fiche de paie ?", "Non. Elles reposent sur les informations saisies. Les impôts, conventions, règles locales et arrondis peuvent modifier le montant final."], ["Puis-je exporter mon planning ?", "Oui. Les deux apps créent des rapports CSV et PDF mensuels et annuels."]]
    },
    nurse: {
      name: "Mon Planning Infirmier", title: "Planning infirmier, heures et rémunération", description: "Planifiez les postes infirmiers, suivez les heures et la rémunération estimée, et gérez plusieurs établissements dans un calendrier privé.", eyebrow: "Pensé pour les horaires infirmiers", h1: "Vos postes infirmiers, réunis au même endroit", lead: "Planifiez les postes de jour et de nuit, astreintes, rappels, heures supplémentaires, congés et absences dans une vue mensuelle adaptée aux soins.", cta: "Voir sur l'App Store", imageAlt: "Écran en français de Mon Planning Infirmier avec estimation mensuelle", features: ["Calendrier mensuel", "Postes de jour et de nuit", "Astreintes et rappels", "Heures supplémentaires", "Jusqu'à 10 profils", "Exports CSV et PDF"],
      sections: [["Planifiez de vrais horaires de soins", "Enregistrez les postes de jour, du soir et de nuit, les astreintes, rappels, heures supplémentaires, formations, congés, absences maladie et annulations. Les rotations et l'ajout sur plusieurs jours limitent les saisies répétitives."], ["Suivez les heures et la rémunération", "Configurez le taux horaire, les majorations de nuit, de week-end et de jour férié, les heures supplémentaires, pauses et primes. Les montants servent à planifier et ne remplacent pas une fiche de paie."], ["Plusieurs établissements, une seule vue", "Créez des profils pour les hôpitaux, services, cliniques, agences ou missions ponctuelles, puis associez chaque poste au bon lieu."]], detailsTitle: "Ce que vous pouvez organiser", details: ["Postes de jour, de nuit et en rotation", "Astreintes, rappels et heures supplémentaires", "Congés, maladie, formation et annulations", "Profils avec lieux et taux différents", "Notifications locales avant les postes", "Widgets d'accueil et d'écran verrouillé"], faqTitle: "Questions sur le planning infirmier",
      faqs: [["Est-il réservé aux hôpitaux ?", "Non. Il convient aussi aux cliniques, agences, EHPAD, soins à domicile et autres structures de santé."], ["Puis-je enregistrer des postes de 12 heures ?", "Oui. Définissez l'heure de début et de fin, y compris lorsqu'un poste se termine le lendemain."], ["Mes données sont-elles envoyées vers vos serveurs ?", "L'app privilégie le stockage local. Si vous activez iCloud, Apple synchronise les données sélectionnées entre vos appareils."], ["Un abonnement est-il nécessaire ?", "Le téléchargement est gratuit. L'accès complet nécessite un abonnement renouvelable après l'essai gratuit applicable."]]
    },
    work: {
      name: "Mon Planning de Travail", title: "Planning de travail, heures et rémunération", description: "Organisez vos postes, vos heures, plusieurs emplois et votre rémunération estimée dans un planning privé pour iPhone et iPad.", eyebrow: "Pour tous les horaires postés", h1: "Votre planning de travail, toujours organisé", lead: "Planifiez des postes variables, suivez vos heures et estimez votre rémunération pour plusieurs sites, contrats ou emplois dans une seule app privée.", cta: "Voir sur l'App Store", imageAlt: "Écran en français de Mon Planning de Travail avec calendrier mensuel", features: ["Calendrier des postes", "Plusieurs emplois", "Règles d'heures supplémentaires", "Rémunération estimée", "Thèmes de couleur", "Rapports CSV et PDF"],
      sections: [["Conçu pour les horaires variables", "Organisez les postes de jour, du soir et de nuit, les heures supplémentaires, astreintes, disponibilités, postes coupés ou doubles, formations, réunions, congés, maladie et annulations."], ["Chaque emploi reste distinct", "Gérez jusqu'à 10 profils pour le commerce, l'hôtellerie, l'industrie, la logistique, les services publics, les contrats ou les emplois à temps partiel."], ["Anticipez avant la paie", "Ajoutez les taux, majorations, pauses, primes et règles d'heures supplémentaires pour afficher une estimation mensuelle. Le résultat reste indicatif."]], detailsTitle: "Des outils pour votre quotidien", details: ["Ajout individuel ou sur plusieurs jours", "Rotations et cycles personnalisés", "Heures, majorations et primes", "Profils de travail indépendants", "Thèmes doux pour personnaliser l'app", "Widgets, notifications et rapports"], faqTitle: "Questions sur le planning de travail",
      faqs: [["Convient-il à différents secteurs ?", "Oui. Il est conçu pour toute personne ayant des horaires postés, variables ou répartis entre plusieurs lieux."], ["Puis-je utiliser plusieurs taux horaires ?", "Oui. Chaque profil possède ses propres réglages de rémunération et les postes qui lui sont associés."], ["L'app calcule-t-elle les impôts ?", "Non. Elle affiche une estimation brute à partir de vos réglages. La paie réelle dépend de votre employeur et des règles locales."], ["Puis-je personnaliser l'apparence ?", "Oui. Plusieurs thèmes aux couleurs douces sont disponibles sans modifier les couleurs des étiquettes de poste."]]
    },
    about: { title: "À propos de My Shift Planner", description: "Découvrez le développement indépendant de My Shift Planner, la raison d'être des apps, l'expérience directe du produit et les limites du site.", eyebrow: "À propos du produit", h1: "Des outils pratiques pour les horaires qui changent", lead: "My Shift Planner réunit deux apps indépendantes qui aident les personnes travaillant en horaires postés à organiser leur calendrier, leurs heures et leur rémunération estimée.", cards: [["Développement indépendant", "Mon Planning Infirmier et Mon Planning de Travail sont conçus, développés, testés et maintenus de manière indépendante, tout comme ce site."], ["Pourquoi ces apps existent", "Les horaires postés s'intègrent mal aux calendriers génériques. L'objectif est d'offrir une vue personnelle et simple des rotations, nuits, différents lieux et estimations."], ["Une expérience directe du produit", "Le contenu relatif aux fonctions, aux parcours et aux calculs s'appuie sur la conception et les tests directs des apps. Les articles sont revus lorsque le produit évolue."], ["Limites importantes", "Nous ne sommes ni un service de paie, ni un employeur, ni un service médical ou juridique. Confirmez horaires officiels, paie et règles auprès des sources compétentes."]] }
  },
  de: {
    lang: "de", name: "Deutsch", locale: "de_DE", siteName: "Mein Schichtplan", brandLine: "Private Planer für Schichtarbeit", language: "Sprache", nav: { home: "Start", nurse: "Pflege", work: "Arbeit", about: "Über uns" },
    home: { title: "Schichtplaner für Arbeit und Pflege", description: "Plane Schichten, erfasse Arbeitszeiten und schätze deinen Verdienst mit einem privaten Kalender für Pflege oder allgemeine Schichtarbeit.", eyebrow: "Zwei spezialisierte Planer", h1: "Wähle den Planer, der zu deinem Dienstplan passt", lead: "Organisiere wechselnde Schichten, behalte Stunden im Blick und schätze deinen Verdienst – ohne Tabellen oder unübersichtliche Standardkalender.", choose: "Passend zu deiner Arbeit", chooseText: "Beide Apps bieten private Planung, Arbeitsprofile, Schätzungen und Exporte. Begriffe und Schichtarten sind an den jeweiligen Einsatzbereich angepasst.", scheduleTitle: "Dein Plan auf einen Blick", scheduleText: "Füge einzelne Schichten hinzu, plane mehrere Tage, wende Rotationen an und sieh, was als Nächstes ansteht.", payTitle: "Stunden und Verdienstschätzung", payText: "Erfasse Stunden, Zuschläge, Überstunden und Boni für eine monatliche Planung vor der Abrechnung.", privacyTitle: "Von Anfang an privat", privacyText: "Daten werden zuerst auf deinem Gerät gespeichert. Die iCloud-Synchronisierung ist optional.", faqTitle: "Häufige Fragen", faqs: [["Ersetzt die App den offiziellen Dienstplan?", "Nein. Sie ist ein persönlicher Planer. Prüfe Arbeitszeiten und Abrechnung immer in den offiziellen Systemen deines Arbeitgebers."], ["Kann ich mehrere Arbeitsorte verwalten?", "Ja. Erstelle Profile mit Arbeitsort, Tätigkeit, Stundensatz und den zugehörigen Schichten."], ["Sind die Verdienstschätzungen eine genaue Lohnabrechnung?", "Nein. Sie basieren auf deinen Eingaben. Steuern, Tarifverträge, lokale Regeln und Rundungen können den Endbetrag verändern."], ["Kann ich meinen Plan exportieren?", "Ja. Beide Apps erstellen monatliche und jährliche CSV- und PDF-Berichte."]] },
    nurse: { name: "Mein Dienstplan Pflege", title: "Pflege-Dienstplan, Arbeitszeit und Verdienst", description: "Plane Pflegeschichten, erfasse Stunden und Verdienstschätzungen und verwalte mehrere Einrichtungen in einem privaten Kalender.", eyebrow: "Für Dienstpläne in der Pflege", h1: "Deine Pflegedienste an einem Ort", lead: "Plane Tag-, Spät- und Nachtdienste, Bereitschaft, Rufbereitschaft, Überstunden, Urlaub und Krankheit in einer Monatsansicht für den Pflegealltag.", cta: "Im App Store ansehen", imageAlt: "Deutsche Ansicht von Mein Dienstplan Pflege mit monatlicher Verdienstschätzung", features: ["Monatskalender", "Tag- und Nachtdienste", "Bereitschaft und Rufdienst", "Überstunden", "Bis zu 10 Profile", "CSV- und PDF-Export"], sections: [["Echte Pflegepläne abbilden", "Erfasse Tag-, Spät- und Nachtdienste, Bereitschaft, Rufbereitschaft, Überstunden, Fortbildung, Urlaub, Krankheit und Ausfälle. Rotationen und Mehrtagesplanung sparen wiederholte Eingaben."], ["Stunden und Verdienst verfolgen", "Hinterlege Stundensatz, Nacht-, Wochenend- und Feiertagszuschläge, Überstunden, Pausen und Boni. Beträge sind Planungsschätzungen und keine offizielle Abrechnung."], ["Mehrere Einrichtungen in einer Ansicht", "Erstelle Profile für Kliniken, Stationen, Praxen, Agenturen oder wechselnde Einsätze und ordne jede Schicht korrekt zu."]], detailsTitle: "Was du organisieren kannst", details: ["Tag-, Nacht- und Wechselschichten", "Bereitschaft, Rufdienst und Überstunden", "Urlaub, Krankheit, Fortbildung und Ausfälle", "Profile mit eigenen Orten und Sätzen", "Lokale Benachrichtigungen vor Schichten", "Widgets für Home- und Sperrbildschirm"], faqTitle: "Fragen zum Pflege-Dienstplan", faqs: [["Ist die App nur für Krankenhäuser?", "Nein. Sie eignet sich auch für Praxen, Pflegeeinrichtungen, ambulante Dienste, Agenturen und weitere Gesundheitsbereiche."], ["Kann ich 12-Stunden-Dienste erfassen?", "Ja. Lege Start und Ende fest, auch wenn der Dienst am Folgetag endet."], ["Werden meine Daten an eigene Server gesendet?", "Die App speichert vorrangig lokal. Wenn du iCloud aktivierst, synchronisiert Apple ausgewählte Daten zwischen deinen Geräten."], ["Ist ein Abonnement erforderlich?", "Der Download ist kostenlos. Für den vollständigen Zugriff ist nach dem verfügbaren Probezeitraum ein automatisch verlängerndes Abonnement erforderlich."]] },
    work: { name: "Mein Schichtplan", title: "Schichtkalender, Arbeitszeit und Verdienst", description: "Organisiere Arbeitsschichten, Stunden, mehrere Jobs und Verdienstschätzungen in einem privaten Kalender für iPhone und iPad.", eyebrow: "Für jede Art von Schichtarbeit", h1: "Dein Schichtplan, immer gut organisiert", lead: "Plane wechselnde Dienste, erfasse Stunden und schätze den Verdienst für mehrere Standorte, Verträge oder Jobs in einer privaten App.", cta: "Im App Store ansehen", imageAlt: "Deutsche Ansicht von Mein Schichtplan mit Monatskalender", features: ["Schichtkalender", "Mehrere Jobs", "Überstundenregeln", "Verdienstschätzung", "Farbthemen", "CSV- und PDF-Berichte"], sections: [["Für wechselnde Arbeitszeiten", "Organisiere Tag-, Spät- und Nachtschichten, Überstunden, Rufbereitschaft, Bereitschaft, geteilte oder doppelte Schichten, Schulungen, Besprechungen, Urlaub, Krankheit und Ausfälle."], ["Jeder Job bleibt getrennt", "Verwalte bis zu 10 Profile für Handel, Gastronomie, Produktion, Logistik, öffentliche Dienste, Verträge oder Nebenjobs."], ["Vor der Abrechnung planen", "Ergänze Sätze, Zuschläge, Pausen, Boni und Überstundenregeln für eine monatliche Schätzung. Das Ergebnis ist nicht verbindlich."]], detailsTitle: "Werkzeuge für deinen Arbeitsalltag", details: ["Einzel- und Mehrtagesplanung", "Rotationen und eigene Zyklen", "Stunden, Zuschläge und Boni", "Getrennte Arbeitsprofile", "Sanfte Farbthemen zur Personalisierung", "Widgets, Benachrichtigungen und Berichte"], faqTitle: "Fragen zum Schichtplaner", faqs: [["Eignet sich die App für verschiedene Branchen?", "Ja. Sie ist für Menschen mit Schichtarbeit, wechselnden Zeiten oder mehreren Arbeitsorten gedacht."], ["Kann ich unterschiedliche Stundensätze verwenden?", "Ja. Jedes Profil kann eigene Zahlungseinstellungen und zugeordnete Schichten haben."], ["Berechnet die App automatisch Steuern?", "Nein. Sie zeigt eine Bruttoschätzung aus deinen Einstellungen. Die echte Abrechnung hängt vom Arbeitgeber und lokalen Regeln ab."], ["Kann ich das Design ändern?", "Ja. Wähle aus mehreren sanften Farbthemen, ohne die Farben der Schichtkennzeichnungen zu verändern."]] },
    about: { title: "Über My Shift Planner", description: "Erfahre mehr über die unabhängige Entwicklung von My Shift Planner, den Zweck der Apps, direkte Produkterfahrung und die Grenzen dieser Website.", eyebrow: "Über das Produkt", h1: "Praktische Werkzeuge für wechselnde Arbeitszeiten", lead: "My Shift Planner umfasst zwei unabhängige Apps, mit denen Menschen in Schichtarbeit ihren Kalender, ihre Stunden und Verdienstschätzungen organisieren können.", cards: [["Unabhängige Entwicklung", "Mein Dienstplan Pflege und Mein Schichtplan werden unabhängig konzipiert, entwickelt, getestet und gepflegt, ebenso wie diese Website."], ["Warum es diese Apps gibt", "Schichtarbeit passt oft schlecht in allgemeine Kalender. Ziel ist eine persönliche, einfache Ansicht für Rotationen, Nachtdienste, mehrere Orte und Schätzungen."], ["Direkte Produkterfahrung", "Inhalte zu Funktionen, Abläufen und Berechnungen beruhen auf der direkten Entwicklung und Prüfung der Apps. Artikel werden bei Produktänderungen überprüft."], ["Wichtige Grenzen", "Wir sind weder Lohnabrechnungsdienst noch Arbeitgeber und bieten keine medizinische oder rechtliche Beratung. Offizielle Zeiten, Abrechnung und Regeln sind bei zuständigen Stellen zu bestätigen."]] }
  },
  "pt-br": {
    lang: "pt-BR", name: "Português (Brasil)", locale: "pt_BR", siteName: "Meus Turnos de Trabalho", brandLine: "Planejadores privados para escalas", language: "Idioma", nav: { home: "Início", nurse: "Enfermagem", work: "Trabalho", about: "Sobre" },
    home: { title: "Planejador de turnos para trabalho e enfermagem", description: "Organize turnos, horas trabalhadas e ganhos estimados em um calendário privado para enfermagem ou outros trabalhos por escala.", eyebrow: "Dois planejadores especializados", h1: "Escolha o planejador que combina com sua escala", lead: "Organize horários variáveis, acompanhe suas horas e estime ganhos sem depender de planilhas ou calendários genéricos.", choose: "Escolha de acordo com seu trabalho", chooseText: "Os dois apps oferecem planejamento privado, perfis de trabalho, estimativas e exportações. A linguagem e os tipos de turno são adaptados a cada contexto.", scheduleTitle: "Sua escala em um só olhar", scheduleText: "Adicione turnos, planeje vários dias, aplique rotações e veja o que vem a seguir.", payTitle: "Horas e ganhos estimados", payText: "Acompanhe horas, adicionais, horas extras e bônus para planejar o total do mês antes do pagamento.", privacyTitle: "Privado desde o início", privacyText: "Os dados ficam primeiro no seu dispositivo. A sincronização com o iCloud é opcional.", faqTitle: "Perguntas frequentes", faqs: [["O app substitui a escala oficial da empresa?", "Não. Ele é um planejador pessoal. Confirme sempre horários e pagamentos nos sistemas oficiais do empregador."], ["Posso organizar vários locais de trabalho?", "Sim. Crie perfis com local, função, valor por hora e turnos correspondentes."], ["A estimativa é igual ao holerite?", "Não. Ela usa os dados informados. Impostos, convenções, regras locais e arredondamentos podem alterar o valor final."], ["Posso exportar minha escala?", "Sim. Os dois apps criam relatórios CSV e PDF mensais e anuais."]] },
    nurse: { name: "Meus Plantões de Enfermagem", title: "Escala de enfermagem, horas e ganhos", description: "Planeje plantões, acompanhe horas e ganhos estimados e organize vários locais em um calendário privado de enfermagem.", eyebrow: "Feito para escalas de enfermagem", h1: "Seus plantões de enfermagem em um só lugar", lead: "Planeje plantões diurnos e noturnos, sobreavisos, chamadas, horas extras, férias e afastamentos em uma visão mensal pensada para a rotina da saúde.", cta: "Ver na App Store", imageAlt: "Tela em português de Meus Plantões de Enfermagem com estimativa mensal", features: ["Calendário mensal", "Plantões diurnos e noturnos", "Sobreaviso e chamada", "Horas extras", "Até 10 perfis", "Exportação CSV e PDF"], sections: [["Planeje escalas reais da enfermagem", "Registre plantões diurnos, vespertinos e noturnos, sobreaviso, chamada, horas extras, treinamentos, férias, afastamentos e cancelamentos. Rotações e planejamento de vários dias evitam tarefas repetitivas."], ["Acompanhe horas e ganhos", "Configure valor por hora, adicionais noturno, de fim de semana e feriado, horas extras, intervalos e bônus. Os valores são estimativas para planejamento, não um cálculo oficial de folha."], ["Vários locais, uma visão", "Crie perfis para hospitais, setores, clínicas, agências ou trabalhos avulsos e associe cada plantão ao local correto."]], detailsTitle: "O que você pode organizar", details: ["Plantões diurnos, noturnos e rotativos", "Sobreaviso, chamada e horas extras", "Férias, doença, treinamento e cancelamentos", "Perfis com locais e valores diferentes", "Notificações locais antes dos plantões", "Widgets da Tela de Início e de Bloqueio"], faqTitle: "Perguntas sobre o planejador de enfermagem", faqs: [["O app é apenas para hospitais?", "Não. Ele também atende clínicas, agências, instituições de longa permanência, atendimento domiciliar e outros serviços de saúde."], ["Posso registrar plantões de 12 horas?", "Sim. Defina início e fim, inclusive quando o plantão termina no dia seguinte."], ["Meus dados vão para servidores próprios?", "O app prioriza o armazenamento local. Se você ativar o iCloud, a Apple sincroniza os dados selecionados entre seus dispositivos."], ["É preciso assinar?", "O download é grátis. O acesso completo exige uma assinatura renovável após o período de teste aplicável."]] },
    work: { name: "Meus Turnos de Trabalho", title: "Escala de trabalho, horas e ganhos", description: "Organize turnos, horas, vários empregos e ganhos estimados em um calendário privado para iPhone e iPad.", eyebrow: "Para todo tipo de trabalho em turnos", h1: "Sua escala de trabalho, sempre organizada", lead: "Planeje horários variáveis, acompanhe horas e estime ganhos em diferentes locais, contratos ou empregos dentro de um único app privado.", cta: "Ver na App Store", imageAlt: "Tela em português de Meus Turnos de Trabalho com calendário mensal", features: ["Calendário de turnos", "Vários empregos", "Regras de horas extras", "Ganhos estimados", "Temas de cores", "Relatórios CSV e PDF"], sections: [["Feito para horários variáveis", "Organize turnos diurnos, vespertinos e noturnos, horas extras, sobreaviso, prontidão, turnos divididos ou duplos, treinamentos, reuniões, férias, doença e cancelamentos."], ["Cada trabalho fica separado", "Gerencie até 10 perfis para comércio, hotelaria, indústria, logística, serviços públicos, contratos ou empregos de meio período."], ["Planeje antes do pagamento", "Adicione valores, adicionais, intervalos, bônus e regras de horas extras para ver uma estimativa mensal. O resultado é apenas orientativo."]], detailsTitle: "Ferramentas para sua rotina", details: ["Planejamento individual ou de vários dias", "Rotações e ciclos personalizados", "Horas, adicionais e bônus", "Perfis de trabalho independentes", "Temas suaves para personalizar o app", "Widgets, notificações e relatórios"], faqTitle: "Perguntas sobre o planejador de trabalho", faqs: [["Serve para diferentes setores?", "Sim. Ele foi feito para qualquer pessoa com trabalho em turnos, horários variáveis ou vários locais."], ["Posso usar valores por hora diferentes?", "Sim. Cada perfil pode ter suas próprias configurações de pagamento e seus turnos."], ["O app calcula impostos?", "Não. Ele mostra uma estimativa bruta baseada nas suas configurações. O pagamento real depende do empregador e das regras locais."], ["Posso mudar a aparência?", "Sim. Escolha entre vários temas de cores suaves sem alterar as cores das etiquetas dos turnos."]] },
    about: { title: "Sobre o My Shift Planner", description: "Conheça o desenvolvimento independente do My Shift Planner, o objetivo dos apps, a experiência direta com o produto e os limites deste site.", eyebrow: "Sobre o produto", h1: "Ferramentas práticas para escalas que mudam", lead: "My Shift Planner reúne dois apps independentes criados para ajudar trabalhadores em escala a organizar calendário, horas e estimativas de ganhos.", cards: [["Desenvolvimento independente", "Meus Plantões de Enfermagem e Meus Turnos de Trabalho são projetados, desenvolvidos, testados e mantidos de forma independente, assim como este site."], ["Por que os apps existem", "Escalas de trabalho nem sempre funcionam bem em calendários comuns. O objetivo é oferecer uma visão pessoal e simples para rotações, noites, vários locais e estimativas."], ["Experiência direta com o produto", "O conteúdo sobre recursos, fluxos e cálculos parte da implementação e dos testes diretos dos apps. Os artigos são revisados quando o produto muda."], ["Limites importantes", "Não somos serviço de folha de pagamento, empregador nem consultoria médica ou jurídica. Horários oficiais, pagamentos e regras devem ser confirmados nas fontes responsáveis."]] }
  },
  ja: {
    lang: "ja", name: "日本語", locale: "ja_JP", siteName: "勤務シフト管理", brandLine: "シフト勤務のための個人用プランナー", language: "言語", nav: { home: "ホーム", nurse: "看護師向け", work: "一般勤務", about: "このサイトについて" },
    home: { title: "仕事・看護師向けシフト管理アプリ", description: "看護師または一般のシフト勤務向けに、勤務予定、勤務時間、給与見込みを個人用カレンダーで管理できます。", eyebrow: "用途別の2つのシフト管理アプリ", h1: "働き方に合うシフト管理を選ぶ", lead: "変則的な勤務予定、勤務時間、給与見込みを、表計算や汎用カレンダーに頼らず分かりやすく管理できます。", choose: "仕事内容に合わせて選択", chooseText: "どちらのアプリも、個人用の勤務管理、複数プロフィール、給与見込み、CSV・PDF出力に対応しています。表示する勤務区分や用語は用途に合わせて調整されています。", scheduleTitle: "勤務予定をひと目で確認", scheduleText: "シフトを追加し、複数日をまとめて登録し、ローテーションを適用して、次の勤務を確認できます。", payTitle: "勤務時間と給与見込み", payText: "勤務時間、割増、残業、ボーナスを記録し、支給日前に月間の目安を確認できます。", privacyTitle: "端末保存を基本にした設計", privacyText: "データはまず端末内に保存されます。iCloud同期は必要な場合のみ有効にできます。", faqTitle: "よくある質問", faqs: [["勤務先の正式なシフト表の代わりになりますか？", "いいえ。本アプリは個人用の管理ツールです。勤務日時や給与は、必ず勤務先の正式な情報で確認してください。"], ["複数の勤務先を管理できますか？", "はい。勤務先、役割、時給、シフトを分けた複数のプロフィールを作成できます。"], ["給与見込みは実際の給与と同じですか？", "いいえ。入力した条件に基づく目安です。税金、就業規則、地域の制度、端数処理などで実際の金額は変わります。"], ["シフトを出力できますか？", "はい。どちらのアプリも月次・年次のCSVおよびPDFレポートを作成できます。"]] },
    nurse: { name: "看護師シフト管理", title: "看護師向け勤務表・勤務時間・給与見込み", description: "看護師の勤務予定、勤務時間、給与見込み、複数の勤務先を個人用カレンダーで管理できます。", eyebrow: "看護師の勤務に合わせた設計", h1: "看護師のシフトを一か所で管理", lead: "日勤、準夜勤、夜勤、オンコール、呼び出し、残業、休暇、病欠を、医療現場の勤務に合わせた月間表示で整理できます。", cta: "App Storeで見る", imageAlt: "看護師シフト管理の日本語画面と月間給与見込み", features: ["月間カレンダー", "日勤・夜勤", "オンコール・呼び出し", "残業管理", "最大10件のプロフィール", "CSV・PDF出力"], sections: [["実際の看護勤務に対応", "日勤、準夜勤、夜勤、オンコール、呼び出し、残業、研修、休暇、病欠、キャンセルを記録できます。ローテーションと複数日の一括登録で繰り返し入力を減らせます。"], ["勤務時間と給与見込みを確認", "時給、夜勤・週末・祝日の割増、残業、無給休憩、ボーナスを設定できます。表示額は計画用の目安であり、正式な給与計算ではありません。"], ["複数の勤務先を一つの画面で", "病院、病棟、クリニック、派遣先、単発勤務ごとにプロフィールを作り、各シフトを正しい勤務先に割り当てられます。"]], detailsTitle: "管理できる内容", details: ["日勤・夜勤・交代勤務", "オンコール・呼び出し・残業", "休暇・病欠・研修・キャンセル", "勤務先ごとのプロフィールと時給", "勤務前の端末内通知", "ホーム画面・ロック画面ウィジェット"], faqTitle: "看護師シフト管理について", faqs: [["病院勤務専用ですか？", "いいえ。クリニック、介護施設、訪問看護、派遣、その他の医療・介護現場でも利用できます。"], ["12時間勤務を登録できますか？", "はい。開始時刻と終了時刻を設定でき、翌日に終了する夜勤にも対応します。"], ["データは独自サーバーへ送信されますか？", "端末内保存を基本としています。iCloudを有効にした場合、選択したデータはAppleのサービスで端末間同期されます。"], ["サブスクリプションは必要ですか？", "ダウンロードは無料です。利用可能な無料トライアル後、全機能の継続利用には自動更新サブスクリプションが必要です。"]] },
    work: { name: "勤務シフト管理", title: "勤務表・勤務時間・給与見込みをまとめて管理", description: "仕事のシフト、勤務時間、複数の勤務先、給与見込みをiPhoneとiPadの個人用カレンダーで管理できます。", eyebrow: "さまざまなシフト勤務に対応", h1: "勤務シフトを、いつでも分かりやすく", lead: "変則勤務、勤務時間、給与見込みを、複数の勤務地・契約・仕事ごとに一つの個人用アプリで管理できます。", cta: "App Storeで見る", imageAlt: "勤務シフト管理の日本語画面と月間カレンダー", features: ["シフトカレンダー", "複数の仕事", "残業ルール", "給与見込み", "カラーテーマ", "CSV・PDFレポート"], sections: [["変則的な勤務予定に対応", "日勤、夕勤、夜勤、残業、オンコール、待機、分割勤務、連続勤務、研修、会議、休暇、病欠、無給休暇、キャンセルを整理できます。"], ["仕事ごとに分けて管理", "小売、飲食、製造、物流、公共サービス、契約業務、パートなど、最大10件の勤務プロフィールを作成できます。"], ["支給日前に収入を把握", "時給、各種割増、休憩、ボーナス、残業ルールを設定し、月間の給与見込みを表示します。金額はあくまで目安です。"]], detailsTitle: "毎日の勤務管理に役立つ機能", details: ["1件ずつ、または複数日の一括登録", "ローテーションと独自サイクル", "勤務時間、割増、ボーナス", "勤務先ごとのプロフィール", "やさしい色合いのテーマ", "ウィジェット、通知、レポート"], faqTitle: "勤務シフト管理について", faqs: [["さまざまな業種で使えますか？", "はい。交代勤務、変則勤務、複数の勤務先で働く方を幅広く対象としています。"], ["勤務先ごとに異なる時給を設定できますか？", "はい。各プロフィールに個別の給与設定とシフトを登録できます。"], ["税金も自動で計算されますか？", "いいえ。設定内容に基づく総支給額の目安です。実際の給与は勤務先の規定や地域の制度により異なります。"], ["見た目を変更できますか？", "はい。シフトラベルの色は維持したまま、複数のやさしいカラーテーマから選べます。"]] },
    about: { title: "My Shift Plannerについて", description: "My Shift Plannerの個人開発、アプリを作った目的、製品に関する実体験、このサイトの情報範囲をご案内します。", eyebrow: "製品と運営について", h1: "変化する勤務予定を支える実用的なツール", lead: "My Shift Plannerは、シフト勤務の方が自分の予定、勤務時間、給与見込みを整理するための2つの個人向けアプリを提供しています。", cards: [["個人開発", "看護師シフト管理と勤務シフト管理、および本サイトは、個人で設計、開発、テスト、保守されています。"], ["アプリを作った理由", "交代勤務は一般的なカレンダーでは管理しにくいことがあります。ローテーション、夜勤、複数の勤務地、給与見込みを分かりやすく扱える個人用ツールを目指しています。"], ["製品に関する直接的な知識", "機能、操作、計算に関する内容は、アプリの実装とテストに基づいています。製品の変更に合わせて記事を見直します。"], ["情報の範囲", "本サイトは給与計算事業者、雇用主、医療・法律相談サービスではありません。正式な勤務時間、給与、規則は勤務先や専門機関に確認してください。"]] }
  }
};

const showcaseCopy = {
  es: {
    nurse: [
      ["nurse-earnings", "Consulta horas e ingresos estimados", "Revisa el total mensual, las horas extra y el desglose semanal antes del día de pago.", "Estimación mensual de horas e ingresos en Mis Turnos de Enfermería"],
      ["nurse-profiles", "Organiza cada centro por separado", "Crea perfiles para hospitales, clínicas o agencias y aplica la rotación adecuada a cada lugar.", "Perfiles de trabajo y rotaciones en Mis Turnos de Enfermería"]
    ],
    work: [
      ["work-earnings", "Consulta horas e ingresos estimados", "Revisa el total mensual, las horas extra y el desglose semanal antes del día de pago.", "Estimación mensual de horas e ingresos en Mis Turnos de Trabajo"],
      ["work-profiles", "Separa cada trabajo y ubicación", "Guarda la función, el centro, la zona horaria y la configuración de pago en perfiles independientes.", "Perfiles para varios trabajos y lugares en Mis Turnos de Trabajo"]
    ]
  },
  fr: {
    nurse: [
      ["nurse-earnings", "Suivez vos heures et votre rémunération", "Consultez le total mensuel, les heures supplémentaires et le détail par semaine avant la paie.", "Estimation mensuelle des heures et de la rémunération dans Mon Planning Infirmier"],
      ["nurse-profiles", "Séparez chaque établissement", "Créez des profils pour les hôpitaux, cliniques ou agences et appliquez la rotation adaptée à chaque lieu.", "Profils professionnels et rotations dans Mon Planning Infirmier"]
    ],
    work: [
      ["work-earnings", "Suivez vos heures et votre rémunération", "Consultez le total mensuel, les heures supplémentaires et le détail par semaine avant la paie.", "Estimation mensuelle des heures et de la rémunération dans Mon Planning de Travail"],
      ["work-profiles", "Séparez chaque emploi et chaque lieu", "Enregistrez le poste, le lieu, le fuseau horaire et les réglages de rémunération propres à chaque profil.", "Profils pour plusieurs emplois et lieux dans Mon Planning de Travail"]
    ]
  },
  de: {
    nurse: [
      ["nurse-earnings", "Stunden und Verdienst im Blick", "Prüfe Monatsprognose, Überstunden und Wochenübersicht schon vor dem Zahltag.", "Monatliche Stunden- und Verdienstprognose in Mein Pflege-Dienstplan"],
      ["nurse-profiles", "Jeden Arbeitsort getrennt organisieren", "Lege Profile für Kliniken, Stationen oder Agenturen an und nutze passende Rotationen.", "Arbeitsprofile und Rotationen in Mein Pflege-Dienstplan"]
    ],
    work: [
      ["work-earnings", "Stunden und Verdienst im Blick", "Prüfe Monatsprognose, Überstunden und Wochenübersicht schon vor dem Zahltag.", "Monatliche Stunden- und Verdienstprognose in Mein Schichtplan"],
      ["work-profiles", "Jeden Job getrennt verwalten", "Speichere Rolle, Arbeitsort, Zeitzone und Verdiensteinstellungen in eigenen Profilen.", "Profile für mehrere Jobs und Arbeitsorte in Mein Schichtplan"]
    ]
  },
  "pt-br": {
    nurse: [
      ["nurse-earnings", "Acompanhe horas e ganhos estimados", "Veja o total mensal, as horas extras e o resumo semanal antes do pagamento.", "Estimativa mensal de horas e ganhos em Meus Plantões de Enfermagem"],
      ["nurse-profiles", "Organize cada local separadamente", "Crie perfis para hospitais, clínicas ou agências e aplique a escala adequada a cada local.", "Perfis de trabalho e escalas em Meus Plantões de Enfermagem"]
    ],
    work: [
      ["work-earnings", "Acompanhe horas e ganhos estimados", "Veja o total mensal, as horas extras e o resumo semanal antes do pagamento.", "Estimativa mensal de horas e ganhos em Meus Turnos de Trabalho"],
      ["work-profiles", "Separe cada trabalho e local", "Salve função, local, fuso horário e configurações de pagamento em perfis independentes.", "Perfis para vários trabalhos e locais em Meus Turnos de Trabalho"]
    ]
  },
  ja: {
    nurse: [
      ["nurse-earnings", "勤務時間と給与見込みを確認", "月間の給与見込み、残業時間、週ごとの内訳を支給日前に確認できます。", "看護師シフト管理の月間勤務時間と給与見込み"],
      ["nurse-profiles", "勤務先ごとに整理", "病院、クリニック、派遣先ごとにプロフィールを作成し、それぞれに合ったローテーションを使えます。", "看護師シフト管理の勤務先プロフィールとローテーション"]
    ],
    work: [
      ["work-earnings", "勤務時間と給与見込みを確認", "月間の給与見込み、残業時間、週ごとの内訳を支給日前に確認できます。", "勤務シフト管理の月間勤務時間と給与見込み"],
      ["work-profiles", "仕事と勤務先を分けて管理", "役割、勤務先、タイムゾーン、給与設定をプロフィールごとに保存できます。", "勤務シフト管理の複数の仕事と勤務先プロフィール"]
    ]
  }
};

const nurseCalendarImageAlt = {
  es: "Pantalla en español de Mis Turnos de Enfermería con calendario mensual",
  fr: "Écran en français de Mon Planning Infirmier avec calendrier mensuel",
  de: "Deutsche Ansicht von Mein Dienstplan Pflege mit Monatskalender",
  "pt-br": "Tela em português de Meus Plantões de Enfermagem com calendário mensal",
  ja: "看護師シフト管理の日本語画面と月間カレンダー"
};

function route(locale, type) {
  const prefix = locale === "en" ? "" : `/${locale}`;
  if (type === "home") return `${prefix}/` || "/";
  if (type === "about") return `${prefix}/about/`;
  return `${prefix}/${type}/`;
}

function alternates(type) {
  return locales.map((locale) => `<link rel="alternate" hreflang="${locale === "pt-br" ? "pt-BR" : locale}" href="${base}${route(locale, type)}">`).join("\n    ") + `\n    <link rel="alternate" hreflang="x-default" href="${base}${route("en", type)}">`;
}

function analytics() {
  return `<!-- Google tag (gtag.js) -->\n    <script async src="https://www.googletagmanager.com/gtag/js?id=G-1G81C7EHDF"></script>\n    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-1G81C7EHDF');</script>`;
}

function head(d, type, title, description, image, schema) {
  const canonical = `${base}${route(d.key, type)}`;
  return `<!DOCTYPE html>
<html lang="${d.lang}">
  <head>
    ${analytics()}
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <link rel="canonical" href="${canonical}">
    ${alternates(type)}
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="My Shift Planner">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${image}">
    <meta property="og:locale" content="${d.locale}">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="icon" href="/assets/images/site-icon.svg" type="image/svg+xml">
    <link rel="preload" href="/assets/fonts/nunito-latin-variable.woff2" as="font" type="font/woff2" crossorigin>
    <script type="application/ld+json">${JSON.stringify(schema)}</script>
    <link rel="stylesheet" href="/assets/css/styles.css">
  </head>`;
}

function languageMenu(d, type) {
  return `<details class="language-menu"><summary>${d.language}: ${d.name}</summary><div class="language-menu-panel">${locales.map((locale) => `<a href="${route(locale, type)}" lang="${locale === "pt-br" ? "pt-BR" : locale}"${locale === d.key ? ' aria-current="page"' : ""}>${localeNames[locale]}</a>`).join("")}</div></details>`;
}

function header(d, type) {
  const app = type === "nurse" ? d.nurse : type === "work" ? d.work : null;
  const identity = app
    ? `<img src="/assets/images/optimized/${type}-icon-256.webp" width="256" height="256" alt=""><span class="brand-copy"><strong>${app.name}</strong><span>${app.eyebrow}</span></span>`
    : `<span class="brand-copy"><strong>My Shift Planner</strong><span>${d.brandLine}</span></span>`;
  return `<header class="topbar"><div class="topbar-inner topbar-with-language"><a class="brand" href="${route(d.key, "home")}">${identity}</a><button class="nav-toggle" type="button" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button><nav class="nav" aria-label="Primary"><a href="${route(d.key, "home")}">${d.nav.home}</a><a href="${route(d.key, "nurse")}">${d.nav.nurse}</a><a href="${route(d.key, "work")}">${d.nav.work}</a><a href="${route(d.key, "about")}">${d.nav.about}</a></nav>${languageMenu(d, type)}</div></header>`;
}

function footer(d) {
  return `<footer class="footer"><div class="footer-inner"><div class="glass-card footer-card"><div class="footer-brand"><span><strong>My Shift Planner</strong><span>${d.brandLine}</span></span></div><nav class="footer-links" aria-label="Footer"><a href="${route(d.key, "home")}">${d.nav.home}</a><a href="${route(d.key, "nurse")}">${d.nav.nurse}</a><a href="${route(d.key, "work")}">${d.nav.work}</a><a href="${route(d.key, "about")}">${d.nav.about}</a></nav><p class="footer-copyright">&copy; 2026 My Shift Planner</p></div></div></footer>`;
}

function faq(items) {
  return `<div class="landing-faq">${items.map(([q, a]) => `<details class="glass-card faq-item"><summary>${q}</summary><div class="faq-answer"><p>${a}</p></div></details>`).join("")}</div>`;
}

function pageEnd(d) {
  return `${footer(d)}</div><script src="/assets/js/site.js" defer></script></body></html>`;
}

function showcaseRows(d, type) {
  return showcaseCopy[d.key][type].map(([asset, title, text, alt], index) => {
    const direction = index % 2 === 1 ? " localized-showcase-row-image-right" : "";
    return `<article class="localized-showcase-row${direction}"><div class="localized-showcase-media"><img class="localized-screenshot" src="/assets/images/localized/${d.key}/${asset}-480.webp" srcset="/assets/images/localized/${d.key}/${asset}-480.webp 480w, /assets/images/localized/${d.key}/${asset}-800.webp 800w" sizes="(max-width: 1080px) 76vw, 28vw" width="800" height="1732" alt="${alt}" loading="lazy" decoding="async"></div><div class="localized-showcase-copy"><span class="content-kicker">0${index + 2}</span><h2>${title}</h2><p>${text}</p></div></article>`;
  }).join("");
}

function homePage(d) {
  const p = d.home;
  const schema = { "@context": "https://schema.org", "@graph": [{ "@type": "WebPage", name: p.title, url: `${base}${route(d.key, "home")}`, inLanguage: d.lang, description: p.description }, { "@type": "ItemList", name: p.choose, itemListElement: [{ "@type": "ListItem", position: 1, name: d.nurse.name, url: `${base}${route(d.key, "nurse")}` }, { "@type": "ListItem", position: 2, name: d.work.name, url: `${base}${route(d.key, "work")}` }] }] };
  return `${head(d, "home", p.title, p.description, `${base}/assets/images/app-preview.png`, schema)}<body class="landing-split-page"><div class="site-shell">${header(d, "home")}<main><section class="localized-hero"><div class="section-inner"><div class="content-head"><span class="eyebrow">${p.eyebrow}</span><h1>${p.h1}</h1><p>${p.lead}</p></div><div class="localized-app-grid"><article class="glass-card localized-app-card"><div class="localized-app-title"><img src="/assets/images/optimized/nurse-icon-128.webp" width="128" height="128" alt=""><div><span class="content-kicker">${d.nav.nurse}</span><h2>${d.nurse.name}</h2></div></div><p>${d.nurse.description}</p><div class="cta-row"><a class="button" href="${route(d.key, "nurse")}">${d.nav.nurse}</a></div></article><article class="glass-card localized-app-card"><div class="localized-app-title"><img src="/assets/images/optimized/work-icon-128.webp" width="128" height="128" alt=""><div><span class="content-kicker">${d.nav.work}</span><h2>${d.work.name}</h2></div></div><p>${d.work.description}</p><div class="cta-row"><a class="button" href="${route(d.key, "work")}">${d.nav.work}</a></div></article></div></div></section><section class="content-section"><div class="section-inner"><div class="content-head"><span class="eyebrow">${p.choose}</span><h2>${p.choose}</h2><p>${p.chooseText}</p></div><div class="content-grid"><article class="glass-card content-card"><span class="content-kicker">01</span><h3>${p.scheduleTitle}</h3><p>${p.scheduleText}</p></article><article class="glass-card content-card"><span class="content-kicker">02</span><h3>${p.payTitle}</h3><p>${p.payText}</p></article><article class="glass-card content-card"><span class="content-kicker">03</span><h3>${p.privacyTitle}</h3><p>${p.privacyText}</p></article></div></div></section><section class="content-section"><div class="section-inner"><div class="content-head"><h2>${p.faqTitle}</h2></div>${faq(p.faqs)}</div></section></main>${pageEnd(d)}`;
}

function appPage(d, type) {
  const p = d[type];
  const nurse = type === "nurse";
  const appId = nurse ? "6764406102" : "6769349635";
  const appSlug = nurse ? "my-nurse-shift-planner" : "my-work-shift-planner";
  const icon = nurse ? "nurse-icon-128.webp" : "work-icon-128.webp";
  const imageAlt = nurse ? nurseCalendarImageAlt[d.key] : p.imageAlt;
  const schema = { "@context": "https://schema.org", "@type": "MobileApplication", name: p.name, alternateName: nurse ? "My Nurse Shift Planner" : "My Work Shift Planner", url: `${base}${route(d.key, type)}`, downloadUrl: `https://apps.apple.com/app/${appSlug}/id${appId}`, image: `${base}/assets/images/${nurse ? "app-icon.png" : "workapp-icon.png"}`, description: p.description, inLanguage: d.lang, applicationCategory: "BusinessApplication", operatingSystem: "iOS 18.0 or later", offers: { "@type": "Offer", price: "0", priceCurrency: nurse ? "USD" : "USD", description: "Free download; full access requires an auto-renewable subscription." } };
  const image = `${base}/assets/images/localized/${d.key}/${type}-hero-800.webp`;
  return `${head(d, type, p.title, p.description, image, schema)}<body><div class="site-shell">${header(d, type)}<main><section class="localized-hero"><div class="section-inner localized-hero-grid"><div class="localized-hero-copy"><span class="eyebrow">${p.eyebrow}</span><h1>${p.h1}</h1><p class="lead">${p.lead}</p><div class="trust-strip">${p.features.slice(0, 3).map((x) => `<span>${x}</span>`).join("")}</div><div class="cta-row"><a class="button" href="https://apps.apple.com/app/${appSlug}/id${appId}" target="_blank" rel="noopener noreferrer">${p.cta}</a></div></div><div class="localized-screenshot-wrap"><img class="localized-screenshot" src="/assets/images/localized/${d.key}/${type}-hero-480.webp" srcset="/assets/images/localized/${d.key}/${type}-hero-480.webp 480w, /assets/images/localized/${d.key}/${type}-hero-800.webp 800w" sizes="(max-width: 1080px) 76vw, 28vw" width="800" height="1731" alt="${imageAlt}" fetchpriority="high" decoding="async"></div></div></section><section class="localized-showcase"><div class="section-inner localized-showcase-list">${showcaseRows(d, type)}</div></section><section class="content-section"><div class="section-inner"><div class="content-grid">${p.sections.map(([title, text], i) => `<article class="glass-card content-card"><span class="content-kicker">0${i + 1}</span><h2>${title}</h2><p>${text}</p></article>`).join("")}</div></div></section><section class="content-section"><div class="section-inner"><div class="content-head"><h2>${p.detailsTitle}</h2></div><div class="glass-card legal-card"><ul class="content-list">${p.details.map((x) => `<li>${x}</li>`).join("")}</ul></div></div></section><section class="content-section"><div class="section-inner"><div class="content-head"><h2>${p.faqTitle}</h2></div>${faq(p.faqs)}</div></section></main>${pageEnd(d)}`;
}

function localizedAppStoreBadge(d, type) {
  const nurse = type === "nurse";
  const appId = nurse ? "6764406102" : "6769349635";
  const appSlug = nurse ? "my-nurse-shift-planner" : "my-work-shift-planner";
  const badge = appStoreBadges[d.key];
  const label = d[type].cta;
  const textButton = `<div class="cta-row"><a class="button" href="https://apps.apple.com/app/${appSlug}/id${appId}" target="_blank" rel="noopener noreferrer">${label}</a></div>`;
  const badgeButton = `<div class="cta-row"><a class="app-store-link" href="https://apps.apple.com/app/${appSlug}/id${appId}" target="_blank" rel="noopener noreferrer" aria-label="${label}"><img class="store-badge" src="/assets/images/app-store/${badge.file}" width="${badge.width}" height="40" alt="${label}" decoding="async"></a></div>`;
  return { textButton, badgeButton };
}

function aboutPage(d) {
  const p = d.about;
  const schema = { "@context": "https://schema.org", "@graph": [{ "@type": "AboutPage", name: p.title, url: `${base}${route(d.key, "about")}`, inLanguage: d.lang, description: p.description }, { "@type": "Organization", name: "My Shift Planner", url: base }] };
  return `${head(d, "about", p.title, p.description, `${base}/assets/images/app-preview.png`, schema)}<body><div class="site-shell">${header(d, "about")}<main><section class="guide-hero"><div class="section-inner"><div class="glass-card guide-hero-card"><span class="eyebrow">${p.eyebrow}</span><h1>${p.h1}</h1><p>${p.lead}</p></div></div></section><section class="content-section content-section-tight"><div class="section-inner"><div class="policy-grid">${p.cards.map(([title, text]) => `<article class="glass-card policy-card"><h2>${title}</h2><p>${text}</p></article>`).join("")}</div><div class="glass-card resource-cta"><div><span class="content-kicker">My Shift Planner</span><h2>${d.nav.about}</h2><p>${d.home.privacyText}</p></div><div class="cta-row"><a class="button" href="mailto:contact@paulcrp.com">contact@paulcrp.com</a></div></div></div></section></main>${pageEnd(d)}`;
}

for (const [key, value] of Object.entries(copy)) {
  const d = { ...value, key };
  for (const [type, html] of [["home", homePage(d)], ["nurse", appPage(d, "nurse")], ["work", appPage(d, "work")], ["about", aboutPage(d)]]) {
    const directory = type === "home" ? path.join(root, key) : path.join(root, key, type);
    await mkdir(directory, { recursive: true });
    let localizedHtml = html
      .replace('<body class="landing-split-page">', '<body class="landing-split-page localized-page">')
      .replace("<body>", '<body class="localized-page">')
      .replaceAll("nurse-icon-128.webp", "nurse-icon-256.webp")
      .replaceAll("work-icon-128.webp", "work-icon-256.webp")
      .replace('height="1731"', 'height="1732"')
      .replace("勤務シフトを、いつでも分かりやすく", "勤務シフトを、もっと見やすく");
    if (type === "nurse" || type === "work") {
      const badge = localizedAppStoreBadge(d, type);
      localizedHtml = localizedHtml.replace(badge.textButton, badge.badgeButton);
    }
    await writeFile(path.join(directory, "index.html"), localizedHtml, "utf8");
  }
}

console.log(`Generated ${Object.keys(copy).length * 4} localized pages.`);
