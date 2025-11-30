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
- Gender: Infer from the first name (male/female/non-binary)
- Role: Choose from [${selectedRoles.join(", ")}]
- Crime: (3-8 words) Category: [${selectedCrimes.join(" or ")}]. Be specific and clear.
- Severity: (8-15 words) Explain the practical impact on the station. What breaks if you get this wrong?
- Prosecution: 2-3 pieces of evidence (5-15 words each). Concrete facts that suggest guilt.
- Defense: 2-3 arguments (5-15 words each). Concrete facts that suggest innocence or mitigation.
- Missing Info: 1-2 gaps (5-15 words each). What key information is unavailable?
- Statement: (OPTIONAL, 10-30 words) A brief statement from the accused - a plea, justification, explanation, or anything they might say if given the opportunity before verdict. This can be left out entirely if it doesn't fit the case or character.
- wasGuilty: CRITICAL - Determine if they actually committed the crime. Aim for roughly 50/50 distribution over many cases (some guilty, some innocent). This creates moral complexity.

The case should have legitimate arguments on both sides. Make the player genuinely uncertain.

IMPORTANT - GUILT DISTRIBUTION:
- wasGuilty should be TRUE roughly 50% of the time (they did commit the crime)
- wasGuilty should be FALSE roughly 50% of the time (they were framed, misunderstood, or innocent)
- The evidence should be ambiguous enough that the player can't easily tell
- Create REAL moral dilemmas where wrong verdicts have serious consequences

Return ONLY valid JSON:
{
  "prisonerName": "string",
  "age": number,
  "gender": "string",
  "role": "string",
  "crime": "string",
  "crimeSeverity": "string",
  "prosecutionEvidence": ["string", "string", ...],
  "defenseArgument": ["string", "string", ...],
  "informationGaps": ["string", "string", ...],
  "accusedStatement": "string or null",
  "wasGuilty": boolean (true if actually guilty, false if innocent - this is the TRUTH that will be revealed at retirement)
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

    console.log('Generated case:', caseData.prisonerName, 'wasGuilty:', caseData.wasGuilty);

    return {
      id: Date.now(),
      year: yearNumber,
      ...caseData,
      verdict: null,
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
      gender: "male",
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
      accusedStatement: "I was fixing the ventilation. I swear I didn't touch anything else. My daughter needed help.",
      wasGuilty: true, // He did steal the medicine for his daughter
    },
    {
      prisonerName: "Kira Chen",
      age: 28,
      gender: "female",
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
      accusedStatement: "I've served this station for six years. I would never betray it. They misunderstood what I said.",
      wasGuilty: false, // She was innocent, discussing history
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

export async function generateRetirementSummary(cases, outcome = null) {
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
      narrative:
        "You retired before judging a single case. History will not remember you.",
    };
  }

  // Calculate judgment accuracy stats from case data
  const innocentsDetained = completedCases.filter(c => !c.wasGuilty && c.verdict === 'detain').length;
  const innocentsKilled = completedCases.filter(c => !c.wasGuilty && c.verdict === 'airlock').length;
  const guiltiesReleased = completedCases.filter(c => c.wasGuilty && c.verdict === 'release').length;

  // Generate AI narrative (single flowing story)
  try {
    const narrative = await generateCareerNarrative(completedCases, stats, outcome);

    return {
      stats: {
        ...stats,
        innocentsDetained,
        innocentsKilled,
        guiltiesReleased
      },
      narrative,
    };
  } catch (error) {
    console.error("Error generating retirement narrative:", error);
    return {
      stats: {
        ...stats,
        innocentsDetained,
        innocentsKilled,
        guiltiesReleased
      },
      narrative:
        "SYSTEM ERROR: Career summary unavailable. Your record remains, but its meaning is lost to corrupted archives.",
    };
  }
}

