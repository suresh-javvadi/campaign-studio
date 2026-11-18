const prisma = require('../prismaClient');
const kit = require('./posterKit');

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1350;

function escapeXml(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function richThumbnail({ bgTop, bgBottom, accent, ringColor, photoCx, photoCy, photoR, title, category }) {
  const scale = 360 / CANVAS_WIDTH;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="450" viewBox="0 0 360 450">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${bgTop}"/>
        <stop offset="1" stop-color="${bgBottom}"/>
      </linearGradient>
    </defs>
    <rect width="360" height="450" fill="url(#bg)"/>
    <rect x="0" y="390" width="360" height="60" fill="rgba(0,0,0,0.35)"/>
    <circle cx="${photoCx * scale}" cy="${photoCy * scale}" r="${(photoR + 10) * scale}" fill="none" stroke="${ringColor}" stroke-width="2"/>
    <circle cx="${photoCx * scale}" cy="${photoCy * scale}" r="${photoR * scale}" fill="#8b93a3"/>
    <rect x="30" y="330" width="300" height="38" rx="10" fill="${accent}" opacity="0.95"/>
    <text x="180" y="410" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="16" font-weight="700" fill="#ffffff">${escapeXml(title)}</text>
    <text x="180" y="430" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="11" fill="#d7d9de">${escapeXml(category)}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function electionCampaignV2() {
  const objects = [
    ...kit.crowdSilhouette({ canvasWidth: CANVAS_WIDTH, baseline: CANVAS_HEIGHT - 4, count: 28, color: 'rgba(5,5,8,0.55)' }),
    ...kit.fixedPersonSlot({ cx: 150, cy: 140, radius: 58 }),
    ...kit.fixedPersonSlot({ cx: 290, cy: 140, radius: 58 }),
    ...kit.emblemBadge({ cx: 940, cy: 100, radius: 50, ringColor: '#ffffff', coreColor: '#b3122a' }),
    kit.ribbonBanner({ left: 90, top: 260, width: 900, height: 130, fill: '#7a0f1f', angle: -1.5, rx: 10 }),
    kit.text({
      text: 'ప్రజాసేవే నా లక్ష్యం\nమీ అభివృద్ధే నా ప్రాధాన్యం',
      left: 540,
      top: 325,
      fontSize: 32,
      fill: '#ffffff',
      fontFamily: kit.TELUGU_FONT,
      width: 820,
    }),
    ...kit.photoRing({ cx: 390, cy: 760, radius: 300, color: '#ffffff' }),
    kit.mainPhotoSlot({ cx: 390, cy: 760, radius: 300 }),
    kit.ribbonBanner({ left: 430, top: 980, width: 620, height: 110, fill: '#b3122a', angle: -1, rx: 8 }),
    kit.text({
      text: 'Your Name',
      left: 740,
      top: 1035,
      fontSize: 52,
      fill: '#ffffff',
      stroke: '#5c0a14',
      strokeWidth: 2,
      width: 580,
      editableRole: 'editableText',
      fieldId: 'name',
      label: 'Your Name',
    }),
    kit.ribbonBanner({ left: 460, top: 1100, width: 560, height: 60, fill: '#f2b705', angle: 1, rx: 8 }),
    kit.text({
      text: 'Your Title / Position',
      left: 740,
      top: 1130,
      fontSize: 26,
      fill: '#2a1500',
      width: 520,
      editableRole: 'editableText',
      fieldId: 'title',
      label: 'Title / Position',
    }),
    kit.ribbonBanner({ left: 60, top: 1190, width: 960, height: 110, fill: '#15060a', angle: 0, rx: 10, stroke: '#f2b705' }),
    kit.text({
      text: 'For a better tomorrow',
      left: 540,
      top: 1245,
      fontSize: 32,
      fill: '#f2b705',
      fontFamily: kit.TELUGU_FONT,
      width: 880,
      editableRole: 'editableText',
      fieldId: 'slogan',
      label: 'Slogan / Message',
    }),
  ]

  return {
    id: 'tpl-election-campaign-v2',
    title: 'Election Campaign Poster (New Design)',
    description: 'A bold rally-style campaign poster with a large photo, endorsing leaders, and a layered banner composition.',
    category: 'Election Campaign',
    partyTag: 'Regional Party A',
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    canvasData: { version: '7.4.0', background: kit.linearGradient([[0, '#3a0a12'], [1, '#120407']], { width: CANVAS_WIDTH, height: CANVAS_HEIGHT }), objects },
    thumbnailUrl: richThumbnail({
      bgTop: '#3a0a12',
      bgBottom: '#120407',
      accent: '#b3122a',
      ringColor: '#ffffff',
      photoCx: 390,
      photoCy: 760,
      photoR: 300,
      title: 'Election Campaign',
      category: 'Election Campaign',
    }),
  }
}

function leaderIntroductionV2() {
  const objects = [
    ...kit.crowdSilhouette({ canvasWidth: CANVAS_WIDTH, baseline: CANVAS_HEIGHT - 4, count: 24, color: 'rgba(4,16,37,0.6)' }),
    ...kit.emblemBadge({ cx: 540, cy: 95, radius: 50, ringColor: '#d4af37', coreColor: '#0b2545' }),
    kit.ribbonBanner({ left: 390, top: 175, width: 300, height: 60, fill: '#d4af37', angle: 0, rx: 30 }),
    kit.text({
      text: 'పరిచయం',
      left: 540,
      top: 205,
      fontSize: 28,
      fill: '#0b2545',
      fontFamily: kit.TELUGU_FONT,
    }),
    ...kit.photoRing({ cx: 540, cy: 640, radius: 320, color: '#d4af37' }),
    kit.mainPhotoSlot({ cx: 540, cy: 640, radius: 320 }),
    kit.ribbonBanner({ left: 140, top: 980, width: 800, height: 120, fill: '#0b2545', angle: 0, rx: 10, stroke: '#d4af37' }),
    kit.text({
      text: 'Your Name',
      left: 540,
      top: 1040,
      fontSize: 56,
      fill: '#d4af37',
      stroke: '#0b2545',
      strokeWidth: 2,
      width: 760,
      editableRole: 'editableText',
      fieldId: 'name',
      label: 'Your Name',
    }),
    kit.ribbonBanner({ left: 220, top: 1110, width: 640, height: 56, fill: '#d4af37', angle: 0, rx: 28 }),
    kit.text({
      text: 'Your Title / Position',
      left: 540,
      top: 1138,
      fontSize: 26,
      fill: '#0b2545',
      width: 600,
      editableRole: 'editableText',
      fieldId: 'title',
      label: 'Title / Position',
    }),
    kit.ribbonBanner({ left: 70, top: 1190, width: 940, height: 110, fill: '#041025', angle: 0, rx: 10, stroke: '#d4af37' }),
    kit.text({
      text: 'Serving with dedication',
      left: 540,
      top: 1245,
      fontSize: 30,
      fill: '#d4af37',
      fontFamily: kit.TELUGU_FONT,
      width: 860,
      editableRole: 'editableText',
      fieldId: 'slogan',
      label: 'Slogan / Message',
    }),
  ]

  return {
    id: 'tpl-leader-intro-v2',
    title: 'Political Leader Introduction (New Design)',
    description: 'A formal introduction poster centered on a single large portrait with gold-on-navy branding.',
    category: 'Political Leader Introduction',
    partyTag: 'Independent',
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    canvasData: { version: '7.4.0', background: kit.linearGradient([[0, '#0b2545'], [1, '#02060f']], { width: CANVAS_WIDTH, height: CANVAS_HEIGHT }), objects },
    thumbnailUrl: richThumbnail({
      bgTop: '#0b2545',
      bgBottom: '#02060f',
      accent: '#d4af37',
      ringColor: '#d4af37',
      photoCx: 540,
      photoCy: 640,
      photoR: 320,
      title: 'Leader Introduction',
      category: 'Political Leader Introduction',
    }),
  }
}

async function main() {
  const defs = [electionCampaignV2(), leaderIntroductionV2()]
  for (const def of defs) {
    const { id, ...data } = def
    await prisma.template.upsert({ where: { id }, create: { id, ...data }, update: data })
  }
  console.log(`Seeded ${defs.length} preview templates.`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
