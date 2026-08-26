#!/usr/bin/env python3
"""Apply reviewed terminology corrections after localized page generation."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]

REPLACEMENTS = {
    "es": {
        "Administre múltiples lugares de trabajo sin mezclar los detalles": "Gestiona varios lugares de trabajo sin mezclar la información",
        "Cree un perfil para cada contexto laboral significativo": "Crea un perfil para cada trabajo",
        "Utilice un calendario para encontrar conflictos": "Usa un calendario para detectar coincidencias",
        "Mantenga las tarifas separadas": "Mantén separada la configuración de ingresos",
        "Hacer comprensibles las exportaciones": "Crea informes fáciles de revisar",
        "Revisar los cambios en la fuente": "Comprueba los cambios en el horario oficial",
        "Lista de verificación de planificación del turno de noche para cambios de horarios": "Lista de comprobación para planificar turnos nocturnos",
        "Mantenga explícitas las tareas diurnas y nocturnas": "Diferencia siempre los turnos de día y de noche",
        "Separar registros relacionados": "Separa los registros relacionados",
        "Construir rotaciones a partir de una fecha confirmada": "Crea rotaciones desde una fecha confirmada",
        "Revisar la semana y el mes.": "Revisa la semana y el mes",
        "Trate el salario como una estimación": "Usa el cálculo de ingresos como una estimación",
        "Calculadora gratuita de pago por turnos: horas, horas extras y diferenciales": "Calculadora gratuita de ingresos por turnos: horas, horas extra y pluses",
        "Patrones de rotación de turnos: 2-2-3, 4-On/4-Off y más": "Patrones de turnos rotativos: 2-2-3, 4 días de trabajo/4 de descanso y más",
        "Dos adentro, dos afuera, tres encendidos": "2 días de trabajo, 2 de descanso y 3 de trabajo",
        "Cambios de horario de turno": "Cambios entre turnos de día y de noche",
        "Secuencia específica del empleador": "Ciclo propio del lugar de trabajo",
        "Qué comparar entre rotaciones": "Qué debes comparar entre rotaciones",
        "rotaciones de 4 encendidos y 4 apagados": "rotaciones de 4 días de trabajo y 4 de descanso",
        "4 encendidos/4 apagados": "4 días de trabajo/4 de descanso",
        "diferenciales nocturnos y de fin de semana": "pluses nocturnos y de fin de semana",
        "diferencial nocturno o de fin de semana": "plus nocturno o de fin de semana",
        "diferenciales": "pluses",
        "diferencial": "plus",
        "trabajo entre medianoche": "turnos que cruzan la medianoche",
        "fechas, recordatorios, ubicaciones, horarios y pluses entre medianoche": "fechas, recordatorios, lugares, horas y pluses de los turnos nocturnos",
    },
    "fr": {
        "Gérez plusieurs lieux de travail sans mélanger les détails": "Gérez plusieurs lieux de travail sans mélanger les informations",
        "Créez un profil pour chaque contexte de travail significatif": "Créez un profil pour chaque emploi",
        "Utilisez un calendrier pour rechercher les conflits": "Utilisez un calendrier pour repérer les chevauchements",
        "Gardez les tarifs séparés": "Séparez les paramètres de rémunération",
        "Rendre les exportations compréhensibles": "Créez des rapports faciles à relire",
        "Examiner les modifications à la source": "Vérifiez les changements dans le planning officiel",
        "Liste de contrôle de planification des gardes de nuit pour les changements d'horaires": "Checklist pour organiser les gardes de nuit",
        "Comment planifier un horaire de travail d'infirmière de 12 heures": "Comment organiser un planning infirmier en gardes de 12 heures",
        "Gardez les tâches de jour et de nuit explicites": "Distinguez clairement les gardes de jour et de nuit",
        "Séparer les enregistrements associés": "Séparez les éléments associés",
        "Construire des rotations à partir d’une date confirmée": "Créez les rotations à partir d’une date confirmée",
        "Revoir la semaine et le mois": "Vérifiez la semaine et le mois",
        "Calculateur de paie gratuit : heures, heures supplémentaires et différentiels": "Calculateur de salaire gratuit : heures, heures supplémentaires et primes",
        "Calculateur de revenu par poste": "Calculateur de salaire par garde",
        "Modèles de rotation des changements de vitesse : 2-2-3, 4-On/4-Off et plus": "Schémas de rotation : 2-2-3, 4 jours travaillés/4 jours de repos et plus",
        "Modèles courants de rotation des horaires": "Rotations de travail courantes",
        "Deux allumés, deux éteints, trois allumés": "2 jours travaillés, 2 jours de repos, puis 3 jours travaillés",
        "Modifications des horaires de travail": "Alternance entre gardes de jour et de nuit",
        "Séquence spécifique à l'employeur": "Cycle propre à l’établissement",
        "Comment choisir une configuration de planificateur": "Comment configurer votre planning",
        "Modèles de rotation des changements de vitesse : 2-2-3, 4-On/4-Off et plus": "Schémas de rotation : 2-2-3, 4 jours travaillés/4 jours de repos et plus",
        "différentiels de nuit et de week-end": "majorations de nuit et de week-end",
        "différentiels": "majorations",
        "différentiel": "majoration",
        "travail de minuit": "travail de nuit qui traverse minuit",
    },
    "de": {
        "Verwalten Sie mehrere Arbeitsplätze, ohne die Details zu vermischen": "Mehrere Arbeitsplätze verwalten, ohne Angaben zu vermischen",
        "Erstellen Sie ein Profil für jeden sinnvollen Arbeitskontext": "Erstellen Sie für jeden Arbeitsplatz ein eigenes Profil",
        "Verwenden Sie einen Kalender, um Konflikte zu finden": "Nutzen Sie einen Kalender, um Überschneidungen zu erkennen",
        "Halten Sie die Tarife getrennt": "Trennen Sie die Vergütungseinstellungen",
        "Machen Sie Exporte verständlich": "Erstellen Sie gut lesbare Berichte",
        "Überprüfen Sie Änderungen an der Quelle": "Prüfen Sie Änderungen im offiziellen Dienstplan",
        "Checkliste für die Nachtschichtplanung bei geänderten Zeitplänen": "Checkliste für die Planung von Nachtschichten",
        "Eine sieben Punkte umfassende Checkliste für die Nachtschicht": "Sieben Punkte vor einer Nachtschicht",
        "Halten Sie die Aufgaben für Tag und Nacht klar definiert": "Kennzeichnen Sie Tag- und Nachtdienste eindeutig",
        "Trennen Sie verwandte Datensätze": "Trennen Sie zusammengehörige Einträge",
        "Behandeln Sie das Gehalt als Schätzung": "Betrachten Sie den Verdienst als Schätzung",
        "Kostenloser Schichtlohnrechner: Stunden, Überstunden und Differenzen": "Kostenloser Schichtlohnrechner: Arbeitszeit, Überstunden und Zuschläge",
        "Schaltrotationsmuster: 2-2-3, 4-Ein/4-Aus und mehr": "Schichtmodelle: 2-2-3, 4 Tage Arbeit/4 Tage frei und mehr",
        "Gängige Muster für Schichtrotationen": "Gängige Schichtmodelle",
        "Zwei an, zwei aus, drei an": "2 Tage Arbeit, 2 Tage frei, 3 Tage Arbeit",
        "Schichtzeitänderungen": "Wechsel zwischen Tag- und Nachtschicht",
        "Arbeitgeberspezifische Reihenfolge": "Betriebsspezifischer Schichtrhythmus",
        "So wählen Sie ein Planer-Setup aus": "So richten Sie den Planer passend ein",
        "Was ist zwischen Rotationen zu vergleichen?": "Was Sie bei Schichtmodellen vergleichen sollten",
        "4-Ein/4-Aus": "4 Tage Arbeit/4 Tage frei",
        "Differenziale": "Zuschläge",
        "Differenzen": "Zuschläge",
        "Differenz": "Zuschlag",
        "Basiszinssatz": "Grundlohn",
        "Übernachtarbeit": "Arbeit über Mitternacht",
        "Schaltführungen": "Ratgeber",
    },
    "pt-br": {
        "Gerencie vários locais de trabalho sem misturar os detalhes": "Gerencie vários locais de trabalho sem misturar as informações",
        "Crie um perfil para cada contexto de trabalho significativo": "Crie um perfil para cada trabalho",
        "Use um calendário para encontrar conflitos": "Use um calendário para identificar sobreposições",
        "Mantenha as taxas separadas": "Separe as configurações de ganhos",
        "Torne as exportações compreensíveis": "Crie relatórios fáceis de revisar",
        "Revise as alterações na origem": "Confira as mudanças na escala oficial",
        "Lista de verificação de planejamento do turno noturno para alteração de horários": "Checklist para planejar plantões noturnos",
        "Uma lista de verificação do turno noturno de sete pontos": "Sete pontos para conferir antes de um plantão noturno",
        "Mantenha as atribuições diurnas e noturnas explícitas": "Diferencie claramente os plantões diurnos e noturnos",
        "Separar registros relacionados": "Separe os registros relacionados",
        "Calculadora de pagamento por turno grátis: horas, horas extras e diferenciais": "Calculadora gratuita de ganhos por turno: horas, horas extras e adicionais",
        "Insira seus horários e taxas planejados": "Informe as horas e os valores previstos",
        "Padrões de rotação de turno: 2-2-3, 4 ligado/4 desligado e mais": "Padrões de turnos: 2-2-3, 4 dias de trabalho/4 de folga e mais",
        "Dois ligados, dois desligados, três ligados": "2 dias de trabalho, 2 de folga e 3 de trabalho",
        "Mudanças de horário de turno": "Alternância entre turnos diurnos e noturnos",
        "Sequência específica do empregador": "Ciclo próprio do local de trabalho",
        "Como escolher uma configuração de planejador": "Como configurar seu planner",
        "4 ligado/4 desligado": "4 dias de trabalho/4 de folga",
        "4 ligados/4 desligados": "4 dias de trabalho/4 de folga",
        "diferencial noturno ou final de semana": "adicional noturno ou de fim de semana",
        "diferenciais": "adicionais",
        "diferencial": "adicional",
    },
    "ja": {
        "スケジュール変更のための夜勤計画チェックリスト": "夜勤を計画するためのチェックリスト",
        "12 時間の看護師シフト スケジュールを計画する方法": "看護師の12時間シフトを計画する方法",
        "フリーシフト給与計算ツール: 時間、残業、差額": "無料のシフト給与計算：勤務時間・残業・手当",
        "同じ営業日": "同じ勤務日",
        "2 オン、2 オフ、3 オン": "2日勤務・2日休み・3日勤務",
        "労働日4日、休日4日": "4日勤務・4日休み",
        "シフト時間変更": "日勤と夜勤の切り替え",
        "雇用主固有の順序": "職場独自の勤務サイクル",
        "差額": "手当",
        "月1か月分": "1か月分",
    },
}


def main() -> None:
    for locale, replacements in REPLACEMENTS.items():
        for path in sorted((ROOT / locale).glob("**/*.html")):
            text = path.read_text(encoding="utf-8")
            updated = text
            for source, replacement in replacements.items():
                updated = updated.replace(source, replacement)
            if updated != text:
                path.write_text(updated, encoding="utf-8")


if __name__ == "__main__":
    main()
