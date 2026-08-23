import { scrapeHanoiPlanningData } from '../lib/scraper/planning';

const TARGET_DISTRICTS = ['Cầu Giấy', 'Ba Đình', 'Đống Đa', 'Tây Hồ', 'Nam Từ Liêm'];

async function run() {
  console.log('🚀 Starting Hanoi Planning Data Scraping Job...');
  
  for (const district of TARGET_DISTRICTS) {
    const data = await scrapeHanoiPlanningData(district);
    console.log(`✅ Scraped ${data.length} planning zones for district: ${district}`);
  }

  console.log('🎉 Scraping completed successfully!');
}

run().catch((err) => {
  console.error('❌ Error running scraper:', err);
  process.exit(1);
});
