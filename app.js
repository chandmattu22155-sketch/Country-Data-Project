const globalGridSpan = document.querySelector("#global-grid span");
const flagImg = document.getElementById("flagImg");
const officialName = document.getElementById("officialName");
const nativeName = document.getElementById("nativeName");
const mapFrame = document.getElementById("mapFrame");
const coreOfficial = document.getElementById("coreOfficial");
const coreNative = document.getElementById("coreNative");
const coreCapital = document.getElementById("coreCapital");
const coreDemonym = document.getElementById("coreDemonym");
const coreIndependence = document.getElementById("coreIndependence");
const pop = document.getElementById("pop");
const density = document.getElementById("density");
const currency = document.getElementById("currency");
const language = document.getElementById("language");
const region = document.getElementById("region");
const subregion = document.getElementById("subregion");
const totalArea = document.getElementById("totalArea");
const landlocked = document.getElementById("landlocked");
const bordering = document.getElementById("bordering");
const alphaCodes = document.getElementById("alphaCodes");
const tld = document.getElementById("tld");
const callingCode = document.getElementById("callingCode");

const params = new URLSearchParams(window.location.search);
const from = params.get("from");
const backBtn = document.getElementById("backBtn");
if (from === "detail") {
  backBtn.href = "detail.html";
} else {
  backBtn.href = "index.html";
}


const urlParams = new URLSearchParams(window.location.search);
const countryCode = urlParams.get("code");
const API_URL = `https://restcountries.com/v3.1/alpha/${countryCode}`;




function formatNumber(num) {
    return num ? num.toLocaleString() : "N/A";
}

function getCurrency(country) {
    if (!country.currencies) return "N/A";

    const key = Object.keys(country.currencies)[0];
    const curr = country.currencies[key];

    return `${curr.name} (${key}${curr.symbol ? ", " + curr.symbol : ""})`;
}

function getLanguages(country) {
    if (!country.languages) return "N/A";
    return Object.values(country.languages).join(", ");
}

function getNativeName(country) {
    if (!country.name.nativeName) return "N/A";

    const firstLang = Object.keys(country.name.nativeName)[0];
    return country.name.nativeName[firstLang].official;
}




async function loadCountry() {
    try {

        const response = await fetch(API_URL);
        const data = await response.json();

        const country = data[0];

        console.log("Country Data:", country);

        flagImg.src = country.flags?.png || "";
        officialName.textContent = country.name?.official || "N/A";
        globalGridSpan.textContent = country.name?.common || "N/A";

        const native = getNativeName(country);

        nativeName.textContent = `${native} (${country.cca3 || ""})`;
        coreNative.textContent = native;

        mapFrame.src = `https://maps.google.com/maps?q=${country.latlng[0]},${country.latlng[1]}&z=5&output=embed`;

        coreOfficial.textContent = country.name?.official || "N/A";
        coreCapital.textContent = country.capital?.[0] || "N/A";
        coreDemonym.textContent = country.demonyms?.eng?.m || "N/A";

        coreIndependence.textContent =
            country.unMember ? "UN Member" : "Not UN Member";

        pop.textContent = formatNumber(country.population);

        totalArea.textContent =
            country.area ? `${formatNumber(country.area)} km²` : "N/A";

        density.textContent =
            country.population && country.area
                ? (country.population / country.area).toFixed(1)
                : "N/A";

        currency.textContent = getCurrency(country);
        language.textContent = getLanguages(country);

        region.textContent = country.region || "N/A";
        subregion.textContent = country.subregion || "N/A";

        landlocked.textContent = country.landlocked ? "Yes" : "No";

        bordering.textContent =
            country.borders?.join(" · ") || "Island Nation";

        alphaCodes.textContent =
            `${country.cca2 || ""} · ${country.cca3 || ""} · ${country.ccn3 || ""}`;

        tld.textContent = country.tld?.join(" · ") || "N/A";

        callingCode.textContent =
            country.idd?.root
                ? `${country.idd.root}${country.idd.suffixes?.[0] || ""}`
                : "N/A";



    } catch (error) {

        console.error("Error loading country:", error);

    }
}

loadCountry();
