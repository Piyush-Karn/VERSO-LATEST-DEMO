const fs = require('fs');
const path = require('path');

// Load current dataset
const dataPath = path.join(__dirname, '../frontend/src/data/verso_demo_dataset.json');
const dataset = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Enhance all experiences with detailed metadata
for (const country of Object.values(dataset.countries)) {
  for (const city of Object.values(country.cities)) {
    if (city.things_to_do) {
      for (const experience of city.things_to_do) {
        // Add new fields if missing
        if (!experience.cost_estimate) {
          // Convert cost_range to numeric estimate
          const costMap = {
            'low': { min: 5, max: 20, level: 'low' },
            'low-mid': { min: 15, max: 40, level: 'mid' },
            'mid': { min: 30, max: 60, level: 'mid' },
            'mid-high': { min: 50, max: 100, level: 'high' },
            'high': { min: 80, max: 150, level: 'high' }
          };
          const estimate = costMap[experience.cost_range] || costMap['mid'];
          experience.cost_estimate = estimate;
        }
        
        if (!experience.duration_min_max) {
          // Parse duration string (e.g., "2-3 hrs")
          const durationStr = experience.duration || '2 hrs';
          const match = durationStr.match(/(\d+)(?:-(\d+))?\s*(hrs?|hours?|min|minutes?)/i);
          if (match) {
            const min = parseInt(match[1]);
            const max = match[2] ? parseInt(match[2]) : min;
            const unit = match[3].toLowerCase().includes('min') ? 'minutes' : 'hours';
            experience.duration_min_max = { min, max, unit };
          } else {
            experience.duration_min_max = { min: 2, max: 3, unit: 'hours' };
          }
        }
        
        if (!experience.crowd_score) {
          // Generate crowd score based on tags and cost
          const baseCrowdScore = experience.tags && experience.tags.includes('Popular') ? 75 : 50;
          const costAdjust = experience.cost_estimate?.level === 'high' ? -10 : 0;
          experience.crowd_score = Math.min(100, Math.max(0, baseCrowdScore + costAdjust));
        }
        
        if (!experience.best_months) {
          // Use country seasonality as default
          experience.best_months = country.seasonality || ['All year'];
        }
        
        if (!experience.activity_tags) {
          // Use existing tags or create from tags array
          experience.activity_tags = experience.tags || [];
        }
        
        if (!experience.rating) {
          // Generate realistic rating
          experience.rating = 4.5 + Math.random() * 0.4; // 4.5-4.9
        }
        
        if (!experience.reviews) {
          // Generate review count based on popularity
          const baseReviews = experience.crowd_score > 70 ? 500 : 200;
          experience.reviews = Math.floor(baseReviews + Math.random() * 300);
        }
        
        // Add sensory_subcopy if description is too long
        if (experience.description && experience.description.length > 100) {
          // Extract first sentence or first 12-14 words
          const words = experience.description.split(' ');
          if (words.length > 14) {
            experience.sensory_subcopy = words.slice(0, 14).join(' ') + '...';
          } else {
            experience.sensory_subcopy = experience.description;
          }
        } else {
          experience.sensory_subcopy = experience.description;
        }
      }
    }
    
    // Enhance cafes
    if (city.cafes) {
      for (const cafe of city.cafes) {
        // Add new fields
        if (!cafe.cafe_id) {
          cafe.cafe_id = cafe.name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
        }
        
        if (!cafe.price_level) {
          cafe.price_level = 'mid';
        }
        
        if (!cafe.open_hours) {
          cafe.open_hours = '08:00-20:00';
        }
        
        if (!cafe.features) {
          // Common cafe features
          cafe.features = ['wifi', 'outdoor', 'coffee'];
        }
        
        if (!cafe.menu_highlights) {
          // Generate menu highlights based on cafe type
          const highlights = [
            'Specialty coffee',
            'Fresh pastries',
            'Healthy bowls'
          ];
          cafe.menu_highlights = [highlights[Math.floor(Math.random() * highlights.length)]];
        }
        
        if (!cafe.dietary_friendly) {
          cafe.dietary_friendly = [];
        }
        
        if (!cafe.noise_level) {
          cafe.noise_level = cafe.vibe?.includes('quiet') ? 'quiet' : 'moderate';
        }
        
        // Extract vibe from notes if not present
        if (!cafe.vibe && cafe.notes) {
          cafe.vibe = cafe.notes.split('—')[0].substring(0, 30);
        }
      }
    }
  }
}

// Write updated dataset
fs.writeFileSync(dataPath, JSON.stringify(dataset, null, 2));

console.log('✓ Activities and cafés enriched with detailed metadata!');
console.log('✓ Added: cost_estimate, duration_min_max, crowd_score, ratings, reviews');
console.log('✓ Added: café features, menu highlights, vibe, noise levels');
