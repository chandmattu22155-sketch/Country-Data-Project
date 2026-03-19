const countriesGrid = document.getElementById("countries-grid");
const regionToggle = document.getElementById("region-toggle");
const regionList = document.getElementById("region-list");
const regionIcon = document.getElementById("region-icon");
const loader = document.getElementById("loader");
const regionCheckboxes = document.querySelectorAll(".region-checkbox");
const searchInput = document.getElementById("search-input");
const showingCount = document.getElementById("showing-count");
const clearAllBtn = document.getElementById("clear-all");


const sidebar = document.getElementById("sidebar");
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const closeSidebar = document.getElementById("close-sidebar");
const overlay = document.getElementById("overlay");

const BASE_URL = "https://restcountries.com/v3.1/all?fields=name,flags,capital,cca3,population,area,region";
const MAX_POPULATION = 340_000_000;
const MAX_AREA = 10_000_000;

let allCountriesData = [];
let selectedRegions = [];
let searchQuery = "";

function toggleSidebar() {
    sidebar.classList.toggle("hidden-mobile");
    sidebar.classList.toggle("show-mobile");
    overlay.classList.toggle("hidden");
}

mobileMenuBtn.addEventListener("click", toggleSidebar);
closeSidebar.addEventListener("click", toggleSidebar);
overlay.addEventListener("click", toggleSidebar);

function formatNumber(num) {
    if (!num) return "0";
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(0) + "K";
    return num;
}

async function fetchData() {
    try {
        loader.classList.remove("hidden");
        const response = await fetch(BASE_URL);
        allCountriesData = await response.json();
        displayCountries(allCountriesData);
        updateRegionCounts();
    } catch (error) {
        console.error("Fetch Error:", error);
    } finally {
        loader.classList.add("hidden");
    }
}

function updateRegionCounts() {
    document.querySelectorAll("#region-list li").forEach(li => {
        const region = li.dataset.region.toLowerCase();
        const countSpan = li.querySelector(".region-count");
        if (region && countSpan) {
            const count = allCountriesData.filter(c => c.region.toLowerCase() === region).length;
            countSpan.textContent = count;
        }
    });
}

function displayCountries(data) {
    countriesGrid.innerHTML = "";
    if (showingCount) showingCount.textContent = data.length;
    if (!data || data.length === 0) {
        countriesGrid.innerHTML = `<div class="col-span-full text-center py-20 font-bold text-xl">No record found</div>`;
        return;
    }
    countriesGrid.innerHTML = data.map(createCountryCard).join("");
}

function handleCountryClick(code) {
    if (loader) loader.classList.remove("hidden");
    setTimeout(() => {
        window.location.href = `country.html?code=${code}&from=index`;
    }, 1000);
}

function createCountryCard(c) {
    const popProgress = Math.min((c.population / MAX_POPULATION) * 100, 100);
    const areaProgress = Math.min((c.area / MAX_AREA) * 100, 100);
    const capital = c.capital && c.capital.length ? c.capital[0] : "N/A";

    return `
    <div onclick="handleCountryClick('${c.cca3}')" class="cursor-pointer bg-white p-5 rounded-xl shadow-md hover:-translate-y-1 transition border border-transparent hover:border-sky-100">
        <div class="flex justify-between items-start mb-4">
            <div class="flex gap-3">
                <img src="${c.flags.png}" class="h-8 w-12 object-cover rounded shadow-sm border border-gray-100">
                <div>
                    <h3 class="font-bold text-md text-gray-800 leading-tight">${c.name.common || "N/A"}</h3>
                    <p class="text-[10px] text-gray-500">${capital}</p>
                </div>
            </div>
            <span class="text-[10px] bg-gray-100 px-2 py-1 rounded font-bold text-gray-600">${c.cca3}</span>
        </div>
        <div class="space-y-3">
            <div>
                <div class="flex justify-between text-[10px] font-bold mb-1 text-black">
                    <span>POPULATION</span>
                    <span>${formatNumber(c.population)}</span>
                </div>
                <div class="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div class="bg-blue-600 h-full" style="width:${popProgress}%"></div>
                </div>
            </div>
            <div>
                <div class="flex justify-between text-[10px] font-bold mb-1 text-black">
                    <span>AREA</span>
                    <span>${formatNumber(c.area)} km²</span>
                </div>
                <div class="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div class="bg-yellow-500 h-full" style="width:${areaProgress}%"></div>
                </div>
            </div>
        </div>
    </div>`;
}

function applyFilters() {
    let filtered = allCountriesData;
    if (selectedRegions.length) filtered = filtered.filter(c => selectedRegions.includes(c.region.toLowerCase()));
    if (searchQuery) {
        filtered = filtered.filter(c => {
            const name = c.name.common.toLowerCase() || "";
            const capital = c.capital?.[0]?.toLowerCase() || "";
            const code = c.cca3.toLowerCase() || "";
            return name.includes(searchQuery) || capital.includes(searchQuery) || code.includes(searchQuery);
        });
    }
    displayCountries(filtered);
}

regionCheckboxes.forEach(cb => {
    cb.addEventListener("change", () => {
        const li = cb.closest("li");
        const region = li.dataset.region.toLowerCase();
        if (cb.checked) selectedRegions.push(region);
        else selectedRegions = selectedRegions.filter(r => r !== region);
        applyFilters();
    });
});

if (searchInput) {
    searchInput.addEventListener("input", () => {
        searchQuery = searchInput.value.toLowerCase().trim();
        applyFilters();
    });
}

if (clearAllBtn) {
    clearAllBtn.addEventListener("click", () => {
        selectedRegions = [];
        searchQuery = "";
        searchInput.value = "";
        regionCheckboxes.forEach(cb => cb.checked = false);
        applyFilters();
    });
}

regionToggle.addEventListener("click", () => {
    regionList.classList.toggle("hidden");
    regionIcon.classList.toggle("rotate-180");
});

fetchData();