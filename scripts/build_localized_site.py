#!/usr/bin/env python3
"""Build static localized pages from the unchanged English website."""

from __future__ import annotations

import html as html_module
import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path, PurePosixPath
from xml.sax.saxutils import escape as xml_escape

from lxml import etree, html


ROOT = Path(__file__).resolve().parents[1]
CACHE_PATH = ROOT / "scripts" / "localized_translation_cache.json"
LOCALIZED_STYLE_VERSION = "20260819-3"
SOURCE_PAGES = [
    "index.html",
    "nurse/index.html",
    "work/index.html",
    "about/index.html",
    "guides/index.html",
    "guides/shift-rotation-patterns/index.html",
    "guides/shift-pay-calculator/index.html",
    "guides/night-shift-planning/index.html",
    "guides/multiple-workplaces/index.html",
    "guides/nurse-12-hour-shift-schedule/index.html",
    "nurse/contact.html",
    "nurse/support.html",
    "nurse/privacy.html",
    "nurse/healthcarestaffdiscount/index.html",
]

LOCALES = {
    "es": {
        "target": "es",
        "html_lang": "es",
        "hreflang": "es",
        "og_locale": "es_ES",
        "code": "ES",
        "name": "Español",
        "nurse_app": "Mis Turnos de Enfermería",
        "work_app": "Mis Turnos de Trabajo",
        "nurse_short": "Planificador para Enfermería",
        "work_short": "Planificador de Trabajo",
        "store_badge": "es-es.svg",
    },
    "fr": {
        "target": "fr",
        "html_lang": "fr",
        "hreflang": "fr",
        "og_locale": "fr_FR",
        "code": "FR",
        "name": "Français",
        "nurse_app": "Mon Planning Infirmier",
        "work_app": "Mon Planning de Travail",
        "nurse_short": "Planning Infirmier",
        "work_short": "Planning de Travail",
        "store_badge": "fr-fr.svg",
    },
    "de": {
        "target": "de",
        "html_lang": "de",
        "hreflang": "de",
        "og_locale": "de_DE",
        "code": "DE",
        "name": "Deutsch",
        "nurse_app": "Mein Pflege-Dienstplan",
        "work_app": "Mein Schichtplan",
        "nurse_short": "Pflege-Dienstplan",
        "work_short": "Schichtplan",
        "store_badge": "de-de.svg",
    },
    "pt-br": {
        "target": "pt",
        "html_lang": "pt-BR",
        "hreflang": "pt-BR",
        "og_locale": "pt_BR",
        "code": "PT",
        "name": "Português (Brasil)",
        "nurse_app": "Meus Plantões de Enfermagem",
        "work_app": "Meus Turnos de Trabalho",
        "nurse_short": "Planner de Enfermagem",
        "work_short": "Planner de Turnos",
        "store_badge": "pt-br.svg",
    },
    "ja": {
        "target": "ja",
        "html_lang": "ja",
        "hreflang": "ja",
        "og_locale": "ja_JP",
        "code": "JA",
        "name": "日本語",
        "nurse_app": "看護師シフト管理",
        "work_app": "勤務シフト管理",
        "nurse_short": "看護師向けプランナー",
        "work_short": "勤務シフトプランナー",
        "store_badge": "ja-jp.svg",
    },
}

LANGUAGE_LINKS = [
    ("en", "English", ""),
    ("es", "Español", "es"),
    ("fr", "Français", "fr"),
    ("de", "Deutsch", "de"),
    ("pt-BR", "Português (Brasil)", "pt-br"),
    ("ja", "日本語", "ja"),
]

IMAGE_ALTS = {
    "es": {
        "nurse": {
            "hero": "Calendario mensual de turnos en Mis Turnos de Enfermería",
            "earnings": "Estimación mensual de ingresos en Mis Turnos de Enfermería",
            "profiles": "Perfiles de trabajo en Mis Turnos de Enfermería",
        },
        "work": {
            "hero": "Calendario mensual de turnos en Mis Turnos de Trabajo",
            "earnings": "Estimación mensual de ingresos en Mis Turnos de Trabajo",
            "profiles": "Perfiles de trabajo en Mis Turnos de Trabajo",
        },
    },
    "fr": {
        "nurse": {
            "hero": "Calendrier mensuel des gardes dans Mon Planning Infirmier",
            "earnings": "Estimation mensuelle du revenu dans Mon Planning Infirmier",
            "profiles": "Profils professionnels dans Mon Planning Infirmier",
        },
        "work": {
            "hero": "Calendrier mensuel des horaires dans Mon Planning de Travail",
            "earnings": "Estimation mensuelle du revenu dans Mon Planning de Travail",
            "profiles": "Profils professionnels dans Mon Planning de Travail",
        },
    },
    "de": {
        "nurse": {
            "hero": "Monatlicher Pflege-Dienstplan in Mein Pflege-Dienstplan",
            "earnings": "Monatliche Verdienstprognose in Mein Pflege-Dienstplan",
            "profiles": "Arbeitsprofile in Mein Pflege-Dienstplan",
        },
        "work": {
            "hero": "Monatlicher Schichtkalender in Mein Schichtplan",
            "earnings": "Monatliche Verdienstprognose in Mein Schichtplan",
            "profiles": "Arbeitsprofile in Mein Schichtplan",
        },
    },
    "pt-br": {
        "nurse": {
            "hero": "Calendário mensal de plantões no Meus Plantões de Enfermagem",
            "earnings": "Estimativa mensal de ganhos no Meus Plantões de Enfermagem",
            "profiles": "Perfis de trabalho no Meus Plantões de Enfermagem",
        },
        "work": {
            "hero": "Calendário mensal de turnos no Meus Turnos de Trabalho",
            "earnings": "Estimativa mensal de ganhos no Meus Turnos de Trabalho",
            "profiles": "Perfis de trabalho no Meus Turnos de Trabalho",
        },
    },
    "ja": {
        "nurse": {
            "hero": "看護師シフト管理の月間シフトカレンダー",
            "earnings": "看護師シフト管理の月間収入見込み",
            "profiles": "看護師シフト管理の勤務先プロフィール",
        },
        "work": {
            "hero": "勤務シフト管理の月間シフトカレンダー",
            "earnings": "勤務シフト管理の月間収入見込み",
            "profiles": "勤務シフト管理の勤務先プロフィール",
        },
    },
}

