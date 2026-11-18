const prisma = require('../prismaClient');

const TELUGU_FONT = 'Nirmala UI, Noto Sans Telugu, sans-serif';
const BODY_FONT = 'Segoe UI, system-ui, sans-serif';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1350;

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Cheap, dependency-free thumbnail: an inline SVG data URI rather than a
 * rendered PNG. Good enough for gallery cards without pulling in a
 * server-side canvas/headless-browser renderer just for seed data.
 */
function thumbnailDataUri({ bgColor, bannerColor, accentColor, title, category }) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="450" viewBox="0 0 360 450">
    <rect width="360" height="450" fill="${bgColor}"/>
    <rect width="360" height="90" fill="${bannerColor}"/>
    <circle cx="36" cy="36" r="18" fill="${accentColor}" stroke="#ffffff" stroke-width="2"/>
    <circle cx="320" cy="44" r="28" fill="#cfd3da" stroke="#ffffff" stroke-width="3"/>
    <rect x="64" y="130" width="232" height="206" rx="10" fill="#e9ebee" stroke="#9aa0ab" stroke-width="2" stroke-dasharray="6,5"/>
    <text x="180" y="365" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="20" font-weight="700" fill="#15171e">${escapeXml(title)}</text>
    <text x="180" y="390" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="13" fill="#5b6270">${escapeXml(category)}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function buildCanvasData({ bgColor, bannerColor, accentColor, teluguGreeting, englishSubtitle, sloganPlaceholder }) {
  return {
    version: '7.4.0',
    background: bgColor,
    objects: [
      {
        type: 'Rect',
        left: 0,
        top: 0,
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        fill: bgColor,
        selectable: false,
        evented: false,
        editableRole: 'locked',
      },
      {
        type: 'Rect',
        left: 0,
        top: 0,
        width: CANVAS_WIDTH,
        height: 260,
        fill: bannerColor,
        selectable: false,
        evented: false,
        editableRole: 'locked',
      },
      {
        type: 'Circle',
        left: 100,
        top: 90,
        originX: 'center',
        originY: 'center',
        radius: 48,
        fill: accentColor,
        stroke: '#ffffff',
        strokeWidth: 4,
        selectable: false,
        evented: false,
        editableRole: 'locked',
      },
      {
        type: 'Circle',
        left: 960,
        top: 130,
        originX: 'center',
        originY: 'center',
        radius: 85,
        fill: '#cfd3da',
        stroke: '#ffffff',
        strokeWidth: 5,
        selectable: false,
        evented: false,
        editableRole: 'locked',
      },
      {
        type: 'IText',
        text: 'Senior Leader',
        left: 960,
        top: 230,
        originX: 'center',
        originY: 'center',
        fontFamily: BODY_FONT,
        fontSize: 20,
        fontWeight: '600',
        fill: '#ffffff',
        textAlign: 'center',
        selectable: false,
        evented: false,
        editableRole: 'locked',
      },
      {
        type: 'IText',
        text: teluguGreeting,
        left: 460,
        top: 105,
        originX: 'center',
        originY: 'center',
        width: 640,
        fontFamily: TELUGU_FONT,
        fontSize: 46,
        fontWeight: 'bold',
        fill: '#ffffff',
        textAlign: 'center',
        selectable: false,
        evented: false,
        editableRole: 'locked',
      },
      {
        type: 'IText',
        text: englishSubtitle,
        left: 460,
        top: 180,
        originX: 'center',
        originY: 'center',
        width: 640,
        fontFamily: BODY_FONT,
        fontSize: 22,
        fill: '#ffffff',
        opacity: 0.9,
        textAlign: 'center',
        selectable: false,
        evented: false,
        editableRole: 'locked',
      },
      {
        type: 'Rect',
        left: 190,
        top: 360,
        width: 700,
        height: 620,
        rx: 16,
        ry: 16,
        fill: '#e9ebee',
        stroke: '#9aa0ab',
        strokeWidth: 3,
        strokeDashArray: [14, 10],
        editableRole: 'mainPhoto',
        fieldId: 'mainPhoto',
        label: 'Your Photo',
      },
      {
        type: 'IText',
        text: 'Your Name',
        left: 540,
        top: 1040,
        originX: 'center',
        originY: 'center',
        width: 900,
        fontFamily: BODY_FONT,
        fontSize: 44,
        fontWeight: 'bold',
        fill: '#15171e',
        textAlign: 'center',
        editableRole: 'editableText',
        fieldId: 'name',
        label: 'Your Name',
      },
      {
        type: 'IText',
        text: 'Your Title / Position',
        left: 540,
        top: 1100,
        originX: 'center',
        originY: 'center',
        width: 900,
        fontFamily: BODY_FONT,
        fontSize: 28,
        fill: '#5b6270',
        textAlign: 'center',
        editableRole: 'editableText',
        fieldId: 'title',
        label: 'Title / Position',
      },
      {
        type: 'IText',
        text: sloganPlaceholder,
        left: 540,
        top: 1180,
        originX: 'center',
        originY: 'center',
        width: 920,
        fontFamily: TELUGU_FONT,
        fontSize: 26,
        fontWeight: '600',
        fill: accentColor,
        textAlign: 'center',
        editableRole: 'editableText',
        fieldId: 'slogan',
        label: 'Slogan / Message',
      },
      {
        type: 'Rect',
        left: 0,
        top: 1300,
        width: CANVAS_WIDTH,
        height: 50,
        fill: bannerColor,
        selectable: false,
        evented: false,
        editableRole: 'locked',
      },
    ],
  };
}

