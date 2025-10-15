const fs = require('fs');
const path = require('path');

// Load current enriched dataset
const dataPath = path.join(__dirname, '../frontend/src/data/verso_demo_dataset.json');
const dataset = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Load storytelling enrichments
const enrichmentsPath = path.join(__dirname, 'storytelling_enrichments.json');
const storytelling = JSON.parse(fs.readFileSync(enrichmentsPath, 'utf8'));

// Apply storytelling enrichments
for (const [countryId, countryStories] of Object.entries(storytelling)) {
  const country = dataset.countries[countryId];
  if (!country) continue;
  
  for (const [cityId, cityStories] of Object.entries(countryStories)) {
    const city = country.cities[cityId];
    if (!city || !city.things_to_do) continue;
    
    for (const experience of city.things_to_do) {
      const expId = experience.experience_id;
      const storyData = cityStories[expId];
      
      if (storyData) {
        // Apply main experience enrichments
        if (storyData.subtitle) experience.subtitle = storyData.subtitle;
        if (storyData.description) experience.description = storyData.description;
        if (storyData.best_time) experience.best_time = storyData.best_time;
        if (storyData.nearby_cafes) experience.nearby_cafes = storyData.nearby_cafes;
        if (storyData.related_activities) experience.related_activities = storyData.related_activities;
        
        // Apply specific_options enrichments
        if (storyData.specific_options && experience.specific_options) {
          for (const option of experience.specific_options) {
            const optionStory = storyData.specific_options[option.title];
            if (optionStory) {
              if (optionStory.description) option.description = optionStory.description;
              if (optionStory.duration) option.duration = optionStory.duration;
              if (optionStory.image_keywords) option.image_keywords = optionStory.image_keywords;
            }
          }
        }
      }
    }
  }
}

// Add cafe vibes
const cafeVibes = {
  "%Arabica Tokyo": "Quiet, focused, modern",
  "Fuglen Tokyo": "Eclectic, warm, timeless",
  "Blue Bottle Roppongi": "Calm, refined, artistic",
  "%Arabica Kyoto": "Busy, photogenic, excellent espresso",
  "Weekenders Coffee": "Peaceful, artisan, local favorite",
  "Inoda Coffee Honten": "Nostalgic, warm, unhurried",
  "Café Organic": "Tranquil, nourishing, Instagram-ready",
  "Clear Café": "Zen, wellness-focused, calm",
  "Seniman Coffee Studio": "Professional, artisan, community-driven",
  "Crate Café": "Social, health-conscious, energetic",
  "Betelnut Café": "Peaceful, vegan-friendly, green",
  "Revolver Espresso": "Minimalist, serious coffee, efficient"
};

// Apply cafe vibes
for (const country of Object.values(dataset.countries)) {
  for (const city of Object.values(country.cities)) {
    if (city.cafes) {
      for (const cafe of city.cafes) {
        if (cafeVibes[cafe.name]) {
          cafe.vibe = cafeVibes[cafe.name];
        }
      }
    }
  }
}

// Write updated dataset
fs.writeFileSync(dataPath, JSON.stringify(dataset, null, 2));

console.log('✓ Storytelling enrichments applied successfully!');
console.log('✓ Experience descriptions enhanced');
console.log('✓ Specific options detailed');
console.log('✓ Café vibes added');