TOKENS = {
    "My Nurse Shift Planner": "MNSPBRANDTOKEN",
    "My Work Shift Planner": "MWSPBRANDTOKEN",
    "My Shift Planner": "MSPBRANDTOKEN",
    "Nurse Planner": "NURSEPLANNERTOKEN",
    "Work Planner": "WORKPLANNERTOKEN",
    "App Store": "APPSTORETOKEN",
    "iCloud": "ICLOUDTOKEN",
    "Face ID": "FACEIDTOKEN",
    "CSV": "CSVTOKEN",
    "PDF": "PDFTOKEN",
    "hello@myshiftplanner.app": "EMAILTOKEN",
    "NURSESHIFT20OFF": "OFFER20TOKEN",
    "WORKSHIFT20OFF": "WORKOFFER20TOKEN",
}

MANUAL_TRANSLATIONS = {
    "es": {
        "Choose your planner": "Elige tu planificador",
        "Plan work without the clutter": "Organiza tu trabajo sin complicaciones",
        "Your shifts, hours and estimated pay in one place": "Tus turnos, horas e ingresos estimados en un solo lugar",
        "See work clearly": "Consulta tu trabajo con claridad",
        "Understand the month ahead": "Anticípate al mes que viene",
        "Keep your planner personal": "Mantén tu planificación en privado",
        "Plan difficult schedules with less guesswork": "Organiza horarios complejos con más confianza",
        "Built for life": "Hecho para tu ritmo",
        "Built for work": "Organiza tu trabajo",
        "Built around the realities of nursing work": "Diseñado para la realidad del trabajo de enfermería",
        "Built around real shift work": "Diseñado para horarios de trabajo reales",
        "No shift confusion": "Turnos siempre claros",
        "Core features": "Funciones principales",
        "Quick multi-day adding": "Añade varios días rápidamente",
        "Rotation presets": "Rotaciones predefinidas",
        "Daily shift detail": "Detalle diario del turno",
        "Nurse shift types": "Tipos de turno de enfermería",
        "Work shift types": "Tipos de turno de trabajo",
        "Estimated pay": "Ingresos estimados",
        "Shift reminders": "Notificaciones antes de los turnos",
        "Private by design": "Privado desde el principio",
        "Plan 12-hour nursing shifts": "Planifica turnos de enfermería de 12 horas",
        "Keep overnight shifts clear": "Organiza los turnos nocturnos",
        "Changing workdays": "Días de trabajo variables",
        "Evening and night work": "Turnos de tarde y noche",
        "between shifts.": "entre turnos.",
        "that changes.": "aunque cambie.",
        "Monthly shift": "Calendario",
        "calendar": "mensual",
        "Rotation": "Rotaciones",
        "presets": "predefinidas",
        "Day and night": "Turnos de día",
        "Day, evening": "Día, tarde",
        "and night": "y noche",
        "shifts": "y de noche",
        "Overtime": "Control de",
        "tracking": "horas extra",
        "Estimated": "Ingresos",
        "pay": "estimados",
        "Work": "Perfiles",
        "profiles": "de trabajo",
        "Shift": "Avisos",
        "reminders": "de turno",
        "CSV and PDF": "Exportación",
        "export": "CSV y PDF",
        "Enter": "Entrar",
        "Explore our work": "Ver nuestras aplicaciones",
        "Schedule": "Horarios",
        "Hours and pay": "Horas e ingresos",
        "Choose by schedule": "Elige según tu horario",
        "Healthcare schedules": "Turnos de enfermería",
        "General shift work": "Trabajo por turnos",
        "Common shift rotation patterns": "Patrones habituales de rotación de turnos",
        "Estimate gross shift pay": "Estima los ingresos brutos por turno",
        "Organize night shifts": "Organiza los turnos nocturnos",
        "Shift planner questions": "Preguntas sobre los planificadores de turnos",
        "Practical nurse shift planning guides": "Guías prácticas para planificar turnos de enfermería",
        "Free resources for changing work schedules": "Recursos gratuitos para horarios de trabajo variables",
        "Make a changing work schedule easier to understand": "Entiende mejor un horario de trabajo variable",
        "Keep night shifts clear before they begin": "Organiza los turnos nocturnos antes de que empiecen",
        "Shift pay calculator": "Calculadora de ingresos por turnos",
        "Track shifts and pay together": "Controla turnos e ingresos en un solo lugar",
        "Plan 12-hour nursing shifts without losing the month": "Organiza turnos de enfermería de 12 horas sin perder de vista el mes",
        "App Store listing": "Ficha en App Store",
        "Guides": "Guías",
        "All guides": "Todas las guías",
        "Start with the schedule you actually receive": "Empieza por el horario que realmente recibes",
        "Five patterns you may encounter": "Cinco patrones que puedes encontrar",
        "How to choose a planner setup": "Cómo configurar tu planificador",
        "Use rotation presets carefully": "Usa los patrones de rotación con criterio",
        "Build the pattern in a private calendar": "Añade el patrón a un calendario privado",
        "Enter your planned hours and rates": "Introduce las horas y tarifas previstas",
        "Track the complete month": "Controla el mes completo",
        "Use the start date as the shift date": "Usa la fecha de inicio como fecha del turno",
        "A seven-point night shift checklist": "Siete puntos para revisar antes de un turno nocturno",
        "Separate work reminders from personal recovery time": "Separa las notificaciones de trabajo del tiempo de descanso",
        "Do not rely on color alone": "No te guíes solo por el color",
        "Check hours and pay as a second step": "Revisa también las horas y los ingresos",
        "See night shifts across the month": "Consulta los turnos nocturnos de todo el mes",
        "WORKSHIFT20OFF": "WORKSHIFT20OFF",
        "NURSESHIFT20OFF": "NURSESHIFT20OFF",
    },
    "fr": {
        "Choose your planner": "Choisissez votre planning",
        "Plan work without the clutter": "Organisez votre travail sans complexité",
        "Your shifts, hours and estimated pay in one place": "Vos horaires, vos heures et votre revenu estimé au même endroit",
        "See work clearly": "Visualisez clairement votre travail",
        "Understand the month ahead": "Anticipez le mois à venir",
        "Keep your planner personal": "Gardez votre planning personnel",
        "Which shift planner fits you?": "Quel planning correspond à votre rythme ?",
        "Plan difficult schedules with less guesswork": "Organisez les horaires complexes plus sereinement",
        "Built for life": "Pensé pour votre quotidien",
        "Built for work": "Pensé pour les horaires",
        "Built around the realities of nursing work": "Conçu pour la réalité du travail infirmier",
        "Built around real shift work": "Conçu pour les horaires de travail réels",
        "Night shifts": "Gardes de nuit",
        "No shift confusion": "Des gardes toujours lisibles",
        "Core features": "Fonctions principales",
        "Shift calendar": "Calendrier des horaires",
        "Quick multi-day adding": "Ajout rapide sur plusieurs jours",
        "Rotation presets": "Modèles de rotation",
        "Daily shift detail": "Détail de chaque journée",
        "Nurse shift types": "Types de gardes infirmières",
        "Work shift types": "Types de postes de travail",
        "Estimated pay": "Revenu estimé",
        "Shift reminders": "Notifications avant les horaires",
        "Private by design": "Confidentiel dès la conception",
        "Plan 12-hour nursing shifts": "Planifiez les gardes infirmières de 12 heures",
        "Keep overnight shifts clear": "Organisez clairement les gardes de nuit",
        "Changing workdays": "Jours de travail variables",
        "Evening and night work": "Travail du soir et de nuit",
        "between shifts.": "entre deux gardes.",
        "that changes.": "qui changent.",
        "Monthly shift": "Calendrier",
        "calendar": "mensuel",
        "Rotation": "Rotations",
        "presets": "prédéfinies",
        "Day and night": "Gardes de jour",
        "Day, evening": "Jour, soir",
        "and night": "et nuit",
        "shifts": "et de nuit",
        "Overtime": "Suivi des",
        "tracking": "heures sup.",
        "Estimated": "Revenu",
        "pay": "estimé",
        "Work": "Profils",
        "profiles": "professionnels",
        "Shift": "Notifications",
        "reminders": "de garde",
        "CSV and PDF": "Exports",
        "export": "CSV et PDF",
        "Enter": "Accéder",
        "Explore our work": "Découvrir nos applications",
        "Schedule": "Planning",
        "Hours and pay": "Heures et revenu",
        "Choose by schedule": "Choisissez selon votre rythme",
        "Healthcare schedules": "Horaires de soins",
        "General shift work": "Travail posté",
        "Common shift rotation patterns": "Modèles courants de rotation des horaires",
        "Estimate gross shift pay": "Estimez le revenu brut d'un poste",
        "Organize night shifts": "Organisez les gardes de nuit",
        "Shift planner questions": "Questions sur les plannings de travail",
        "Practical nurse shift planning guides": "Guides pratiques pour planifier les gardes infirmières",
        "Free resources for changing work schedules": "Ressources gratuites pour les horaires variables",
        "Make a changing work schedule easier to understand": "Comprenez plus facilement un planning variable",
        "Keep night shifts clear before they begin": "Organisez vos gardes de nuit avant leur début",
        "Shift pay calculator": "Calculateur de revenu par poste",
        "Track shifts and pay together": "Suivez vos horaires et votre revenu ensemble",
        "Plan 12-hour nursing shifts without losing the month": "Planifiez les gardes infirmières de 12 heures sans perdre de vue le mois",
        "App Store listing": "Fiche App Store",
        "Guides": "Guides",
        "All guides": "Tous les guides",
        "Rotation guide": "Guide des rotations",
        "Use the start date as the shift date": "Utilisez la date de début comme date de la garde",
        "A seven-point night shift checklist": "Sept points à vérifier avant une garde de nuit",
        "Separate work reminders from personal recovery time": "Séparez les notifications de travail du temps de récupération",
        "Check hours and pay as a second step": "Vérifiez aussi les heures et le revenu estimé",
        "See night shifts across the month": "Visualisez les gardes de nuit sur tout le mois",
        "Record the complete shift": "Enregistrez la garde complète",
        "Keep shifts, units and estimated pay together": "Regroupez les gardes, les services et le revenu estimé",
        "Keep recurring work patterns visible without rebuilding the month manually.": "Gardez les cycles de travail récurrents visibles sans reconstruire le mois manuellement.",
        "Make sure the planner treats an earlier clock time as the following day.": "Vérifiez que le planning interprète une heure plus tôt comme appartenant au jour suivant.",
        "Manage or cancel subscriptions through App Store settings.": "Gérez ou annulez vos abonnements dans les réglages de l'App Store.",
        "Organize day and night shifts, on-call work, breaks and multiple units without losing the monthly view.": "Organisez les gardes de jour et de nuit, les astreintes, les pauses et plusieurs services sans perdre la vue mensuelle.",
        "StoreKit and the App Store for purchases and subscriptions.": "StoreKit et l'App Store pour les achats et les abonnements.",
        "The 7-day free trial still applies before the discounted yearly subscription begins.": "L'essai gratuit de 7 jours reste valable avant le début de l'abonnement annuel à tarif réduit.",
        "WORKSHIFT20OFF": "WORKSHIFT20OFF",
        "NURSESHIFT20OFF": "NURSESHIFT20OFF",
    },
    "de": {
        "Choose your planner": "Wählen Sie Ihren Dienstplan",
        "Plan work without the clutter": "Arbeit übersichtlich planen",
        "Your shifts, hours and estimated pay in one place": "Schichten, Stunden und Verdienstprognose an einem Ort",
        "See work clearly": "Den Arbeitsplan klar überblicken",
        "Understand the month ahead": "Den kommenden Monat im Blick behalten",
        "Keep your planner personal": "Den Dienstplan persönlich und privat halten",
        "Plan difficult schedules with less guesswork": "Komplexe Dienstpläne verlässlich organisieren",
        "Built for life": "Für Ihren Alltag gemacht",
        "Built for work": "Für Arbeitszeiten",
        "Built around the realities of nursing work": "Für den echten Pflegealltag entwickelt",
        "Built around real shift work": "Für echte Schichtarbeit entwickelt",
        "Rotating schedules": "Wechselnde Schichtpläne",
        "No shift confusion": "Schichten klar im Blick",
        "Core features": "Wichtige Funktionen",
        "Quick multi-day adding": "Mehrere Tage schnell eintragen",
        "Rotation presets": "Rotationsvorlagen",
        "Daily shift detail": "Tägliche Schichtdetails",
        "Nurse shift types": "Schichtarten für die Pflege",
        "Work shift types": "Schichtarten für den Arbeitsalltag",
        "Estimated pay": "Verdienstprognose",
        "Shift reminders": "Benachrichtigungen vor Schichten",
        "Private by design": "Datenschutz von Anfang an",
        "Plan 12-hour nursing shifts": "12-Stunden-Dienste in der Pflege planen",
        "Keep overnight shifts clear": "Nachtdienste übersichtlich planen",
        "Changing workdays": "Wechselnde Arbeitstage",
        "Evening and night work": "Abend- und Nachtarbeit",
        "between shifts.": "zwischen den Schichten.",
        "that changes.": "die sich ändern.",
        "Monthly shift": "Monatlicher",
        "calendar": "Schichtkalender",
        "Rotation": "Rotations-",
        "presets": "vorlagen",
        "Day and night": "Tag- und Nacht-",
        "Day, evening": "Tag, Abend",
        "and night": "und Nacht",
        "shifts": "schichten",
        "Overtime": "Überstunden",
        "tracking": "erfassen",
        "Estimated": "Verdienst",
        "pay": "schätzen",
        "Work": "Arbeits-",
        "profiles": "profile",
        "Shift": "Schicht-",
        "reminders": "hinweise",
        "CSV and PDF": "CSV- und PDF-",
        "export": "Export",
        "Enter": "Öffnen",
        "Explore our work": "Weitere Apps entdecken",
        "Schedule": "Dienstplan",
        "Hours and pay": "Stunden und Verdienst",
        "Choose by schedule": "Passend zum Arbeitsalltag wählen",
        "Healthcare schedules": "Pflegedienstpläne",
        "General shift work": "Allgemeine Schichtarbeit",
        "Common shift rotation patterns": "Gängige Muster für Schichtrotationen",
        "Estimate gross shift pay": "Bruttoverdienst pro Schicht schätzen",
        "Organize night shifts": "Nachtschichten organisieren",
        "Shift planner questions": "Fragen zu den Schichtplanern",
        "Practical nurse shift planning guides": "Praktische Leitfäden für Pflegedienstpläne",
        "Free resources for changing work schedules": "Kostenlose Hilfen für wechselnde Arbeitspläne",
        "Make a changing work schedule easier to understand": "Wechselnde Arbeitspläne leichter überblicken",
        "Keep night shifts clear before they begin": "Nachtschichten vor Beginn übersichtlich planen",
        "Shift pay calculator": "Schichtlohnrechner",
        "Track shifts and pay together": "Schichten und Verdienst gemeinsam erfassen",
        "Plan 12-hour nursing shifts without losing the month": "12-Stunden-Dienste planen und den Monat im Blick behalten",
        "App Store listing": "App-Store-Seite",
        "Guides": "Ratgeber",
        "All guides": "Alle Ratgeber",
        "Rotation guide": "Rotationsleitfaden",
        "Check hours and pay as a second step": "Prüfen Sie anschließend Stunden und Verdienst",
        "Track the complete month": "Den gesamten Monat im Blick behalten",
        "Keep shifts, units and estimated pay together": "Schichten, Bereiche und Verdienstprognose zusammenführen",
        "Personal Data means information that relates to an identified or identifiable individual.": "Personenbezogene Daten sind Informationen, die sich auf eine identifizierte oder identifizierbare Person beziehen.",
        "WORKSHIFT20OFF": "WORKSHIFT20OFF",
        "NURSESHIFT20OFF": "NURSESHIFT20OFF",
    },
    "pt-br": {
        "Choose your planner": "Escolha seu planner",
        "Plan work without the clutter": "Organize o trabalho sem complicação",
        "Your shifts, hours and estimated pay in one place": "Turnos, horas e ganhos estimados em um só lugar",
        "See work clearly": "Visualize seu trabalho com clareza",
        "Understand the month ahead": "Antecipe o próximo mês",
        "Keep your planner personal": "Mantenha seu planejamento pessoal",
        "Plan difficult schedules with less guesswork": "Organize escalas complexas com mais segurança",
        "Built for life": "Feito para a sua rotina",
        "Built for work": "Organize seus turnos",
        "Built around the realities of nursing work": "Criado para a realidade da enfermagem",
        "Built around real shift work": "Criado para escalas de trabalho reais",
        "No shift confusion": "Turnos sempre claros",
        "Core features": "Principais recursos",
        "Quick multi-day adding": "Adição rápida em vários dias",
        "Rotation presets": "Modelos de rotação",
        "Daily shift detail": "Detalhes do turno diário",
        "Nurse shift types": "Tipos de plantão de enfermagem",
        "Work shift types": "Tipos de turno de trabalho",
        "Estimated pay": "Ganhos estimados",
        "Shift reminders": "Notificações antes dos turnos",
        "Private by design": "Privado desde o início",
        "Plan 12-hour nursing shifts": "Planeje plantões de enfermagem de 12 horas",
        "Keep overnight shifts clear": "Organize os plantões noturnos",
        "Changing workdays": "Dias de trabalho variáveis",
        "Evening and night work": "Turnos da tarde e da noite",
        "between shifts.": "entre os plantões.",
        "that changes.": "mesmo quando mudam.",
        "Monthly shift": "Calendário",
        "calendar": "mensal",
        "Rotation": "Rotações",
        "presets": "predefinidas",
        "Day and night": "Plantões diurnos",
        "Day, evening": "Dia, tarde",
        "and night": "e noite",
        "shifts": "e noturnos",
        "Overtime": "Controle de",
        "tracking": "horas extras",
        "Estimated": "Ganhos",
        "pay": "estimados",
        "Work": "Perfis de",
        "profiles": "trabalho",
        "Shift": "Avisos de",
        "reminders": "turno",
        "CSV and PDF": "Exportação",
        "export": "CSV e PDF",
        "Enter": "Acessar",
        "Explore our work": "Conheça nossos aplicativos",
        "Schedule": "Escala",
        "Hours and pay": "Horas e ganhos",
        "Choose by schedule": "Escolha de acordo com sua rotina",
        "Healthcare schedules": "Escalas de enfermagem",
        "General shift work": "Trabalho em turnos",
        "Common shift rotation patterns": "Padrões comuns de rotação de turnos",
        "Estimate gross shift pay": "Estime os ganhos brutos por turno",
        "Organize night shifts": "Organize os turnos noturnos",
        "Shift planner questions": "Dúvidas sobre os planners de turnos",
        "Practical nurse shift planning guides": "Guias práticos para escalas de enfermagem",
        "Free resources for changing work schedules": "Recursos gratuitos para escalas de trabalho variáveis",
        "Make a changing work schedule easier to understand": "Entenda melhor uma escala de trabalho variável",
        "Keep night shifts clear before they begin": "Organize os plantões noturnos antes do início",
        "Shift pay calculator": "Calculadora de ganhos por turno",
        "Track shifts and pay together": "Acompanhe turnos e ganhos em um só lugar",
        "Plan 12-hour nursing shifts without losing the month": "Planeje plantões de 12 horas sem perder o mês de vista",
        "App Store listing": "Página na App Store",
        "Guides": "Guias",
        "All guides": "Todos os guias",
        "Check hours and pay as a second step": "Confira também as horas e os ganhos estimados",
        "Track the complete month": "Acompanhe o mês inteiro",
        "Keep shifts, units and estimated pay together": "Mantenha turnos, setores e ganhos estimados juntos",
        "WORKSHIFT20OFF": "WORKSHIFT20OFF",
        "NURSESHIFT20OFF": "NURSESHIFT20OFF",
    },
    "ja": {
        "Choose your planner": "プランナーを選ぶ",
        "Plan work without the clutter": "複雑にせず勤務を整理",
        "Your shifts, hours and estimated pay in one place": "シフト・勤務時間・収入見込みをまとめて管理",
        "See work clearly": "勤務予定をひと目で確認",
        "Understand the month ahead": "これからの1か月を把握",
        "Keep your planner personal": "自分だけの勤務管理",
        "Which shift planner fits you?": "あなたに合うプランナーは？",
        "Plan difficult schedules with less guesswork": "複雑な勤務予定もわかりやすく整理",
        "Built for life": "シフトのある毎日を",
        "Built for work": "変化する勤務を",
        "Built around the realities of nursing work": "看護の働き方に合わせて設計",
        "Built around real shift work": "変化する勤務シフトに対応",
        "Rotating schedules": "ローテーション勤務",
        "Night shifts": "夜勤",
        "Overtime": "残業",
        "No shift confusion": "シフトをひと目で確認",
        "Work-life balance": "仕事と生活の予定を整理",
        "Core features": "主な機能",
        "Shift calendar": "シフトカレンダー",
        "Quick multi-day adding": "複数日へまとめて追加",
        "Rotation presets": "ローテーションプリセット",
        "Daily shift detail": "1日のシフト詳細",
        "Nurse shift types": "看護勤務に合うシフト種別",
        "Work shift types": "多様な勤務シフト種別",
        "Estimated pay": "収入見込み",
        "Work profiles": "勤務先プロフィール",
        "Shift reminders": "シフト前の通知",
        "Private by design": "プライバシーを重視",
        "Plan 12-hour nursing shifts": "12時間の看護シフトを計画",
        "Keep overnight shifts clear": "夜勤をわかりやすく整理",
        "Changing workdays": "変化する勤務日",
        "Evening and night work": "夕勤・夜勤",
        "between shifts.": "もっとわかりやすく。",
        "that changes.": "ひと目でわかりやすく。",
        "Monthly shift": "月間シフト",
        "calendar": "カレンダー",
        "Rotation": "ローテーション",
        "presets": "プリセット",
        "Day and night": "日勤・夜勤",
        "Day, evening": "日勤・夕勤",
        "and night": "夜勤",
        "shifts": "シフト",
        "Overtime": "残業時間",
        "tracking": "を記録",
        "Estimated": "収入見込み",
        "pay": "を確認",
        "Work": "勤務先",
        "profiles": "プロフィール",
        "Shift": "シフト前",
        "reminders": "に通知",
        "CSV and PDF": "CSV・PDF",
        "export": "書き出し",
        "Enter": "開く",
        "Explore our work": "その他のアプリを見る",
        "Schedule": "勤務予定",
        "Hours and pay": "勤務時間と収入",
        "Choose by schedule": "働き方で選ぶ",
        "Healthcare schedules": "看護シフト",
        "General shift work": "幅広いシフト勤務",
        "Common shift rotation patterns": "よくあるシフトローテーション",
        "Estimate gross shift pay": "シフトごとの総支給額を試算",
        "Organize night shifts": "夜勤をわかりやすく整理",
        "Shift planner questions": "シフト管理に関するよくある質問",
        "Practical nurse shift planning guides": "看護シフト管理の実用ガイド",
        "Free resources for changing work schedules": "変化する勤務予定に役立つ無料ガイド",
        "Make a changing work schedule easier to understand": "変化する勤務予定をわかりやすく",
        "Keep night shifts clear before they begin": "夜勤の前に予定を整理",
        "Shift pay calculator": "シフト給与計算ツール",
        "Track shifts and pay together": "シフトと収入をまとめて管理",
        "Plan 12-hour nursing shifts without losing the month": "12時間の看護シフトを月全体で管理",
        "App Store listing": "App Storeのページ",
        "Guides": "ガイド",
        "All guides": "すべてのガイド",
        "Start with the schedule you actually receive": "実際の勤務表を基準にする",
        "Five patterns you may encounter": "よくある5つのローテーション",
        "How to choose a planner setup": "自分に合う設定の選び方",
        "What to compare between rotations": "ローテーションで確認するポイント",
        "Use rotation presets carefully": "ローテーションプリセットを活用",
        "Build the pattern in a private calendar": "プライベートなカレンダーに登録",
        "Enter your planned hours and rates": "予定時間と賃金設定を入力",
        "How the estimate is calculated": "収入見込みの計算方法",
        "Before you use the result": "計算結果を使う前に",
        "Track the complete month": "月1か月分をまとめて管理",
        "Use the start date as the shift date": "シフト開始日で登録",
        "A seven-point night shift checklist": "夜勤前に確認する7つの項目",
        "Separate work reminders from personal recovery time": "勤務通知と休息時間を分けて管理",
        "Do not rely on color alone": "色だけに頼らず確認",
        "Check hours and pay as a second step": "勤務時間と収入見込みも確認",
        "See night shifts across the month": "夜勤を月全体で確認",
        "Manage multiple workplaces without mixing the details": "複数の勤務先を分けて管理",
        "Create one profile for each meaningful work context": "勤務先ごとにプロフィールを作成",
        "What each profile should contain": "プロフィールに記録する内容",
        "Use one calendar to find conflicts": "1つのカレンダーで重複を確認",
        "Keep rates separate": "勤務先ごとの賃金設定を分ける",
        "Make exports understandable": "エクスポートをわかりやすく",
        "Review changes at the source": "勤務先の変更を確認",
        "Keep every workplace organized": "すべての勤務先を整理",
        "Record the complete shift": "シフト全体を正確に記録",
        "Keep day and night assignments explicit": "日勤と夜勤を明確に区別",
        "Separate related records": "関連する記録を分ける",
        "Build rotations from a confirmed date": "確定した日付からローテーションを作成",
        "Review the week and month": "週と月の予定を確認",
        "Treat pay as an estimate": "収入は目安として確認",
        "Keep shifts, units and estimated pay together": "シフト・配属先・収入見込みをまとめて管理",
        "WORKSHIFT20OFF": "WORKSHIFT20OFF",
        "NURSESHIFT20OFF": "NURSESHIFT20OFF",
    },
}