const TEMPLATE_DEFS = [
  {
    id: 'tpl-election-campaign',
    title: 'Election Campaign Poster',
    description: 'A bold campaign poster for public meetings and door-to-door canvassing.',
    category: 'Election Campaign',
    partyTag: 'Regional Party A',
    bgColor: '#fff6ef',
    bannerColor: '#1d3557',
    accentColor: '#e8572a',
    teluguGreeting: 'మీ ఓటు మీ హక్కు',
    englishSubtitle: 'Your Vote, Your Voice',
    sloganPlaceholder: 'For a better tomorrow',
  },
  {
    id: 'tpl-public-meeting',
    title: 'Public Meeting Invitation',
    description: 'Invite your constituents to an upcoming public meeting or town hall.',
    category: 'Public Meeting',
    partyTag: 'Independent',
    bgColor: '#eef6f1',
    bannerColor: '#2f6f4e',
    accentColor: '#2f9e62',
    teluguGreeting: 'బహిరంగ సభ ఆహ్వానం',
    englishSubtitle: 'Public Meeting Invitation',
    sloganPlaceholder: 'All are welcome',
  },
  {
    id: 'tpl-festival-greetings',
    title: 'Festival Greetings',
    description: 'Warm festival wishes for your constituents, personalized with your name.',
    category: 'Festival Greetings',
    partyTag: 'All Parties',
    bgColor: '#fff8e8',
    bannerColor: '#b5651d',
    accentColor: '#c98a1f',
    teluguGreeting: 'పండుగ శుభాకాంక్షలు',
    englishSubtitle: 'Festival Greetings',
    sloganPlaceholder: 'Wishing you joy and prosperity',
  },
  {
    id: 'tpl-independence-day',
    title: 'Independence Day Wishes',
    description: 'Celebrate Independence Day with a patriotic greeting poster.',
    category: 'Independence Day',
    partyTag: 'All Parties',
    bgColor: '#eef3ff',
    bannerColor: '#1b4332',
    accentColor: '#2f6f4e',
    teluguGreeting: 'స్వాతంత్ర్య దినోత్సవ శుభాకాంక్షలు',
    englishSubtitle: 'Happy Independence Day',
    sloganPlaceholder: 'Proud to be Indian',
  },
  {
    id: 'tpl-birthday-wishes',
    title: 'Birthday Wishes for Leader',
    description: "Celebrate a leader's birthday with a festive personalized poster.",
    category: 'Birthday Wishes',
    partyTag: 'Regional Party B',
    bgColor: '#fdf2f8',
    bannerColor: '#7c3aed',
    accentColor: '#a855f7',
    teluguGreeting: 'పుట్టినరోజు శుభాకాంక్షలు',
    englishSubtitle: 'Happy Birthday',
    sloganPlaceholder: 'Wishing you good health and success',
  },
  {
    id: 'tpl-condolence',
    title: 'Condolence & Tribute',
    description: 'A respectful tribute poster to honor and remember a leader.',
    category: 'Condolence',
    partyTag: 'All Parties',
    bgColor: '#f4f4f5',
    bannerColor: '#3f3f46',
    accentColor: '#71717a',
    teluguGreeting: 'భావపూర్వక నివాళి',
    englishSubtitle: 'In Loving Memory',
    sloganPlaceholder: 'Forever in our hearts',
  },
];

async function main() {
  for (const def of TEMPLATE_DEFS) {
    const { id, title, description, category, partyTag, ...canvasConfig } = def;

    await prisma.template.upsert({
      where: { id },
      create: {
        id,
        title,
        description,
        category,
        partyTag,
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        thumbnailUrl: thumbnailDataUri({ ...canvasConfig, title, category }),
        canvasData: buildCanvasData(canvasConfig),
        isPublished: true,
      },
      update: {
        title,
        description,
        category,
        partyTag,
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        thumbnailUrl: thumbnailDataUri({ ...canvasConfig, title, category }),
        canvasData: buildCanvasData(canvasConfig),
        isPublished: true,
      },
    });
  }

  console.log(`Seeded ${TEMPLATE_DEFS.length} templates.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
