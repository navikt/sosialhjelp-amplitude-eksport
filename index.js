import fetch from "node-fetch";
import "dotenv/config";
import fs from "fs";

const amplitudeIds = [];


const userActivityUrl = "https://reops-proxy.intern.nav.no/amplitude/api/2/useractivity?user=";


async function getAllUsers() {
  const csvHeader =
    "amplitudeId,veileder_lang_tid,sosialtjeneste_flaks,veileder_riktig_mange_kanaler,veileder_antall,veileder_riktig,veileder_service,sosialtjeneste_rettferdig,sprak,veileder_initiativ,veileder_snakker,veileder_kontakt,veileder_respekt,veileder_tillit,mange_kanaler,meldingstjeneste_service,meldingstjeneste_kontakt, meldingstjeneste_rettferdig, meldingstjeneste_bryr_seg,event_time\n";

  let csv = csvHeader;

  for (const amplitudeId of amplitudeIds) {
    console.log("amplitudeId", amplitudeId);
    await fetch(`${userActivityUrl}${amplitudeId}`)
      .then((response) => response.json())
      .then((json) => {
        json.events
          .filter(
            (event) => event.event_type === "Dialog bruker: Spørreundersøkelse"
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
              event.event_properties.meldingstjeneste_service ?? ""
            },${event.event_properties.meldingstjeneste_kontakt ?? ""},${
              event.event_properties.meldingstjeneste_rettferdig ?? ""
            },${event.event_properties.meldingstjenesten_bryr_seg ?? ""},${
              event.event_properties.versjon ?? "1"
            },${event.event_time ?? ""}\n`;
            csv = csv + csvLine;
            console.log(csvLine);
          });
      });
  }

  try {
    fs.writeFileSync(
      `amplitude_dialog_bruker_${new Date().toISOString()}.csv`,
      csv
    );
  } catch (err) {
    console.error(":(");
  }
}

getAllUsers();