SKIP_RE = re.compile(
    r"^(?:[\W_]+|\d+(?:[.,]\d+)?|USD|EUR|GBP|CAD|AUD|RON|JPY|KRW|PLN|TRY|MXN|BRL|EN|ES|FR|DE|PT|JA|\$0\.00)$"
)


def page_route(source: str) -> str:
    path = PurePosixPath(source)
    if path.name == "index.html":
        parent = "/" + str(path.parent).strip("./")
        return "/" if parent == "/" else parent.rstrip("/") + "/"
    return "/" + source


def localized_route(route: str, locale: str) -> str:
    return f"/{locale}{route}" if route != "/" else f"/{locale}/"


def public_url(route: str, locale: str | None = None) -> str:
    localized = localized_route(route, locale) if locale else route
    return "https://myshiftplanner.app" + localized


def protect(text: str) -> str:
    result = text
    for source, token in TOKENS.items():
        result = result.replace(source, token)
    return result


def restore(text: str, locale: str) -> str:
    config = LOCALES[locale]
    replacements = {
        "MNSPBRANDTOKEN": config["nurse_app"],
        "MWSPBRANDTOKEN": config["work_app"],
        "MSPBRANDTOKEN": "My Shift Planner",
        "NURSEPLANNERTOKEN": config["nurse_short"],
        "WORKPLANNERTOKEN": config["work_short"],
        "APPSTORETOKEN": "App Store",
        "ICLOUDTOKEN": "iCloud",
        "FACEIDTOKEN": "Face ID",
        "CSVTOKEN": "CSV",
        "PDFTOKEN": "PDF",
        "EMAILTOKEN": "hello@myshiftplanner.app",
        "OFFER20TOKEN": "NURSESHIFT20OFF",
        "WORKOFFER20TOKEN": "WORKSHIFT20OFF",
    }
    aliases = {
        "MNSPMARQUETOKEN": config["nurse_app"],
        "MWSPMARQUETOKEN": config["work_app"],
        "MSPMARQUETOKEN": "My Shift Planner",
        "MNSPブランドトークン": config["nurse_app"],
        "MWSPブランドトークン": config["work_app"],
        "MSPブランドトークン": "My Shift Planner",
        "OFERTA20TOKEN": "NURSESHIFT20OFF",
        "OFFRE20JETON": "NURSESHIFT20OFF",
        "ANGEBOT20TOKEN": "NURSESHIFT20OFF",
        "OFERTA20TOKEN": "NURSESHIFT20OFF",
        "オファー20トークン": "NURSESHIFT20OFF",
        "TURNO DE TRABAJO20OFF": "WORKSHIFT20OFF",
        "ARBEITSSCHICHT20AUS": "WORKSHIFT20OFF",
        "TURNO20OFF": "WORKSHIFT20OFF",
        "ワークシフト20オフ": "WORKSHIFT20OFF",
        "ENFERMERAPLANNERTOKEN": config["nurse_short"],
        "INFIRMIÈREPLANNERTOKEN": config["nurse_short"],
        "ナースプランナートークン": config["nurse_short"],
        "ナーセプランナートークン": config["nurse_short"],
        "PLANIFICADOR DE TRABAJO": config["work_short"],
        "ワークプランナートークン": config["work_short"],
        "APPSTORTOKEN": "App Store",
        "APPSTOREトークン": "App Store",
        "アプリストアトークン": "App Store",
        "JETONS DE L'APPSTORE": "App Store",
        "iCloudTOKEN": "iCloud",
        "CSVトークン": "CSV",
        "PDFトークン": "PDF",
    }
    result = text
    for token, value in replacements.items():
        result = result.replace(token, value)
    for token, value in aliases.items():
        result = result.replace(token, value)
    return refine(result, locale)