async function generateCareerNarrative(cases, stats, outcome = null) {
  if (!API_KEY) {
    throw new Error("VITE_OPENAI_API_KEY is not set");
  }

  // Calculate dynamic word count: 15 * years ± 50, min 50, max 450
  const baseWords = stats.yearsServed * 15;
  const minWords = Math.max(50, baseWords - 50);
  const maxWords = Math.min(450, baseWords + 50);

  // Build case summaries for the AI with guilt information
  const caseSummaries = cases
    .map(
      (c, index) =>
        `Case ${index + 1}: ${c.prisonerName}, ${c.age}, ${c.role}. Accused: ${
          c.crime
        }. Your verdict: ${c.verdict.toUpperCase()}. Truth: ${c.wasGuilty ? 'GUILTY' : 'INNOCENT'}.`
    )
    .join("\n");

  const outcomeText = outcome
    ? `\n\nCAREER ENDING: The magistrate ${outcome === 'retired' ? 'retired voluntarily' : outcome === 'died' ? 'died in service' : 'was ousted from their position'}. Reflect this in the narrative appropriately.`
    : '';

  const systemPrompt = `You are writing a career retrospective for a retired Magistrate. This should read like an obituary or a personal reflection - one flowing narrative, not separate sections.${outcomeText}

MAGISTRATE'S CAREER:
- Served ${stats.yearsServed} years
- Judged ${stats.totalCases} cases
- Released: ${stats.released}, Detained: ${stats.detained}, Executed: ${stats.airlocked}

VERDICT MEANINGS (CRITICAL - UNDERSTAND THESE):
- RELEASE: Returned to station population, free to live and work
- DETAIN: Imprisoned (cryo-sleep, isolation, or labor camp) - alive but confined
- AIRLOCK: EXECUTION. Thrown out the airlock into space. DEATH. The person is KILLED.

CASES YOU JUDGED (with the truth revealed):
${caseSummaries}

USE THE TRUTH TO CREATE IRONY AND ADJUST TONE TO MATCH THE RECORD:
- Each case shows the verdict you gave AND whether they were actually guilty or innocent
- TONE MUST MATCH THE SEVERITY OF MISTAKES:
  * If MANY innocents were detained/executed: The narrative should be DAMNING, haunting, focusing on the tragedy
  * If MANY guilty were released: The narrative should focus on chaos and consequences of those crimes
  * If the record is MIXED: Balance between vindication and regret
  * If mostly CORRECT: The narrative can be more neutral or even slightly positive
- Highlight cases where you were RIGHT and where you were WRONG
- Show consequences: innocents executed, guilty set free, etc.
- Let the weight of wrong decisions speak through specific stories
- DO NOT sugarcoat catastrophic records - if this magistrate destroyed innocent lives, the narrative must reflect that horror

RETURN FORMAT - YOU MUST RETURN VALID JSON:
{
  "narrative": "Your ${minWords}-${maxWords} word narrative here with **bold**, *italic*, and\\n\\n> blockquotes\\n\\nand paragraph breaks."
}

CRITICAL - THE NARRATIVE MUST INCLUDE MARKDOWN:
- The narrative string MUST contain actual markdown syntax (**text**, *text*, > quote)
- Use \\n\\n for paragraph breaks (two newlines between paragraphs)
- Use **bold** for key moments (2-4 times)
- Use *italics* for reflection (more liberal)
- Use > blockquotes for impactful statements (1-2 max)

FORMATTING RULES (CRITICAL - READ CAREFULLY):
You MUST use markdown formatting to make the narrative more impactful and readable. Use these formats ONLY:

1. **Bold text** - Use for emphasis on KEY MOMENTS, critical decisions, or striking ironies
   - Syntax: **text here**
   - Example: "**The water technician was released.** She died two years later."

2. *Italic text* - Use for reflections, subtle emphasis, or internal thoughts
   - Syntax: *text here*
   - Example: "Some said lenient, others harsh—*the record shows both.*"

3. Block quotes - Use for official records, testimonies, or particularly impactful statements
   - Syntax: > Quote text here (on its own line)
   - Example:
   > The maintenance logs confirmed a work order for that area, though the timestamp was illegible.

4. Line breaks - Use double line breaks to create dramatic pacing between sections
   - Just use blank lines in your narrative for natural paragraph breaks

FORMATTING GUIDELINES:
- Use bold sparingly (2-4 times per narrative) for maximum impact
- Use italics more liberally for tone and reflection
- Use 1-2 quote blocks maximum for particularly significant statements
- Break your narrative into 3-5 paragraphs with blank lines between them
- DO NOT use headings, lists, code blocks, or links - ONLY bold, italics, and block quotes
- Keep formatting natural and purposeful, not excessive

Write a ${minWords}-${maxWords} word narrative that:

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
- For AIRLOCK verdicts: Make it clear the person DIED. Use phrases like "sent to their death", "never breathed station air again", "the last face they saw", "died in the airlock", "executed for", etc.
- Let outcomes speak for themselves

AVOID:
- Separate sections or bullet points
- Melodrama or emotional manipulation
- Clear guilty/innocent labels
- Saying "vignette" or "case #"
- Euphemizing death for AIRLOCK verdicts - be direct that they were killed

EXAMPLE WITH MARKDOWN (COPY THIS STYLE):
"They served fifteen years. *Some said lenient, others harsh—the record shows both.*

**The water technician was released.** She died in an accident two years later, but the forty liters found in her quarters kept her neighbors alive during the lockdown that followed.

> Records indicated the young engineer, detained for six years on sabotage charges, was innocent. The malfunction he'd been blamed for happened twice more after his imprisonment.

Then there was the supply officer. **Executed at thirty-two for distribution fraud.** The thefts continued after her death, same patterns, different hands. *It emerged she had been covering for someone with higher clearance.*"

Write as flowing prose. Weave statistics and stories together naturally.

CRITICAL: Return ONLY valid JSON in the exact format specified above. The "narrative" field MUST contain markdown formatting (bold, italic, blockquotes, paragraph breaks). Do not include any text outside the JSON structure.`;

  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-5-mini-2025-08-07", // Use gpt-5-mini for better narrative quality
      input: systemPrompt,
      reasoning: {
        effort: "minimal",
      },
      text: {
        verbosity: "low",
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
  const responseText = contentItem.text || contentItem.content || "";

  // Parse the JSON response
  const parsed = JSON.parse(responseText);

  console.log('AI returned narrative:', parsed.narrative);
  console.log('First 200 chars:', parsed.narrative.substring(0, 200));

  return parsed.narrative;
}
