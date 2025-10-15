const fs = require('fs');
const path = require('path');

// Load existing dataset
const dataPath = path.join(__dirname, '../frontend/src/data/verso_demo_dataset.json');
const existingData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Enrichment data - descriptions, storytelling, and refined structures
const enrichments = {
  japan: {
    description: "Where centuries-old temples meet neon-lit streets. A place where precision meets poetry, and every detail tells a story.",
    best_time: "Cherry blossoms in spring (March-April) or autumn foliage (October-November)",
    cost_range: "mid-high",
    duration_hint: "10-14 days",
    hero_image_keywords: "japan mount fuji cherry blossom sunset tokyo skyline night neon kyoto bamboo forest pathway",
    themes: [
      {id: "food_culture", name: "Food Culture"},
      {id: "heritage", name: "Heritage Sites"},
      {id: "onsen_escapes", name: "Onsen Escapes"},
      {id: "city_life", name: "Urban Life"},
      {id: "nature_trails", name: "Nature Trails"},
      {id: "festivals", name: "Festivals"},
      {id: "nightlife", name: "Nightlife"}
    ],
    cities: {
      tokyo: {
        description: "A city that never sleeps, where vending machines serve hot ramen at 3 AM and serene shrines hide between skyscrapers.",
        image_keywords: "tokyo shibuya crossing night tokyo street neon lights tokyo tower cherry blossom"
      },
      kyoto: {
        description: "Japan's ancient capital where every corner reveals a temple, a garden, or a glimpse of geisha disappearing into wooden teahouses.",
        image_keywords: "kyoto fushimi inari torii gates kyoto bamboo grove arashiyama kyoto geisha gion district"
      },
      osaka: {
        description: "Japan's kitchen—where neon-lit streets overflow with takoyaki stands, and locals live to eat, laugh, and celebrate.",
        image_keywords: "osaka dotonbori neon lights canal osaka castle cherry blossom osaka street food takoyaki"
      }
    }
  },
  bali: {
    description: "An island where every sunrise feels sacred. Rice terraces ripple green, temples cling to cliffs, and the rhythm of life moves slower, sweeter.",
    best_time: "Dry season (May-September) for clear skies and calm seas",
    cost_range: "low-mid",
    duration_hint: "10-14 days",
    hero_image_keywords: "bali uluwatu temple sunset cliff bali tegalalang rice terraces green bali beach sunset palm trees",
    themes: [
      {id: "beach_escapes", name: "Beach Escapes"},
      {id: "diving_surf", name: "Diving & Surf"},
      {id: "temples", name: "Sacred Temples"},
      {id: "rice_terraces", name: "Rice Terraces"},
      {id: "jungle_wellness", name: "Jungle Wellness"},
      {id: "local_cuisine", name: "Local Cuisine"},
      {id: "culture_nights", name: "Cultural Nights"}
    ],
    cities: {
      ubud: {
        description: "Bali's cultural heart—where jungle, art, and spirituality converge in terraced green valleys.",
        image_keywords: "ubud rice terraces morning mist ubud monkey forest temple ubud market traditional crafts"
      },
      canggu: {
        description: "Bali's laid-back surf town where digital nomads, surfers, and yogis gather by the sea.",
        image_keywords: "canggu beach surf sunset bali canggu rice fields bicycle canggu echo beach waves"
      },
      seminyak: {
        description: "Where Bali gets polished—beach clubs, boutique shopping, and sunsets served with champagne.",
        image_keywords: "seminyak beach sunset bali surfer seminyak shopping boutique street seminyak beach club infinity pool"
      }
    }
  },
  croatia: {
    description: "Medieval towns tumble into turquoise waters. Ancient stone streets glow golden at dusk. This is the Adriatic at its most seductive.",
    best_time: "Shoulder seasons (May-June, September-October) for fewer crowds and perfect weather",
    cost_range: "low-mid",
    duration_hint: "7-10 days",
    hero_image_keywords: "croatia dubrovnik old town aerial croatia plitvice lakes waterfall croatia adriatic coast sunset",
    themes: [
      {id: "sailing", name: "Sailing & Islands"},
      {id: "heritage_towns", name: "Heritage Towns"},
      {id: "national_parks", name: "National Parks"},
      {id: "seafood_dining", name: "Seafood Dining"},
      {id: "hidden_villages", name: "Hidden Villages"},
      {id: "water_sports", name: "Water Sports"}
    ],
    cities: {
      dubrovnik: {
        description: "The Pearl of the Adriatic—marble streets, fortress walls, and sunsets that stop you in your tracks.",
        image_keywords: "dubrovnik old town walls aerial dubrovnik stradun marble street dubrovnik sunset fort lovrijenac"
      },
      split: {
        description: "A living Roman palace where locals hang laundry from ancient windows and cafés spill into 1,700-year-old courtyards.",
        image_keywords: "split diocletian palace aerial split riva promenade sunset split old town narrow streets"
      },
      rovinj: {
        description: "Istria's jewel—a fishing village of pastel houses, cobblestone hills, and the scent of truffles in the air.",
        image_keywords: "rovinj old town colorful harbor rovinj sunset istria rovinj narrow cobblestone streets"
      }
    }
  },
  thailand: {
    description: "Golden temples, floating markets, and limestone islands rising from emerald seas. The Land of Smiles lives up to its name.",
    best_time: "Cool and dry season (November-February)",
    cost_range: "low",
    duration_hint: "10-14 days",
    hero_image_keywords: "thailand phi phi islands limestone cliffs bangkok grand palace golden temple thailand floating market boats",
    themes: [
      {id: "street_food", name: "Street Food"},
      {id: "island_hopping", name: "Island Hopping"},
      {id: "night_markets", name: "Night Markets"},
      {id: "culture_temples", name: "Temple Culture"},
      {id: "water_adventures", name: "Water Adventures"},
      {id: "mountain_treks", name: "Mountain Treks"}
    ],
    cities: {
      bangkok: {
        description: "Chaos and calm collide—street vendors next to golden spires, tuk-tuks weaving through temple-lined streets.",
        image_keywords: "bangkok grand palace golden temple bangkok street market night neon bangkok tuk tuk traffic"
      },
      chiang_mai: {
        description: "Northern Thailand's heart—mountain air, night bazaars, and elephants roaming ethical sanctuaries.",
        image_keywords: "chiang mai doi suthep temple golden chiang mai night bazaar lanterns chiang mai elephant sanctuary"
      },
      phuket: {
        description: "Thailand's largest island—from party beaches to hidden coves, with turquoise waters all around.",
        image_keywords: "phuket patong beach sunset thailand phuket phi phi islands boat tour phuket old town colorful buildings"
      }
    }
  },
  new_zealand: {
    description: "Fjords carved by ice, mountains kissed by clouds, and a sense that Middle-earth was never just fiction.",
    best_time: "Summer (December-February) for hiking and adventure",
    cost_range: "mid-high",
    duration_hint: "12-16 days",
    hero_image_keywords: "new zealand milford sound fjord mountains new zealand mount cook aoraki sunset new zealand hobbiton shire green hills",
    themes: [
      {id: "fjords", name: "Fjords & Sounds"},
      {id: "adventure", name: "Adventure Sports"},
      {id: "maori_culture", name: "Māori Culture"},
      {id: "wine_routes", name: "Wine Routes"},
      {id: "road_trips", name: "Epic Road Trips"},
      {id: "coastal_wildlife", name: "Coastal Wildlife"},
      {id: "alpine_hikes", name: "Alpine Hikes"}
    ],
    cities: {
      queenstown: {
        description: "Adventure capital of the world—bungy jumps, fjord cruises, and views that belong on postcards.",
        image_keywords: "queenstown lake wakatipu mountains queenstown bungy jump kawarau bridge queenstown remarkables ski sunset"
      },
      auckland: {
        description: "City of sails—volcanic islands, harbor views, and wineries just a ferry ride away.",
        image_keywords: "auckland sky tower harbor skyline auckland waiheke island vineyard auckland mission bay beach"
      },
      rotorua: {
        description: "Where the earth bubbles and steams—geothermal wonders meet Māori traditions.",
        image_keywords: "rotorua geothermal pool steam rotorua maori cultural performance rotorua champagne pool colorful"
      }
    }
  },
  south_africa: {
    description: "Safari sunsets, vineyard valleys, and two oceans meeting at the tip of a continent. A place of staggering beauty and deep resilience.",
    best_time: "Spring (September-November) or autumn (March-May)",
    cost_range: "low-mid",
    duration_hint: "10-14 days",
    hero_image_keywords: "south africa table mountain cape town sunset south africa kruger safari elephant south africa cape point ocean cliffs",
    themes: [
      {id: "safari", name: "Safari & Wildlife"},
      {id: "coastlines", name: "Dramatic Coastlines"},
      {id: "winelands", name: "Winelands"},
      {id: "cultural_tours", name: "Cultural Tours"},
      {id: "garden_route", name: "Garden Route"},
      {id: "adventure_sports", name: "Adventure Sports"}
    ],
    cities: {
      cape_town: {
        description: "Table Mountain watches over this coastal city—where ocean meets mountain, and every view is breathtaking.",
        image_keywords: "cape town table mountain clouds cape town waterfront harbor sunset cape town twelve apostles coastline"
      },
      stellenbosch: {
        description: "Wine country at its finest—Cape Dutch architecture, endless vineyards, and world-class tastings.",
        image_keywords: "stellenbosch vineyard mountains cape stellenbosch wine estate architecture stellenbosch oak tree avenue"
      },
      kruger: {
        description: "One of Africa's greatest game reserves—where lions roam, elephants gather, and every drive is an adventure.",
        image_keywords: "kruger national park safari elephant south africa lion kruger sunset kruger park big five wildlife"
      }
    }
  }
};

