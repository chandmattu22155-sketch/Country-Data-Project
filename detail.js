const cardGrid = document.getElementById("card-grid");
const searchInput = document.getElementById("search-input");
const showingCount = document.getElementById("showing-count");
const showingCountMobile = document.getElementById("showing-count-mobile"); 
const loader = document.getElementById("loader");

const BASE_URL = "https://restcountries.com/v3.1/all?fields=name,flags,capital,cca3,population,area,region";

const MAX_POPULATION = 340_000_000;
const MAX_AREA = 10_000_000;

let allCountriesData = [];
let searchQuery = "";

function formatNumber(num) {
    if (!num) return "0";
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(0) + "K";
    return num;
}

async function initApp() {
    try {
        if (loader) loader.classList.remove("hidden");
        const response = await fetch(BASE_URL);
        allCountriesData = await response.json();
        displayCountries(allCountriesData);
    } catch (error) {
        console.error("Fetch Error:", error);
    } finally {
        if (loader) loader.classList.add("hidden");
    }
}

function displayCountries(data) {
    if (!cardGrid) return;
    cardGrid.innerHTML = "";
    
    if (showingCount) showingCount.textContent = data.length;
    if (showingCountMobile) showingCountMobile.textContent = data.length;

    if (!data || data.length === 0) {
        cardGrid.innerHTML = `<p class="text-center py-10 text-black font-semibold text-xl">No record found</p>`;
        return;
    }
    cardGrid.innerHTML = data.map(createCountryCard).join("");
}

function handleCountryClick(code) {
    if (loader) loader.classList.remove("hidden");
    setTimeout(() => {
        window.location.href = `country.html?code=${code}&from=detail`;
    }, 1000);
}

function createCountryCard(c) {
    const popProgress = Math.min((c.population / MAX_POPULATION) * 100, 100);
    const areaProgress = Math.min((c.area / MAX_AREA) * 100, 100);
    const capital = c.capital && c.capital.length ? c.capital[0] : "N/A";

    return `
    <div onclick="handleCountryClick('${c.cca3}')"
         class="flex flex-col md:grid md:grid-cols-12 items-center bg-white p-6 md:p-10 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer gap-4 md:gap-0">
        
        <div class="flex items-center justify-between w-full md:col-span-1">
            <img src="${c.flags.png}" class="h-10 w-14 object-cover rounded shadow-sm border border-gray-100">
            <span class="md:hidden text-xs bg-sky-400 px-2 py-1 rounded font-bold text-white uppercase">${c.cca3}</span>
        </div>

        <div class="w-full md:col-span-3 text-center md:text-left">
            <h3 class="font-semibold text-gray-900 text-xl leading-tight">${c.name.common}</h3>
            <p class="text-xs font-semibold text-gray-700">${capital}</p>
        </div>

        <div class="hidden md:block md:col-span-1">
            <span class="text-xs bg-sky-400 px-2 py-2 rounded font-bold text-white uppercase">${c.cca3}</span>
        </div>

        <div class="w-full md:col-span-3 md:pr-8">
            <div class="flex justify-between text-xs font-bold mb-1">
                <span class="text-gray-500 md:text-black">POPULATION</span>
                <span>${formatNumber(c.population)}</span>
            </div>
            <div class="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div class="bg-blue-600 h-full" style="width:${popProgress}%"></div>
            </div>
        </div>

        <div class="w-full md:col-span-4">
            <div class="flex justify-between text-xs font-bold mb-1">
                <span class="text-gray-500 md:text-black">AREA</span>
                <span>${formatNumber(c.area)} km²</span>
            </div>
            <div class="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div class="bg-yellow-500 h-full" style="width:${areaProgress}%"></div>
            </div>
        </div>
    </div>`;
}

function applyFilters() {
    let filtered = allCountriesData;
    if (searchQuery) {
        filtered = filtered.filter(c => {
            const name = c.name.common.toLowerCase();
            const capital = c.capital?.[0]?.toLowerCase() || "";
            const code = c.cca3.toLowerCase();
            return name.includes(searchQuery) || capital.includes(searchQuery) || code.includes(searchQuery);
        });
    }
    displayCountries(filtered);
}

if (searchInput) {
    let timer;
    searchInput.addEventListener("input", () => {
        clearTimeout(timer);
        searchQuery = searchInput.value.toLowerCase().trim();
        timer = setTimeout(() => applyFilters(), 300);
    });
}

initApp();