def refine(text: str, locale: str) -> str:
    substitutions = {
        "es": {
            "cambios de trabajo": "turnos de trabajo",
            "cambio de trabajo": "turno de trabajo",
            "rastreador": "registro",
            "nómina estimada": "ingresos estimados",
        },
        "fr": {
            "quarts de nuit": "gardes de nuit",
            "quart de nuit": "garde de nuit",
            "quarts de travail": "horaires de travail",
            "quart de travail": "horaire de travail",
            "postes de travail": "horaires de travail",
            "poste de travail": "horaire de travail",
            "traqueur": "suivi",
        },
        "de": {
            "Krankenschwestern": "Pflegekräfte",
            "Krankenschwester": "Pflegekraft",
            "Tracker": "Übersicht",
        },
        "pt-br": {
            "enfermeiras": "profissionais de enfermagem",
            "rastreador": "controle",
            "Assinaturas, avaliações e pagamentos": "Assinaturas, testes e pagamentos",
            "sua obra": "seu trabalho",
        },
        "ja": {
            "輸出": "エクスポート",
            "仕事用プロファイル": "勤務先プロフィール",
            "仕事プロファイル": "勤務先プロフィール",
            "推定給与": "収入見込み",
            "シフトリマインダー": "シフト前の通知",
            "回転プリセット": "ローテーションプリセット",
        },
    }
    result = text
    for old, new in substitutions[locale].items():
        result = result.replace(old, new)
    return result


