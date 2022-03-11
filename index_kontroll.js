import fetch from "node-fetch";
import "dotenv/config";
import fs from "fs";

const amplitudeIds = [];

const userActivityUrl = "https://amplitude.com/api/2/useractivity?user=";

const API_KEY = process.env.API_KEY;
const SECRET_KEY = process.env.SECRET_KEY;

const buff = Buffer.from(`${API_KEY}:${SECRET_KEY}`, "utf-8");
const base64 = buff.toString("base64");

async function getAllUsers() {
  const csvHeader =
    "amplitudeId,veileder_lang_tid,sosialtjeneste_flaks,veileder_riktig_mange_kanaler,veileder_antall,veileder_riktig,veileder_service,sosialtjeneste_rettferdig,sprak,veileder_initiativ,veileder_snakker,veileder_kontakt,veileder_respekt,veileder_tillit,mange_kanaler,event_time\n";

  let csv = csvHeader;

  for (const amplitudeId of amplitudeIds) {
    console.log("amplitudeId", amplitudeId);
    await fetch(`${userActivityUrl}${amplitudeId}`, {
      headers: {
        Authorization: "Basic " + base64,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        json.events
          .filter(
            (event) =>
              event.event_type ===
              "Dialog bruker: Spørreundersøkelse (Kontrollgruppe)"
          )
          .forEach((event) => {
            const csvLine = `${amplitudeId},${
              event.event_properties.veileder_lang_tid ?? ""
            },${event.event_properties.sosialtjeneste_flaks ?? ""},${
              event.event_properties.veileder_riktig_mange_kanaler ?? ""
            },${event.event_properties.veileder_antall ?? ""},${
              event.event_properties.veileder_riktig ?? ""
            },${event.event_properties.veileder_service ?? ""},${
              event.event_properties.sosialtjeneste_rettferdig ?? ""
            },${event.event_properties.sprak ?? ""},${
              event.event_properties.veileder_initiativ ?? ""
            },${event.event_properties.veileder_snakker ?? ""},${
              event.event_properties.veileder_kontakt ?? ""
            },${event.event_properties.veileder_respekt ?? ""},${
              event.event_properties.veileder_tillit ?? ""
            },${event.event_properties.mange_kanaler ?? ""},${
              event.event_time ?? ""
            }\n`;
            csv = csv + csvLine;
            console.log(csvLine);
          });
      });
  }

  try {
    fs.writeFileSync(
      `amplitude_dialog_bruker_kontroll_${new Date().toISOString()}.csv`,
      csv
    );
  } catch (err) {
    console.error(":(");
  }
}

getAllUsers();
