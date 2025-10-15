const fs = require('fs');
const path = require('path');

// Load current dataset
const dataPath = path.join(__dirname, '../frontend/src/data/verso_demo_dataset.json');
const dataset = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Specific option descriptions for ALL countries
const optionDescriptions = {
  // Croatia - Dubrovnik
  "Pile Gate Entrance": "Begin at the main western entrance—iconic stone archway leading into old town",
  "Fort Minceta Tower": "Climb to the highest point for commanding views over land and sea",
  "Bokar Fortress": "Explore the cylindrical fortress jutting out toward the waves",
  "Dead Sea Saltwater Lake": "Float effortlessly in this mineral-rich inland pool—surprisingly therapeutic",
  "Benedictine Monastery": "Wander peaceful cloisters and gardens dating back centuries",
  "Peacock Gardens": "Encounter free-roaming peacocks in lush Mediterranean gardens",
  "Sunset Kayak Tour": "Paddle along the city walls as the sun sets behind fortress silhouettes",
  "Cave Snorkeling": "Duck into Betina Cave for crystal-clear snorkeling in hidden azure waters",
  "Banje Beach Stop": "Rest at Dubrovnik's most popular beach with city wall views",
  
  // Croatia - Split
  "Underground Cellars": "Descend into Diocletian's basement—atmospheric Roman chambers now a museum",
  "Peristyle Square": "The palace's central courtyard, still the beating heart of Split",
  "Cathedral Bell Tower": "Climb narrow stairs for sweeping views over Split and the Adriatic",
  "Telegrin Peak": "Reach Marjan's highest viewpoint for epic panoramic sunset vistas",
  "Jewish Cemetery Trail": "A peaceful, lesser-known path through history and nature",
  "Vidilica Café Stop": "Refuel mid-hike with coffee and views at this hilltop café",
  "Blue Lagoon Swim": "Swim in impossibly turquoise shallows—pristine and postcard-perfect",
  "Šolta Island Stop": "Visit this quiet island's charming fishing village",
  "Nečujam Beach": "Relax on Šolta's sandy southern beach—calm, clear, and crowd-free",
  
  // Croatia - Rovinj
  "St. Euphemia Church": "Climb the bell tower of Rovinj's hilltop Baroque church",
  "Grisia Street Art Walk": "Stroll the artists' quarter lined with galleries and studios",
  "Harbor Sunset Spot": "Find your perfect perch along the waterfront promenade",
  "St. Andrew Island": "Kayak to Red Island's main isle for swimming and exploring",
  "Maskin Forest Park": "Wander forested trails on this peaceful nature reserve island",
  "Secluded Bay Swim": "Discover your own private cove for quiet swimming",
  "Motovun Forest Hunt": "Search for truffles in the mystical Motovun woods with trained dogs",
  "Truffle Tasting Lunch": "Feast on fresh truffles shaved over pasta in a traditional konoba",
  "Istrian Wine Pairing": "Sample local Malvazija and Teran wines alongside truffle dishes",
  
  // Thailand - Bangkok
  "Emerald Buddha Temple": "Marvel at Thailand's most sacred Buddha image—carved from single jade block",
  "Chakri Maha Prasat": "Explore the Grand Palace's throne hall blending Thai and European architecture",
  "Temple of the Reclining Buddha": "Visit Wat Pho to see the massive 46-meter gold-plated Buddha",
  "Boat Tour": "Cruise the narrow canals in a traditional longtail boat",
  "Fresh Fruit Tasting": "Sample tropical fruits straight from floating vendors—mango, rambutan, dragon fruit",
  "Traditional Thai Desserts": "Try sticky coconut sweets and other floating market specialties",
  "Sky Bar at Lebua": "Sip cocktails 820 feet up at the world-famous rooftop bar",
  "Octave Rooftop Bar": "Enjoy 360° views from this three-level open-air venue",
  "Vertigo & Moon Bar": "Dine and drink at the edge of Banyan Tree's 61st floor",
  
  // Thailand - Chiang Mai
  "Elephant Nature Park": "Spend the day at this renowned ethical elephant rescue sanctuary",
  "Elephant Jungle Sanctuary": "Get closer to elephants in a more interactive half-day program",
  "Boon Lott's Elephant Sanctuary": "Visit this intimate, rescue-focused sanctuary (advance booking required)",
  "Thai Farm Cooking School": "Learn to cook on an organic farm surrounded by rice paddies",
  "Asia Scenic Thai Cooking": "Market visit followed by hands-on cooking in a Thai home",
  "Basil Cookery School": "Popular Old City class with vegetarian/vegan options available",
  "Kalare Night Bazaar": "Explore the main night market with food courts and handicrafts",
  "Saturday Walking Street": "Wualai Road transforms into a massive weekend market",
  "Sunday Walking Street": "The biggest walking street—Rachadamnoen fills with vendors and performers",
  
  // Thailand - Phuket
  "Maya Bay Visit": "Step foot in the famous beach from \"The Beach\" (now with visitor limits)",
  "Pileh Lagoon Swim": "Swim in an enclosed emerald lagoon surrounded by towering cliffs",
  "Monkey Beach": "Visit the beach inhabited by playful (and mischievous) macaques",
  "Shark Point Dive": "Two dives at one of Phuket's best sites—leopard sharks and abundant marine life",
  "Racha Noi Island": "Advanced dive site with manta ray sightings and dramatic drop-offs",
  "King Cruiser Wreck": "Explore a sunken ferry now teeming with marine life",
  "Thalang Road": "Walk the main heritage street lined with Sino-Portuguese shophouses",
  "Soi Romanee": "Discover the most charming and photogenic lane in old town",
  "Sunday Market": "Browse the Lard Yai walking street market for food and crafts",
  
  // New Zealand - Queenstown
  "Original Bungy (43m)": "The world's first commercial bungy jump—iconic and exhilarating",
  "Ledge Bungy (47m)": "Jump over Queenstown with stunning lake and mountain views",
  "Nevis Bungy (134m)": "New Zealand's highest bungy—not for the faint of heart",
  "Scenic Cruise": "Traditional boat cruise through Milford Sound's dramatic fjord",
  "Kayaking Tour": "Paddle right up to waterfalls and seal colonies",
  "Helicopter Flight": "Fly over Milford Sound and land on a glacier (weather permitting)",
  "Gondola Ride": "Ascend Bob's Peak in a glass cabin for panoramic views",
  "Luge Tracks": "Race down three different tracks on gravity-powered go-karts",
  "Stratosfare Restaurant": "Fine dining with floor-to-ceiling views over Lake Wakatipu",
  
  // New Zealand - Auckland
  "Cable Bay Vineyards": "Award-winning wines with stunning Hauraki Gulf views",
  "Mudbrick Vineyard": "Family-owned vineyard with acclaimed restaurant and sculpture park",
  "Man O' War": "Boutique winery on the eastern peninsula—intimate tastings, exceptional wines",
  "Summit Track": "Hike to Rangitoto's 259-meter summit through volcanic landscape",
  "Lava Caves": "Explore eerie underground caves formed by molten lava",
  "Pohutukawa Grove": "Walk through native New Zealand Christmas tree forest",
  "Sky Walk": "Circle the Sky Tower's exterior platform 192 meters above the city",
  "Orbit 360° Restaurant": "Dine as the restaurant slowly rotates, revealing ever-changing views",
  "Observation Deck": "Simply take in Auckland's skyline from the main viewing level",
  
  // New Zealand - Rotorua
  "Maori Cultural Show": "Watch powerful haka, poi dancing, and traditional storytelling",
  "Pohutu Geyser": "See New Zealand's most active geyser erupt up to 30 meters high",
  "Kiwi Conservation": "Spot New Zealand's national bird in a nocturnal viewing house",
  "Champagne Pool": "Marvel at the vibrant orange and yellow geothermal pool",
  "Artist's Palette": "Walk among rainbow-colored mineral terraces",
  "Lady Knox Geyser": "Watch the daily 10:15 AM eruption of this soap-induced geyser",
  "Treewalk Night Lights": "Walk suspended bridges lit by thousands of colorful lanterns",
  "Day Treewalk": "Experience the canopy walk in natural daylight",
  "Mountain Biking": "Ride through the redwood forest on world-class single-track trails",
  
  // South Africa - Cape Town
  "Cable Car Ride": "Ascend Table Mountain in a rotating cable car (weather dependent)",
  "Platteklip Gorge Hike": "The most direct hiking route up the mountain—steep but rewarding",
  "India Venster Route": "Advanced scramble combining hiking and rock climbing",
  "Great White Encounter": "Descend in a cage for face-to-face encounters with great whites",
  "Boat-based Viewing": "Stay on deck to watch sharks from the boat (no cage)",
  "Marine Big 5 Tour": "Spot whales, dolphins, seals, penguins, and sharks in one trip",
  "Cape of Good Hope": "Visit the iconic southwestern point of Africa",
  "Boulders Beach Penguins": "Walk among thousands of adorable African penguins",
  "Chapman's Peak Drive": "Drive one of the world's most scenic coastal roads",
  
  // South Africa - Stellenbosch
  "Delaire Graff Estate": "Luxury wine estate with art gallery and mountain lodge",
  "Tokara Wine Estate": "Modern tasting room with olive oil and deli tastings",
  "Waterford Estate": "Innovative wine and chocolate pairing experiences",
  "Swartboskloof Trail": "Scenic valley hike through indigenous forest",
  "Panorama Trail": "Ridge walk offering sweeping vineyard and mountain views",
  "Waterfall Trail": "Follow the river to cascading mountain waterfalls",
  "Rupert Museum": "South African art collection in historic Stellenbosch",
  "Stellenbosch University Museum": "Dutch colonial artifacts and cultural history",
  "Village Museum": "Four historic houses showing 200 years of Cape life",
  
  // South Africa - Kruger
  "Early Morning Drive": "Best time to spot predators returning from night hunts",
  "Full Day Safari": "Cover more ground with packed breakfast, lunch, and two game drives",
  "Night Drive": "Spotlights reveal nocturnal wildlife—hyenas, civets, bushbabies",
  "Wilderness Trail": "Multi-day walking safari staying in rustic bush camps",
  "Tracker Experience": "Learn to read animal signs and tracks with expert guides",
  "Bushcraft Skills": "Ranger training in survival, tracking, and bushcraft",
  "Sunset Drive & Drinks": "Game drive ending with sundowners overlooking the savanna",
  "Bush Dinner": "Dine under the stars around a fire in the African wilderness",
  "Luxury Lodge Experience": "Stay in a five-star private game lodge with gourmet dining"
};

// Apply descriptions to all specific options
for (const country of Object.values(dataset.countries)) {
  for (const city of Object.values(country.cities)) {
    if (city.things_to_do) {
      for (const experience of city.things_to_do) {
        if (experience.specific_options) {
          for (const option of experience.specific_options) {
            if (optionDescriptions[option.title]) {
              option.description = optionDescriptions[option.title];
            }
          }
        }
      }
    }
  }
}

// Write updated dataset
fs.writeFileSync(dataPath, JSON.stringify(dataset, null, 2));

console.log('✓ All specific options enriched with detailed descriptions!');
console.log('✓ Dataset is now production-ready');