// Transform function
function enrichCountry(countryId, countryData) {
  const enrich = enrichments[countryId] || {};
  
  return {
    ...countryData,
    description: enrich.description || countryData.description || "",
    best_time: enrich.best_time || "",
    cost_range: enrich.cost_range || countryData.cost_range,
    duration_hint: enrich.duration_hint || countryData.duration_hint,
    hero_image_keywords: enrich.hero_image_keywords || (Array.isArray(countryData.hero_image_keywords) ? countryData.hero_image_keywords.join(' ') : countryData.hero_image_keywords),
    themes: enrich.themes || (Array.isArray(countryData.themes) && typeof countryData.themes[0] === 'string' 
      ? countryData.themes.map(t => ({id: t.replace(/ /g, '_').toLowerCase(), name: t.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}))
      : countryData.themes),
    cities: enrichCities(countryId, countryData.cities, enrich.cities || {})
  };
}

function enrichCities(countryId, cities, cityEnrichments) {
  const enrichedCities = {};
  
  for (const [cityId, cityData] of Object.entries(cities)) {
    const cityEnrich = cityEnrichments[cityId] || {};
    enrichedCities[cityId] = {
      ...cityData,
      description: cityEnrich.description || "",
      image_keywords: cityEnrich.image_keywords || (Array.isArray(cityData.image_keywords) ? cityData.image_keywords.join(' ') : cityData.image_keywords),
      things_to_do: enrichExperiences(cityData.things_to_do || []),
      cafes: enrichCafes(cityData.cafes || [])
    };
  }
  
  return enrichedCities;
}

