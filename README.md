# Restlos

Restlos ist eine mobile App zur Verwaltung des eigenen Lebensmittelvorrats. Sie beantwortet die Frage: **Was sollte ich als Nächstes aufbrauchen?**

Semesterprojekt im Modul Mobile App Development (FH Graubünden, HS26). Einzelarbeit von Davide Rizzo.

## Inhalt

1. [Problem und Zielgruppe](#problem-und-zielgruppe)
2. [Funktionen](#funktionen)
3. [Screenshots](#screenshots)
4. [Demo-Video](#demo-video)
5. [Setup](#setup)
6. [Scripts](#scripts)
7. [Architektur](#architektur)
8. [Annahmen und Grenzen](#annahmen-und-grenzen)
9. [Bekannte Issues](#bekannte-issues)
10. [GUI-Entwurf](#gui-entwurf)
11. [Verantwortlichkeiten und Hilfsmittel](#verantwortlichkeiten-und-hilfsmittel)

## Problem und Zielgruppe

Studierende mit eigenem Haushalt kaufen regelmässig Lebensmittel ein, verlieren aber im Alltag den Überblick über den Vorrat. Produkte geraten in Vergessenheit, bis das Mindesthaltbarkeitsdatum (MHD) überschritten ist.

Die App richtet sich an Studierende in einer WG oder eigenen Wohnung, die selbstständig einkaufen und kochen und wenig Zeit für eine aufwendige Vorratsverwaltung haben.

## Funktionen

| Ansicht | Funktion |
|---|---|
| **Übersicht** | Zeigt Produkte, deren MHD überschritten ist oder in den nächsten drei Tagen liegt. |
| **Vorrat** | Alle Lebensmittel, nach MHD sortiert, mit Suche nach Namen und Filter nach Lagerort. |
| **Erfassen / Bearbeiten** | Formular mit Prüfung der Eingaben direkt am Feld und optionalem Foto aus der Galerie. |
| **Produktdetails** | Angaben zum Produkt mit den Aktionen «Aufgebraucht», «Bearbeiten» und «Löschen». |

Weitere Punkte:

- Die Daten werden mit AsyncStorage lokal auf dem Gerät gespeichert und beim Start geladen.
- «Aufgebraucht» lässt sich während acht Sekunden rückgängig machen.
- «Löschen» verlangt eine Bestätigung.
- Lade-, Fehler- und Leerzustände sind in allen Ansichten berücksichtigt.

### Hauptablauf

1. Übersicht öffnen und «Lebensmittel erfassen» wählen.
2. Formular ausfüllen und speichern. Die App zeigt die Produktdetails.
3. Zurück zur Übersicht, in den Tab «Vorrat» wechseln und ein Produkt öffnen.
4. «Aufgebraucht» wählen. Das Produkt verschwindet aus dem Vorrat und lässt sich kurz wiederherstellen.

## Screenshots

| Übersicht | Vorrat | Erfassen | Details |
|---|---|---|---|
| ![Übersicht](docs/screenshots/01-uebersicht.png) | ![Vorrat](docs/screenshots/02-vorrat.png) | ![Erfassen](docs/screenshots/03-erfassen.png) | ![Details](docs/screenshots/04-details.png) |

## Demo-Video

[Restlos_Demo.mov](docs/Video/Restlos_Demo.mov) (3:55 Min.)

## Setup

Voraussetzungen: Node.js (LTS) und die App Expo Go auf dem Smartphone oder ein iOS-/Android-Simulator.

```bash
git clone https://github.com/davide-rizzo-fhgr/Mobileapp_development.git
cd Mobileapp_development/restlos
npm install
npx expo start
```

Danach den QR-Code mit Expo Go scannen oder im Terminal `i` (iOS-Simulator) beziehungsweise `a` (Android-Emulator) drücken.

## Scripts

Alle Befehle werden im Ordner `restlos` ausgeführt.

| Befehl | Zweck |
|---|---|
| `npm start` | Startet den Expo-Entwicklungsserver. |
| `npm run ios` / `npm run android` | Startet die App direkt im Simulator beziehungsweise Emulator. |
| `npm run web` | Startet die App im Browser (nur zur Kontrolle, siehe bekannte Issues). |
| `npm run lint` | Prüft den Code mit ESLint. |
| `npx tsc --noEmit` | Prüft die Typen mit TypeScript. |

## Architektur

### Architektur-Skizze

```mermaid
flowchart LR
  subgraph Screens["app/ (Screens)"]
    U["Übersicht"]
    V["Vorrat"]
    E["Erfassen / Bearbeiten"]
    D["Produktdetails"]
  end
  K["components/<br/>ProductCard, ProductForm,<br/>FormField, ChipGroup, …"]
  C["context/ProductContext<br/>products, loadingState,<br/>saveProduct, consumeProduct,<br/>deleteProduct, undoConsume"]
  S["storage/productStorage<br/>loadProducts, saveProducts"]
  A[("AsyncStorage")]
  T["utils/<br/>Datum, Sortierung,<br/>Formularprüfung"]

  Screens -- "Props" --> K
  K -- "Callbacks" --> Screens
  Screens -- "useProducts()" --> C
  C --> S
  S --> A
  Screens --> T
  K --> T
```

### Navigation

```mermaid
flowchart TD
  R["Stack (app/_layout.tsx)"] --> Tabs["Tabs (app/(tabs)/_layout.tsx)"]
  Tabs --> U["Übersicht"]
  Tabs --> V["Vorrat"]
  U -- "push" --> E["Erfassen"]
  V -- "push" --> E
  U -- "push" --> D["Produktdetails"]
  V -- "push" --> D
  E -- "replace nach Speichern" --> D
  D -- "push" --> B["Bearbeiten"]
  B -- "back" --> D
  D -- "back" --> Tabs
```

### Ordnerstruktur

```text
restlos/src
├── app/                      Screens und Navigation (Expo Router)
│   ├── _layout.tsx           Stack + ProductProvider
│   ├── (tabs)/_layout.tsx    Untere Navigation
│   ├── (tabs)/index.tsx      Übersicht
│   ├── (tabs)/vorrat.tsx     Vorrat
│   ├── erfassen.tsx          Erfassen / Bearbeiten
│   └── produktdetails.tsx    Produktdetails
├── components/               Wiederverwendbare UI-Bausteine
├── context/ProductContext    Gemeinsamer State: Produkte, Ladezustand, Aktionen
├── storage/productStorage    Lesen und Schreiben mit AsyncStorage
├── utils/                    Datumsfunktionen, Sortierung, Formularprüfung
├── types/Product.ts          Datenmodell
└── constants/colors.ts       Farben
```

### State-Konzept

| State | Besitzer | Begründung |
|---|---|---|
| Produktliste, Ladezustand, Fehlermeldung, zuletzt aufgebrauchtes Produkt | `ProductProvider` | Wird von allen vier Ansichten gebraucht. |
| Suchtext und Lagerort-Filter | Screen «Vorrat» | Reiner UI-State dieser Ansicht. |
| Formulareingaben und besuchte Felder | `ProductForm` | Der Screen erhält erst das geprüfte Produkt über `onSave`. |
| Gefilterte und sortierte Listen, Formularfehler | kein State | Abgeleitete Werte, werden bei jedem Render berechnet. |

- **Trennung von UI und Logik:** Speichern (`storage`), Prüfen und Rechnen (`utils`) und Darstellung (`components`) liegen in getrennten Dateien. Die Komponenten erhalten Daten über Props und melden Ereignisse über Callbacks.
- **Laden und Speichern:** Der Provider lädt beim Start einmal aus AsyncStorage. Gespeichert wird in den Aktionen und erst, nachdem geladen wurde, damit eine leere Liste nie den Vorrat überschreibt.
- **Fehlerbehandlung:** Der Storage Layer unterscheidet Lesefehler, beschädigtes JSON und falsche Struktur und meldet sie verständlich. Die Ansichten zeigen die Meldung mit «Erneut versuchen».

## Annahmen und Grenzen

- Die App funktioniert offline und speichert nur auf dem jeweiligen Gerät. Login, Cloud-Synchronisation, Barcode-Scanner und Rezeptvorschläge sind nicht Teil dieser Version.
- Das MHD dient zur Orientierung. Die App beurteilt nicht, ob ein Lebensmittel noch geniessbar ist.
- «Bald aufbrauchen» bedeutet: MHD überschritten oder in höchstens drei Tagen erreicht.
- Ein neu eingegebenes MHD darf höchstens einen Monat zurückliegen und höchstens zehn Jahre in der Zukunft liegen. Damit werden Tippfehler abgefangen. Ein bereits gespeichertes älteres MHD bleibt beim Bearbeiten gültig.
- Die Menge ist eine positive Zahl. Komma und Punkt werden als Dezimaltrennzeichen akzeptiert.
- Das Datum wird als Text im Format `TT.MM.JJJJ` eingegeben.

## Bekannte Issues

- Im Browser (`npm run web`) erscheint die Löschbestätigung nicht, weil `Alert` dort nicht unterstützt wird. Die App ist für iOS und Android gedacht.
- Sind die gespeicherten Daten beschädigt, zeigt die App eine Fehlermeldung mit «Erneut versuchen». Ein Zurücksetzen des Speichers in der App gibt es nicht. Einzelne ungültige Einträge werden beim Laden übersprungen.
- Ersetzte oder entfernte Fotos bleiben als Datei im App-Ordner liegen.
- «Rückgängig» gibt es nur für «Aufgebraucht», nicht für «Löschen».
- App-Icon und Startbildschirm sind noch die Standardbilder von Expo. Die App unterstützt nur den hellen Modus.
- Es gibt keine automatisierten Tests.

## GUI-Entwurf

Der Entwurf wurde in Figma erstellt: [Figma-Prototyp](https://www.figma.com/proto/etExXKJu7YXEuGe7R39ObV/Restlos_Figma?node-id=14-6&p=f&t=cBrfW0xAYGfpifem-1&scaling=min-zoom&content-scaling=fixed&page-id=2%3A3&starting-point-node-id=14%3A6)

Abweichungen vom Entwurf: Die Schwelle für «Bald aufbrauchen» und die Ein-Monats-Regel für das MHD sind unter «Annahmen und Grenzen» beschrieben.

## Verantwortlichkeiten und Hilfsmittel

- Konzept, Figma-Entwurf, Umsetzung und Tests: Davide Rizzo (Einzelarbeit).
- Grundlage für den Code sind die Folien und Übungen des Moduls (Todo-App, AsyncStorage, Context).
- Für Code-Review und Codevorschläge wurde ein KI-Assistent (Claude) eingesetzt.
