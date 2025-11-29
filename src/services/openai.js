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
} from '../data/gameData';

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_ENDPOINT = import.meta.env.VITE_OPENAI_API_ENDPOINT || 'https://api.openai.com/v1/responses';
const MODEL = import.meta.env.VITE_OPENAI_MODEL || 'gpt-5-nano-2025-08-07';

export async function generateCase(pastCases = [], yearNumber = 1) {
  if (!API_KEY) {
    throw new Error('VITE_OPENAI_API_KEY is not set in environment variables');
  }

  // Randomly select options to inject variety
  const selectedFirstNames = randomSelect(firstNames, 3);
  const selectedLastNames = randomSelect(lastNames, 3);
  const selectedCrimes = randomSelect(crimeCategories, 2);
  const selectedRoles = randomSelect(stationRoles, 3);

  const systemPrompt = `You are a case generator for the Magistrate game. Generate a single prisoner case for a dystopian space station.

The case should include:
- Prisoner name: Choose one first name from [${selectedFirstNames.join(', ')}] and one last name from [${selectedLastNames.join(', ')}]
- Age: Between 18-70
- Role on station: Choose from [${selectedRoles.join(', ')}]
- Crime: (3-8 words) Based on category [${selectedCrimes.join(' or ')}] - be specific and detailed
- Crime Severity: (15-25 words) Emphasize the impact and severity of this crime. Make the player feel the weight of judging incorrectly. Vary the severity appropriately.
- Prosecution Evidence: Array of 2-4 separate pieces of evidence (each 10-25 words). Each should be a distinct file/statement.
- Defense Arguments: Array of 2-4 separate defense points (each 10-25 words). Each should be a distinct file/statement.
- Information Gaps: Array of 2-3 separate missing pieces (each 10-20 words). Each should describe a specific gap in evidence.

Make the case morally ambiguous. The player should feel uncertain.

Return ONLY valid JSON in this exact format:
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
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        input: systemPrompt,
        reasoning: {
          effort: 'minimal',
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('Full API error response:', error);
      console.error('Response status:', response.status, response.statusText);
      throw new Error(`API Error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();

    // Responses API returns output as array: [reasoning, message]
    // Find the message item (type: 'message')
    const messageItem = data.output?.find(item => item.type === 'message');

    if (!messageItem || !messageItem.content) {
      console.error('No message content found in response:', data);
      throw new Error('Invalid API response structure');
    }

    // The content is an array, get the first item's text
    const contentItem = messageItem.content[0];
    const responseText = contentItem.text || contentItem.content || '';

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
    console.error('Error generating case:', error);
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
      crimeSeverity: "Medical supplies are rationed for critical care. This theft could result in preventable deaths if innocent patients are denied treatment.",
      prosecutionEvidence: [
        "Security logs show Vex entering Medical Bay 7 at 03:14 station time without authorization.",
        "Inventory records indicate 12 units of antibiotics missing from secure storage.",
        "Vex has no medical clearance for that sector and cannot justify his presence."
      ],
      defenseArgument: [
        "Vex claims he was repairing a ventilation malfunction in that corridor.",
        "Maintenance logs confirm a work order for that area, though timestamp is illegible.",
        "Vex's daughter had pneumonia last month and he may have been desperate for medicine."
      ],
      informationGaps: [
        "Camera footage for the corridor is corrupted during the relevant time window.",
        "The Medical Bay supervisor is on leave and unavailable for questioning."
      ],
    },
    {
      prisonerName: "Kira Chen",
      age: 28,
      role: "Communications Officer",
      crime: "Seditious speech and mutiny-adjacent activity",
      crimeSeverity: "In confined quarters, sedition can spread rapidly and threaten station stability. Past mutinies have resulted in catastrophic life support failures.",
      prosecutionEvidence: [
        "Three witnesses report Chen made statements questioning Command authority during mess hall conversation.",
        "Transcript includes the phrase 'maybe Command doesn't know what's best for us anymore.'",
        "Chen has access to station-wide communication systems and could spread dissent."
      ],
      defenseArgument: [
        "Chen states she was discussing a historical event from Earth archives, not current station policy.",
        "All three witnesses had been drinking and their accounts differ on specific wording.",
        "Chen has an exemplary service record spanning six years with no prior incidents."
      ],
      informationGaps: [
        "No audio recording exists of the conversation in question.",
        "Chen's personal logs are protected by privacy protocol and unavailable for review."
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

export function generateRetirementSummary(cases) {
  // This will eventually use AI to generate vignettes
  // For now, return structured data
  const completedCases = cases.filter(c => c.verdict !== null);

  const stats = {
    yearsServed: completedCases.length,
    totalCases: completedCases.length,
    released: completedCases.filter(c => c.verdict === 'release').length,
    detained: completedCases.filter(c => c.verdict === 'detain').length,
    airlocked: completedCases.filter(c => c.verdict === 'airlock').length,
  };

  return {
    stats,
    vignettes: [], // Will be generated by AI
    epitaph: '', // Will be generated by AI
  };
}