def translatable(value: str) -> bool:
    value = " ".join(value.split())
    if not value or SKIP_RE.fullmatch(value):
        return False
    if value.startswith(("http://", "https://", "mailto:", "tel:")):
        return False
    if "@" in value and " " not in value:
        return False
    return any(char.isalpha() for char in value)


def normalized(value: str) -> str:
    return " ".join(value.split())


def translate_request(text: str, target: str) -> str:
    params = urllib.parse.urlencode({"client": "gtx", "sl": "en", "tl": target, "dt": "t", "q": text})
    request = urllib.request.Request(
        "https://translate.googleapis.com/translate_a/single?" + params,
        headers={"User-Agent": "Mozilla/5.0"},
    )
    for attempt in range(5):
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                payload = json.load(response)
            return "".join(segment[0] for segment in payload[0] if segment[0])
        except Exception:
            if attempt == 4:
                raise
            time.sleep(1.5 * (attempt + 1))
    raise RuntimeError("Translation request failed")


def translate_values(values: set[str], locale: str, cache: dict) -> dict[str, str]:
    target = LOCALES[locale]["target"]
    locale_cache = cache.setdefault(locale, {})
    pending = [value for value in sorted(values) if value not in locale_cache]
    marker = "<<<SPLIT_9F3A>>>"

    batches: list[list[str]] = []
    current: list[str] = []
    current_size = 0
    for value in pending:
        protected = protect(value)
        extra = len(protected) + len(marker) + 2
        if current and current_size + extra > 3200:
            batches.append(current)
            current, current_size = [], 0
        current.append(value)
        current_size += extra
    if current:
        batches.append(current)

    for index, batch in enumerate(batches, 1):
        joined = ("\n" + marker + "\n").join(protect(value) for value in batch)
        translated = translate_request(joined, target)
        pieces = [piece.strip() for piece in translated.split(marker)]
        if len(pieces) != len(batch):
            pieces = [translate_request(protect(value), target).strip() for value in batch]
        for source, translated_value in zip(batch, pieces):
            locale_cache[source] = restore(translated_value, locale)
        CACHE_PATH.write_text(json.dumps(cache, ensure_ascii=False, indent=2) + "\n")
        print(f"{locale}: translated batch {index}/{len(batches)}")
        time.sleep(0.12)
    return locale_cache


