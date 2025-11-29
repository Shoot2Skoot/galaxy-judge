/**
 * Game data for injecting variety into AI-generated cases
 * Helps lightweight models like gpt-5-nano avoid repetition
 */

export const firstNames = [
  "Amos", "Kira", "Jax", "Nova", "Zara", "Cyrus", "Luna", "Orion", "Vex", "Aria",
  "Kai", "Lyra", "Atlas", "Nyx", "Cade", "Stella", "Rian", "Vega", "Malik", "Aurora",
  "Finn", "Cassian", "Mira", "Thane", "Elektra", "Draven", "Seren", "Vale", "Echo", "Rook",
  "Silas", "Andromeda", "Knox", "Celeste", "Dax", "Nebula", "Kael", "Astrid", "Rex", "Solara",
  "Caspian", "Iris", "Jett", "Phoenix", "Zane", "Callisto", "Arlo", "Vesper", "Dante", "Io",
  "Ezra", "Rhea", "Nash", "Pandora", "Cole", "Titania", "Jace", "Selene", "Flint", "Artemis",
  "Kane", "Elara", "Cruz", "Calypso", "Ryder", "Phoebe", "Axel", "Athena", "Blaze", "Zenith",
  "Slade", "Astra", "Quinn", "Halley", "Reese", "Vela", "Tomas", "Cassiopeia", "Zev", "Andor",
  "Mace", "Bellatrix", "Juno", "Sirius", "Lex", "Persephone", "Talon", "Ceres", "Rowan", "Gemini",
  "Bram", "Lyric", "Drake", "Estelle", "Gage", "Polaris", "Hugo", "Celestine", "Ivan", "Andara",
  "Jasper", "Nebulae", "Kent", "Oria", "Lars", "Proxima", "Milo", "Quasar", "Nico", "Rhiannon",
  "Owen", "Sable", "Pierce", "Thalassa", "Quincy", "Umbra", "Rafe", "Vaela", "Seth", "Wren",
  "Tobias", "Xara", "Uri", "Yara", "Vaughn", "Zephyr", "Wade", "Alula", "Xavier", "Bryony",
  "Yale", "Cosima", "Zain", "Dione", "Abram", "Eira", "Beckett", "Freya", "Chandler", "Gaia",
  "Declan", "Helia", "Ellis", "Inara", "Felix", "Jorah", "Griffin", "Kaida", "Hayes", "Liora",
  "Idris", "Maeve", "Jensen", "Nessa", "Kellan", "Oona", "Lachlan", "Portia", "Magnus", "Quin",
  "Nash", "Rina", "Oskar", "Seren", "Pax", "Tessa", "Quinlan", "Uma", "Ronan", "Vera",
  "Sterling", "Willa", "Theo", "Xena", "Ulric", "Yael", "Vance", "Zara", "Warrick", "Althea",
  "Xander", "Brielle", "York", "Circe", "Zeke", "Dara", "Alden", "Ember", "Bridger", "Faye",
  "Camden", "Gwen", "Dorian", "Hana", "Emerson", "Isla", "Fletcher", "Jade", "Gideon", "Keira"
];

