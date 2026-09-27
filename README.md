# Restlos

## Problem

Studierende mit eigenem Haushalt kaufen regelmässig Lebensmittel ein, verlieren aber im Alltag den Überblick über den eigenen Vorrat. Produkte geraten in Vergessenheit, bis das Mindesthaltbarkeitsdatum bereits überschritten ist.

Die zentrale Frage lautet:

Was sollte ich als Nächstes aufbrauchen?

## Zielgruppe

Studierende mit eigenem Haushalt, in einer WG oder eigenen Wohnung, die selbstständig einkaufen und kochen. Sie haben ihr Smartphone griffbereit, aber wenig Zeit und Geduld für eine aufwendige Verwaltung ihres Vorrats.

## Nutzen

Restlos soll einen schnellen, verlässlichen Überblick über den vorhandenen Vorrat schaffen und zeigen, welche Produkte als Nächstes aufgebraucht werden sollten.

Damit soll die App helfen, vergessene Lebensmittel und unnötige Lebensmittelverschwendung zu reduzieren, ohne Barcode-Scanning, Login oder Cloud-Synchronisation.

## Geplanter Funktionsumfang

Die erste Version soll vollständig offline mit lokaler Datenspeicherung auf dem Gerät funktionieren.

### Die vier Hauptansichten

| Ansicht | Funktion |
|---|---|
| **Übersicht** | Zeigt Produkte, deren Mindesthaltbarkeitsdatum bald erreicht oder bereits überschritten ist. |
| **Vorrat** | Durchsuchbare und filterbare Liste der erfassten Lebensmittel. |
| **Erfassen / Bearbeiten** | Formular zum Anlegen und Ändern von Lebensmitteln. |
| **Produktdetails** | Produktinformationen mit den Aktionen «Aufgebraucht», «Bearbeiten» und «Löschen». |

### Abgrenzung

Nicht Teil dieser Version sind:

- Login und Benutzerkonten.
- Cloud-Synchronisation.
- Barcode-Scanner.
- Automatische Rezeptvorschläge.

Das Mindesthaltbarkeitsdatum dient zur Orientierung. Die App beurteilt nicht, ob ein Lebensmittel noch geniessbar ist.

## User-Flow

### Hauptablauf (Happy Path)

1. Übersicht öffnen.
2. «Lebensmittel erfassen» auswählen.
3. Formular ausfüllen.
4. Lebensmittel speichern.
5. Produktdetails ansehen.
6. Zum Vorrat wechseln.
7. Ein Produkt öffnen.
8. Als «Aufgebraucht» markieren.
9. Aktualisierten Vorrat sehen.

## GUI-Entwurf und Prototyp

Der GUI-Entwurf wird in Figma erstellt und zeigt den geplanten Aufbau sowie die Navigation der Anwendung.

**Figma-Link:** https://www.figma.com/proto/etExXKJu7YXEuGe7R39ObV/Restlos_Figma?node-id=14-6&p=f&t=cBrfW0xAYGfpifem-1&scaling=min-zoom&content-scaling=fixed&page-id=2%3A3&starting-point-node-id=14%3A6

### Simulierte Interaktionen

Der Figma-Prototyp dient zur Demonstration des Designs und des Bedienablaufs. Folgende Interaktionen sind simuliert:

- **Speichern:** Schreibt keine echten Daten, sondern navigiert zur vordefinierten Zielansicht.
- **Löschbestätigung:** Ist eine statische Ansicht ohne tatsächliche Löschlogik.
- **Rückgängig:** Stellt nach «Aufgebraucht» keinen echten vorherigen Zustand wieder her.
- **Suche und Filter:** Zeigen vordefinierte Beispielzustände anstelle einer dynamischen Filterung.

Die tatsächliche Datenverarbeitung und lokale Speicherung werden anschliessend in der React-Native-App umgesetzt.