def json_strings(value, output: set[str]) -> None:
    if isinstance(value, dict):
        for key, child in value.items():
            if key in {"name", "description", "headline", "operatingSystem"} and isinstance(child, str):
                if translatable(child):
                    output.add(normalized(child))
            else:
                json_strings(child, output)
    elif isinstance(value, list):
        for child in value:
            json_strings(child, output)


def collect_values() -> set[str]:
    values: set[str] = set()
    for source in SOURCE_PAGES:
        document = html.parse(str(ROOT / source)).getroot()
        for element in document.iter():
            if not isinstance(element.tag, str):
                continue
            if element.tag in {"script", "style"}:
                if element.tag == "script" and element.get("type") == "application/ld+json" and element.text:
                    try:
                        json_strings(json.loads(element.text), values)
                    except json.JSONDecodeError:
                        pass
                continue
            if element.text and translatable(element.text):
                values.add(normalized(element.text))
            if element.tail and translatable(element.tail):
                values.add(normalized(element.tail))
            for attribute in ("alt", "aria-label", "placeholder", "title"):
                if element.get(attribute) and translatable(element.get(attribute)):
                    values.add(normalized(element.get(attribute)))
            if element.tag == "meta" and element.get("content"):
                key = element.get("name") or element.get("property") or ""
                if key in {"description", "og:title", "og:description"} and translatable(element.get("content")):
                    values.add(normalized(element.get("content")))
    return values