export const lastNames = [
  "Vex", "Chen", "Rourke", "Fell", "Cross", "Voss", "Steel", "Kane", "Stone", "Drake",
  "Thorne", "Frost", "Wolfe", "Steele", "Stark", "Ash", "Flint", "Graves", "Hunt", "Locke",
  "Mercer", "Nash", "Payne", "Quinn", "Reeves", "Shaw", "Thorn", "Vale", "West", "York",
  "Black", "Cage", "Dane", "Edge", "Fox", "Grey", "Hale", "Irons", "Knox", "Lang",
  "Morse", "North", "Orr", "Pike", "Rhodes", "Slade", "Troy", "Vance", "Ward", "Zane",
  "Archer", "Blake", "Cole", "Dexter", "Ellis", "Ford", "Grant", "Hayes", "Jax", "King",
  "Lane", "Moon", "Noble", "Oakes", "Pierce", "Raven", "Stone", "Tate", "Vega", "Wells",
  "Cross", "Dusk", "Ember", "Forge", "Gale", "Haven", "Iris", "Jade", "Kern", "Light",
  "Mars", "Nova", "Onyx", "Phoenix", "Quill", "Ridge", "Storm", "Titan", "Umbra", "Void",
  "Wren", "Xenon", "Yates", "Zero", "Anders", "Bishop", "Cloud", "Dawn", "Ember", "Frost",
  "Grayson", "Holt", "Ivanov", "Jensen", "Kade", "Lynch", "Monroe", "Nielsen", "Ortiz", "Park",
  "Quinn", "Ramirez", "Silva", "Torres", "Underwood", "Vasquez", "Wagner", "Xi", "Yang", "Zhang",
  "Aldo", "Becker", "Cortez", "Diaz", "Erikson", "Fischer", "Gonzalez", "Hansen", "Iverson", "Jones",
  "Klein", "Lopez", "Martinez", "Novak", "Olsen", "Petrov", "Quinn", "Reyes", "Santos", "Thomson",
  "Ueda", "Volkov", "Wright", "Xu", "Yamamoto", "Zhao", "Alvarez", "Bruno", "Costa", "Dunn",
  "Evans", "Flynn", "Garcia", "Harper", "Ingram", "James", "Kumar", "Lee", "Miller", "Nelson",
  "O'Brien", "Patel", "Quinn", "Robinson", "Smith", "Taylor", "Upton", "Vega", "White", "Young",
  "Adler", "Banner", "Carter", "Dalton", "Everett", "Fuller", "Griffin", "Hudson", "Irving", "Jackson",
  "Kelly", "Lewis", "Mason", "Norton", "Owen", "Porter", "Reed", "Scott", "Turner", "Vincent",
  "Walker", "Xavier", "Young", "Brennan", "Clarke", "Dixon", "Foster", "Graham", "Hughes", "Knight"
];

export const crimeCategories = [
  "Resource theft",
  "Sabotage",
  "Unauthorized reproduction",
  "Black market activity",
  "Sedition",
  "Insubordination",
  "Regulatory violation",
  "Unauthorized access",
  "Contraband possession",
  "Labor violation",
  "Safety breach",
  "Rationing fraud",
  "Identity falsification",
  "Equipment tampering",
  "Unauthorized communication",
  "Medical violation",
  "Population control breach",
  "AI interaction violation",
  "Restricted area access",
  "Environmental violation"
];

export const evidenceTypes = [
  "Security footage",
  "Access logs",
  "Witness testimony",
  "Inventory records",
  "Communications intercept",
  "Biometric data",
  "Maintenance logs",
  "Medical records",
  "Work assignment history",
  "Surveillance data",
  "DNA evidence",
  "Chemical analysis",
  "Digital forensics",
  "Physical evidence",
  "Audio recording",
  "Financial records",
  "Supply manifests",
  "Environmental sensors",
  "Duty roster",
  "Personal logs"
];

export const stationRoles = [
  "Hydroponics Technician",
  "Life Support Engineer",
  "Medical Officer",
  "Communications Specialist",
  "Security Personnel",
  "Maintenance Crew",
  "Sanitation Worker",
  "Food Service",
  "Logistics Coordinator",
  "Research Assistant",
  "Navigation Officer",
  "Power Systems Tech",
  "Waste Recycling",
  "Atmospheric Control",
  "Cargo Handler",
  "Data Analyst",
  "Mechanical Engineer",
  "Biotech Specialist",
  "Systems Administrator",
  "Quality Control",
  "Supply Manager",
  "Environmental Monitor",
  "Structural Engineer",
  "Chemical Processing",
  "Medical Technician",
  "Communications Tech",
  "Security Officer",
  "Hab Module Supervisor",
  "Agricultural Specialist",
  "Water Treatment",
  "Electrical Systems",
  "Propulsion Tech",
  "Radiation Safety",
  "Quarantine Officer",
  "Archive Specialist",
  "Education Coordinator",
  "Recreation Manager",
  "Chaplain Services",
  "Legal Clerk",
  "Administrative Assistant"
];

/**
 * Randomly select N items from an array
 */
export function randomSelect(array, count = 1) {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
