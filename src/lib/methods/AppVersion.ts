import { fetchText } from "../gate/Util"
import { SOUNDCLOUD_URL } from "../gate/Constants"

export default async function SCAppVersion() {
    const data = await fetchText(`${SOUNDCLOUD_URL}/versions.json`);
    const json = JSON.parse(data);
    if (json.app) {
        return json.app;
    }
    return "NOT_FOUND";
}

(async () => {
    console.log(await SCAppVersion());
})();
