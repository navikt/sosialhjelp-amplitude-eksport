NB: Repoet er arkivert da vi ikke lenger har aktiv dialogtjeneste og spørreundersøkelse

# Eksport av data fra spørreundersøkelse i Amplitude

Dette er et repo med kode for automatisk eksport av user-events for spørreundersøkelse gjort i Amplitude.

Koden henter user-events for en serie med `amplitudeId`. Denne finner du ved å gjøre en spørring i Amplitude på eventet, og eksportere csv med users (trykk på et tidspunkt i grafen -> Click to inspect -> Download Users). `amplitudeId` fra CSV kan så kopieres inn i arrayet `amplitudeIds` i koden.

Du må også ha en API_KEY og en SECRET_KEY som du legger inn i en `.env`-fil. Kontakt ansvarlige for Amplitude i NAV for å få tak i disse.

Dataene blir eksportert til en egen kommaseparert fil (csv).

Koden kjøres med `node index.js` for spørreundersøkelsen og `node index_kontroll.js` for kontrollgruppen.