def translated(value: str | None, translations: dict[str, str]) -> str | None:
    if not value or not translatable(value):
        return value
    key = normalized(value)
    locale = translations.get("__locale__", "")
    if locale and key == "Nurse Planner":
        replacement = LOCALES[locale]["nurse_short"]
    elif locale and key == "Work Planner":
        replacement = LOCALES[locale]["work_short"]
    elif locale and key == "My Shift Planner":
        replacement = "My Shift Planner"
    else:
        replacement = MANUAL_TRANSLATIONS.get(locale, {}).get(key, translations.get(key, key))
    replacement = restore(replacement, locale) if locale else replacement
    leading = value[: len(value) - len(value.lstrip())]
    trailing = value[len(value.rstrip()) :]
    return leading + replacement + trailing


def translate_json(value, translations: dict[str, str], locale: str, route: str):
    if isinstance(value, dict):
        result = {}
        for key, child in value.items():
            if key in {"name", "description", "headline", "operatingSystem"} and isinstance(child, str):
                source_key = normalized(child)
                result[key] = MANUAL_TRANSLATIONS.get(locale, {}).get(
                    source_key, restore(translations.get(source_key, protect(child)), locale)
                )
            elif key in {"url", "item", "mainEntityOfPage"} and isinstance(child, str) and child.startswith("https://myshiftplanner.app/"):
                parsed = urllib.parse.urlparse(child)
                result[key] = public_url(parsed.path, locale)
            elif key == "inLanguage":
                result[key] = LOCALES[locale]["html_lang"]
            else:
                result[key] = translate_json(child, translations, locale, route)
        return result
    if isinstance(value, list):
        return [translate_json(child, translations, locale, route) for child in value]
    return value


def resolve_path(value: str, route: str) -> str:
    if value.startswith(("#", "mailto:", "tel:", "javascript:", "data:")):
        return value
    parsed = urllib.parse.urlparse(value)
    if parsed.scheme or value.startswith("//"):
        return value
    absolute = urllib.parse.urljoin(route, value)
    return absolute


def localize_internal(value: str, route: str, locale: str, attribute: str) -> str:
    if attribute == "srcset":
        entries = []
        for item in value.split(","):
            parts = item.strip().split()
            if parts:
                parts[0] = resolve_path(parts[0], route)
            entries.append(" ".join(parts))
        return ", ".join(entries)

    if value.startswith(("#", "mailto:", "tel:", "javascript:", "data:")):
        return value
    parsed = urllib.parse.urlparse(value)
    if parsed.scheme in {"http", "https"}:
        if parsed.netloc not in {"myshiftplanner.app", "www.myshiftplanner.app"}:
            return value
        path = parsed.path or "/"
        if path.startswith(("/assets/", "/favicon.ico")):
            return value
        return urllib.parse.urlunparse(parsed._replace(path=localized_route(path, locale)))
    absolute = resolve_path(value, route)
    parsed_absolute = urllib.parse.urlparse(absolute)
    path = parsed_absolute.path
    if attribute == "href" and path.lower().endswith(".pdf"):
        return absolute
    if attribute in {"src", "srcset"} or path.startswith(("/assets/", "/favicon.ico")):
        return absolute
    localized = localized_route(path, locale)
    if parsed_absolute.query:
        localized += "?" + parsed_absolute.query
    if parsed_absolute.fragment:
        localized += "#" + parsed_absolute.fragment
    return localized


def replace_images(document, locale: str, source: str) -> None:
    if source not in {"nurse/index.html", "work/index.html"}:
        return
    kind = "nurse" if source.startswith("nurse/") else "work"
    mapping = {"1": "hero", "2": "earnings", "3": "profiles"}
    for image in document.xpath("//img"):
        src = image.get("src", "")
        match = re.search(rf"{kind}-(\d)-480\.webp", src)
        if not match:
            continue
        role = mapping[match.group(1)]
        base = f"/assets/images/localized/{locale}/{kind}-{role}"
        image.set("src", base + "-480.webp")
        image.set("srcset", base + "-480.webp 480w, " + base + "-800.webp 800w")
        image.set("width", "800")
        image.set("height", "1732")
        image.set("alt", IMAGE_ALTS[locale][kind][role])


