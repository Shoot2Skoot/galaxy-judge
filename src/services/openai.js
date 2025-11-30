/**
 * OpenAI Responses API Integration
 * IMPORTANT: Uses Responses API (https://api.openai.com/v1/responses)
 * NOT ChatCompletions API
 * Model: gpt-5-nano ONLY
 */

import {
  firstNames,
  lastNames,
  crimeCategories,
  stationRoles,
  randomSelect,
} from "../data/gameData";

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_ENDPOINT =
  import.meta.env.VITE_OPENAI_API_ENDPOINT ||
  "https://api.openai.com/v1/responses";
const MODEL = import.meta.env.VITE_OPENAI_MODEL || "gpt-5-nano-2025-08-07";

export async function generateCase(pastCases = [], yearNumber = 1) {
  if (!API_KEY) {
    throw new Error("VITE_OPENAI_API_KEY is not set in environment variables");
  }

  // Randomly select options to inject variety
  const selectedFirstNames = randomSelect(firstNames, 3);
  const selectedLastNames = randomSelect(lastNames, 3);
  const selectedCrimes = randomSelect(crimeCategories, 2);
  const selectedRoles = randomSelect(stationRoles, 3);

  const systemPrompt = `You are generating cases for Magistrate - a game about judging people on a space station with incomplete information.

WRITING STYLE: "TV sci-fi" - accessible like The Expanse or Battlestar Galactica. Clear, concrete, understandable to average viewers. Avoid jargon. Use specific details instead of technical terms.

IMPACT WITHOUT MELODRAMA:
- Focus on systemic consequences (affects food rations for 300 people, last oxygen shipment for 6 months)
- Station-specific scarcity (medical supplies, water recycling, power grid)
- Practical cascading effects (one theft creates 5 more problems)
- NOT: dying children, sick relatives, emotional manipulation
- YES: concrete stakes that feel real and constrained

Generate a case with:
- Name: Choose from [${selectedFirstNames.join(", ")}] and [${selectedLastNames.join(", ")}]
- Age: 18-70
- Role: Choose from [${selectedRoles.join(", ")}]
- Crime: (3-8 words) Category: [${selectedCrimes.join(" or ")}]. Be specific and clear.
- Severity: (8-15 words) Explain the practical impact on the station. What breaks if you get this wrong?
- Prosecution: 2-3 pieces of evidence (5-15 words each). Concrete facts that suggest guilt.
- Defense: 2-3 arguments (5-15 words each). Concrete facts that suggest innocence or mitigation.
- Missing Info: 1-2 gaps (5-15 words each). What key information is unavailable?

The case should have legitimate arguments on both sides. Make the player genuinely uncertain.

Return ONLY valid JSON:
{
  "prisonerName": "string",
  "age": number,
  "role": "string",
  "crime": "string",
  "crimeSeverity": "string",
  "prosecutionEvidence": ["string", "string", ...],
  "defenseArgument": ["string", "string", ...],
  "informationGaps": ["string", "string", ...]
}`;

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        input: systemPrompt,
        reasoning: {
          effort: "minimal",
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error("Full API error response:", error);
      console.error("Response status:", response.status, response.statusText);
      throw new Error(`API Error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();

    // Responses API returns output as array: [reasoning, message]
    // Find the message item (type: 'message')
    const messageItem = data.output?.find((item) => item.type === "message");

    if (!messageItem || !messageItem.content) {
      console.error("No message content found in response:", data);
      throw new Error("Invalid API response structure");
    }

    // The content is an array, get the first item's text
    const contentItem = messageItem.content[0];
    const responseText = contentItem.text || contentItem.content || "";

    const caseData = JSON.parse(responseText);

    return {
      id: Date.now(),
      year: yearNumber,
      ...caseData,
      verdict: null,
      wasGuilty: null, // Unknown until retirement
      consequence: null,
    };
  } catch (error) {
    console.error("Error generating case:", error);
    // Fallback case if API fails
    return generateFallbackCase(yearNumber);
  }
}

function generateFallbackCase(yearNumber) {
  const fallbacks = [
    {
      prisonerName: "Amos Vex",
      age: 42,
      role: "Hydroponics Technician",
      crime: "Theft of medical supplies",
      crimeSeverity:
        "Medical supplies are rationed for critical care. This theft could result in preventable deaths if innocent patients are denied treatment.",
      prosecutionEvidence: [
        "Security logs show Vex entering Medical Bay 7 at 03:14 station time without authorization.",
        "Inventory records indicate 12 units of antibiotics missing from secure storage.",
        "Vex has no medical clearance for that sector and cannot justify his presence.",
      ],
      defenseArgument: [
        "Vex claims he was repairing a ventilation malfunction in that corridor.",
        "Maintenance logs confirm a work order for that area, though timestamp is illegible.",
        "Vex's daughter had pneumonia last month and he may have been desperate for medicine.",
      ],
      informationGaps: [
        "Camera footage for the corridor is corrupted during the relevant time window.",
        "The Medical Bay supervisor is on leave and unavailable for questioning.",
      ],
    },
    {
      prisonerName: "Kira Chen",
      age: 28,
      role: "Communications Officer",
      crime: "Seditious speech and mutiny-adjacent activity",
      crimeSeverity:
        "In confined quarters, sedition can spread rapidly and threaten station stability. Past mutinies have resulted in catastrophic life support failures.",
      prosecutionEvidence: [
        "Three witnesses report Chen made statements questioning Command authority during mess hall conversation.",
        "Transcript includes the phrase 'maybe Command doesn't know what's best for us anymore.'",
        "Chen has access to station-wide communication systems and could spread dissent.",
      ],
      defenseArgument: [
        "Chen states she was discussing a historical event from Earth archives, not current station policy.",
        "All three witnesses had been drinking and their accounts differ on specific wording.",
        "Chen has an exemplary service record spanning six years with no prior incidents.",
      ],
      informationGaps: [
        "No audio recording exists of the conversation in question.",
        "Chen's personal logs are protected by privacy protocol and unavailable for review.",
      ],
    },
  ];

  const caseData = fallbacks[Math.floor(Math.random() * fallbacks.length)];

  return {
    id: Date.now(),
    year: yearNumber,
    ...caseData,
    verdict: null,
    wasGuilty: null,
    consequence: null,
  };
}

export async function generateRetirementSummary(cases) {
  const completedCases = cases.filter((c) => c.verdict !== null);

  const stats = {
    yearsServed: completedCases.length,
    totalCases: completedCases.length,
    released: completedCases.filter((c) => c.verdict === "release").length,
    detained: completedCases.filter((c) => c.verdict === "detain").length,
    airlocked: completedCases.filter((c) => c.verdict === "airlock").length,
  };

  // If no cases, return empty summary
  if (completedCases.length === 0) {
    return {
      stats,
      vignettes: [],
      epitaph:
        "You retired before judging a single case. History will not remember you.",
    };
  }

  // Generate AI narrative (single flowing story)
  try {
    const narrative = await generateCareerNarrative(completedCases, stats);

    return {
      stats,
      narrative,
    };
  } catch (error) {
    console.error("Error generating retirement narrative:", error);
    return {
      stats,
      narrative:
        "SYSTEM ERROR: Career summary unavailable. Your record remains, but its meaning is lost to corrupted archives.",
    };
  }
}

async function generateCareerNarrative(cases, stats) {
  if (!API_KEY) {
    throw new Error("VITE_OPENAI_API_KEY is not set");
  }

  // Build case summaries for the AI
  const caseSummaries = cases
    .map(
      (c, index) =>
        `Case ${index + 1}: ${c.prisonerName}, ${c.age}, ${c.role}. Accused: ${
          c.crime
        }. Your verdict: ${c.verdict.toUpperCase()}.`
    )
    .join("\n");

  const systemPrompt = `You are writing a career retrospective for a retired Magistrate. This should read like an obituary or a personal reflection - one flowing narrative, not separate sections.

MAGISTRATE'S CAREER:
- Served ${stats.yearsServed} years
- Judged ${stats.totalCases} cases
- Released: ${stats.released}, Detained: ${stats.detained}, Executed: ${stats.airlocked}

CASES YOU JUDGED:
${caseSummaries}

Write a 200-350 word narrative that:

STRUCTURE:
- Opens with how they're remembered (their legacy/reputation)
- Weaves in 3-6 specific case stories naturally throughout the text
- Each case story: 2-4 sentences about what happened after your verdict
- Closes with a reflection on what their career meant

TONE:
- Personal but detached, like reading someone's career summary years later
- Obituary-style - factual but haunting
- NOT a list, NOT bureaucratic sections
- Flow naturally between overview and specific stories

NUANCED TRUTH:
- Don't say "guilty" or "innocent" explicitly
- Use: "turned out", "later showed", "it emerged that", "records indicated"
- Focus on consequences and irony, not moral judgments
- Let outcomes speak for themselves

AVOID:
- Separate sections or bullet points
- Melodrama or emotional manipulation
- Clear guilty/innocent labels
- Saying "vignette" or "case #"

EXAMPLE TONE:
"They served fifteen years. Some said lenient, others harsh - the record shows both. There was the water technician accused of hoarding. Released. She died in an accident two years later, but the forty liters in her quarters kept her neighbors alive during the lockdown. Then the young engineer charged with sabotage. Detained for six years. The malfunction he'd been blamed for happened twice more after. Still, he never returned to engineering work..."

Write as flowing prose. Weave statistics and stories together naturally.

Return ONLY the narrative text, no JSON, no formatting, no section headers.`;

  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      input: systemPrompt,
      reasoning: {
        effort: "high",
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`API Error: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  const messageItem = data.output?.find((item) => item.type === "message");

  if (!messageItem || !messageItem.content) {
    throw new Error("Invalid API response structure");
  }

  const contentItem = messageItem.content[0];
  return contentItem.text || contentItem.content || "";
}