function enrichExperiences(experiences) {
  return experiences.map(exp => ({
    experience_id: exp.id || exp.experience_id,
    title: exp.title,
    subtitle: exp.subtitle || `Experience ${exp.title}`,
    description: exp.description || `Discover the magic of ${exp.title}. An unforgettable experience awaits.`,
    location: exp.location,
    duration: exp.duration,
    cost_range: transformCostRange(exp.cost),
    best_time: exp.best_time || "Anytime",
    tags: exp.tags || [],
    image_keywords: Array.isArray(exp.image_keywords) ? exp.image_keywords.join(' ') : exp.image_keywords,
    specific_options: enrichSpecificOptions(exp.specific_options || []),
    nearby_cafes: exp.nearby_cafes || [],
    related_activities: exp.related_activities || []
  }));
}

function enrichSpecificOptions(options) {
  return options.map(opt => ({
    title: opt.title || opt.name,
    description: opt.description || `Experience ${opt.title || opt.name}`,
    location: opt.location,
    duration: opt.duration || "1 hr",
    image_keywords: opt.image_keywords || `${opt.name} ${opt.location}`.toLowerCase()
  }));
}

function enrichCafes(cafes) {
  return cafes.map(cafe => ({
    name: cafe.name,
    notes: cafe.notes,
    vibe: cafe.vibe || "Relaxed, welcoming",
    image_keywords: Array.isArray(cafe.image_keywords) ? cafe.image_keywords.join(' ') : cafe.image_keywords
  }));
}

function transformCostRange(cost) {
  if (!cost) return "mid";
  if (cost === "Free" || cost === "$") return "low";
  if (cost === "$$") return "low-mid";
  if (cost === "$$$") return "mid-high";
  if (cost === "$$$$") return "high";
  return cost;
}

// Process all countries
const enrichedData = {
  countries: {}
};

for (const [countryId, countryData] of Object.entries(existingData.countries)) {
  enrichedData.countries[countryId] = enrichCountry(countryId, countryData);
}

// Write enriched data
const outputPath = path.join(__dirname, '../frontend/src/data/verso_demo_dataset.json');
fs.writeFileSync(outputPath, JSON.stringify(enrichedData, null, 2));

console.log('✓ Dataset enriched successfully!');
console.log('✓ Structure updated to production format');
console.log('✓ Storytelling enhanced across all countries');