def add_language_menu(document, locale: str, route: str) -> None:
    for old in document.xpath('//details[contains(concat(" ", normalize-space(@class), " "), " language-menu ")]'):
        old.getparent().remove(old)
    containers = document.xpath('//*[contains(concat(" ", normalize-space(@class), " "), " topbar-inner ")]')
    if not containers:
        return
    container = containers[0]
    classes = set((container.get("class") or "").split())
    classes.add("topbar-with-language")
    container.set("class", " ".join(classes))
    details = etree.Element("details", {"class": "language-menu"})
    summary = etree.SubElement(details, "summary", {"aria-label": LOCALES[locale]["name"]})
    summary.text = LOCALES[locale]["code"]
    panel = etree.SubElement(details, "div", {"class": "language-menu-panel"})
    for hreflang, name, locale_path in LANGUAGE_LINKS:
        target = route if not locale_path else localized_route(route, locale_path)
        link = etree.SubElement(panel, "a", {"href": target, "lang": hreflang})
        if locale_path == locale:
            link.set("aria-current", "page")
        link.text = name
    container.append(details)


def add_hreflang(document, route: str) -> None:
    head = document.find("head")
    for old in document.xpath('//link[@rel="alternate"]'):
        old.getparent().remove(old)
    canonical = document.xpath('//link[@rel="canonical"]')
    insert_at = head.index(canonical[0]) + 1 if canonical else 0
    links = [("en", public_url(route))]
    links.extend((config["hreflang"], public_url(route, locale)) for locale, config in LOCALES.items())
    links.append(("x-default", public_url(route)))
    for hreflang, href in links:
        element = etree.Element("link", {"rel": "alternate", "hreflang": hreflang, "href": href})
        head.insert(insert_at, element)
        insert_at += 1


def add_localized_nav_script(document) -> None:
    if document.xpath('//script[contains(@src,"localized-nav.js")]'):
        return
    body = document.find("body")
    script = etree.Element("script", {"src": "/assets/js/localized-nav.js", "defer": "defer"})
    body.append(script)


def localize_page(source: str, locale: str, translations: dict[str, str]) -> None:
    route = page_route(source)
    document = html.parse(str(ROOT / source)).getroot()
    document.set("lang", LOCALES[locale]["html_lang"])

    for element in document.iter():
        if not isinstance(element.tag, str):
            continue
        if element.tag == "script":
            if element.get("type") == "application/ld+json" and element.text:
                try:
                    payload = json.loads(element.text)
                    payload = translate_json(payload, translations, locale, route)
                    element.text = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
                except json.JSONDecodeError:
                    pass
            continue
        if element.tag == "style":
            continue
        element.text = translated(element.text, translations)
        element.tail = translated(element.tail, translations)
        for attribute in ("alt", "aria-label", "placeholder", "title"):
            if element.get(attribute):
                element.set(attribute, translated(element.get(attribute), translations) or "")
        if element.tag == "meta" and element.get("content"):
            key = element.get("name") or element.get("property") or ""
            if key in {"description", "og:title", "og:description"}:
                element.set("content", translated(element.get("content"), translations) or "")

    for element in document.iter():
        if not isinstance(element.tag, str):
            continue
        for attribute in ("href", "src", "srcset", "action"):
            if element.get(attribute):
                element.set(attribute, localize_internal(element.get(attribute), route, locale, attribute))

    for stylesheet in document.xpath('//link[@rel="stylesheet" and contains(@href,"styles.css")]'):
        stylesheet.set("href", f"/assets/css/styles.css?v={LOCALIZED_STYLE_VERSION}")

    canonical = document.xpath('//link[@rel="canonical"]')
    if canonical:
        canonical[0].set("href", public_url(route, locale))
    for meta in document.xpath('//meta[@property="og:url"]'):
        meta.set("content", public_url(route, locale))
    og_locale = document.xpath('//meta[@property="og:locale"]')
    if og_locale:
        og_locale[0].set("content", LOCALES[locale]["og_locale"])
    else:
        head = document.find("head")
        element = etree.Element("meta", {"property": "og:locale", "content": LOCALES[locale]["og_locale"]})
        head.append(element)

    body = document.find("body")
    classes = set((body.get("class") or "").split())
    classes.discard("localized-page")
    classes.add("localized-parity")
    body.set("class", " ".join(sorted(classes)))

    replace_images(document, locale, source)
    for image in document.xpath('//img[contains(@class,"store-badge")]'):
        image.set("src", "/assets/images/app-store/" + LOCALES[locale]["store_badge"])
    add_language_menu(document, locale, route)
    add_hreflang(document, route)
    add_localized_nav_script(document)

    output = ROOT / locale / source
    if locale == "de" and source == "nurse/healthcarestaffdiscount/index.html":
        return
    output.parent.mkdir(parents=True, exist_ok=True)
    rendered = html.tostring(document, encoding="unicode", pretty_print=True, doctype="<!DOCTYPE html>")
    output.write_text(rendered)


def build_sitemap() -> None:
    languages = [("en", None), *[(config["hreflang"], locale) for locale, config in LOCALES.items()]]
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ]
    for source in SOURCE_PAGES:
        route = page_route(source)
        for _, page_locale in languages:
            lines.append("  <url>")
            lines.append(f"    <loc>{xml_escape(public_url(route, page_locale))}</loc>")
            lines.append("    <lastmod>2026-08-19</lastmod>")
            for hreflang, alternate_locale in languages:
                lines.append(
                    '    <xhtml:link rel="alternate" '
                    f'hreflang="{hreflang}" href="{xml_escape(public_url(route, alternate_locale))}" />'
                )
            lines.append(
                '    <xhtml:link rel="alternate" hreflang="x-default" '
                f'href="{xml_escape(public_url(route))}" />'
            )
            lines.append("  </url>")
    lines.append("</urlset>")
    (ROOT / "sitemap.xml").write_text("\n".join(lines) + "\n")


def main() -> None:
    values = collect_values()
    cache = json.loads(CACHE_PATH.read_text()) if CACHE_PATH.exists() else {}
    print(f"Collected {len(values)} source strings")
    for locale in LOCALES:
        translations = translate_values(values, locale, cache)
        translations["__locale__"] = locale
        for source in SOURCE_PAGES:
            localize_page(source, locale, translations)
        print(f"{locale}: built {len(SOURCE_PAGES)} localized routes")
    build_sitemap()
    print(f"sitemap: built {len(SOURCE_PAGES) * (len(LOCALES) + 1)} URLs")


if __name__ == "__main__":
    main()
