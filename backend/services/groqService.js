function normalizeProposalData(rawData) {
  return {
    introduction:
      rawData.introduction ||
      rawData.photographerIntro ||
      rawData.photographer_intro ||
      rawData.intro ||
      rawData.Introduction ||
      '',

    coveragePlan:
      rawData.coveragePlan ||
      rawData.coverage_plan ||
      rawData.coverage ||
      rawData.CoveragePlan ||
      rawData['coverage plan'] ||
      '',

    whatToExpect:
      rawData.whatToExpect ||
      rawData.what_to_expect ||
      rawData.deliverables ||
      rawData.packageDeliverables ||
      rawData.WhatToExpect ||
      rawData['what to expect'] ||
      '',

    preWeddingConcept:
      rawData.preWeddingConcept ||
      rawData.pre_wedding_concept ||
      rawData.preWedding ||
      rawData.concept ||
      rawData.PreWeddingConcept ||
      rawData['pre wedding concept'] ||
      ''
  };
}

async function generateProposalWithGroq(formData) {
  const groqApiKey = process.env.GROQ_API_KEY;

  if (!groqApiKey) {
    throw new Error('Groq API key is not configured. Please check GROQ_API_KEY in .env file.');
  }

  const {
    coupleNames,
    weddingDate,
    venue,
    city,
    events,
    packageType,
    specialRequests
  } = formData;

  const cNames = coupleNames && coupleNames.trim() ? coupleNames.trim() : 'Unnamed Couple';
  const wDate = weddingDate || 'TBD';
  const vVenue = venue && venue.trim() ? venue.trim() : 'TBD Venue';
  const cCity = city && city.trim() ? city.trim() : 'TBD City';
  const eEvents = Array.isArray(events) && events.length > 0 ? events : ['General Coverage'];
  const pType = packageType || 'Premium';
  const sRequests = specialRequests || '';

  const prompt = `
You are a professional luxury wedding photographer and videographer from the studio "thereelshoot".

Generate a personalized wedding photography and videography proposal for:

Couple Names: ${cNames}
Wedding Date: ${wDate}
Venue: ${vVenue}
City: ${cCity}
Events Covered: ${eEvents.join(', ')}
Package Type: ${pType}
Special Requests: ${sRequests || 'None'}

IMPORTANT OUTPUT RULES:
Return ONLY valid JSON.
Do NOT include markdown outside JSON.
Do NOT include explanation outside JSON.
Do NOT wrap the JSON inside code fences.
Use exactly these four keys:
introduction, coveragePlan, whatToExpect, preWeddingConcept

Required JSON format:
{
  "introduction": "string",
  "coveragePlan": "string",
  "whatToExpect": "string",
  "preWeddingConcept": "string"
}

Content requirements:

1. introduction:
- Mention couple names: ${cNames}
- Mention venue: ${vVenue}
- Mention city: ${cCity}
- Mention wedding date: ${wDate}
- Warm, premium, professional tone.
- Around 200 words.

2. coveragePlan:
- Cover every selected event: ${eEvents.join(', ')}.
- For each event, describe:
  - Key moments to capture
  - Photography plan
  - Videography plan
- Use markdown formatting inside this string.

3. whatToExpect:
- Tailor deliverables to package: ${pType}.
- Classic package: essential coverage, digital delivery, 1 photographer, 1 videographer, highlight film.
- Premium package: up to 10 hours, 2 photographers, 2 videographers, cinematic recap film, high-resolution digital gallery.
- Luxury package: unlimited coverage, cinematic feature film, premium album, multi-camera setup, drone coverage, raw footage.
- Use markdown formatting inside this string.

4. preWeddingConcept:
- Include:
  - Concept title
  - Storyline
  - Visual style
  - Outfit recommendations
  - Ideal timing
  - Why it suits ${cNames}
- Use markdown formatting inside this string.
`;

  const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${groqApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content:
            'You are a wedding proposal generator. Always return only valid JSON with exactly these keys: introduction, coveragePlan, whatToExpect, preWeddingConcept.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000,
      response_format: {
        type: 'json_object'
      }
    })
  });

  if (!groqResponse.ok) {
    const errorText = await groqResponse.text();
    throw new Error(errorText);
  }

  const data = await groqResponse.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('Groq returned empty response.');
  }

  console.log('Raw Groq content:', content);

  let parsedData;

  try {
    parsedData = JSON.parse(content);
  } catch (error) {
    console.error('Groq JSON parse error:', error);
    console.error('Raw Groq content:', content);
    throw new Error('Groq response was not valid JSON.');
  }

  const proposalData = normalizeProposalData(parsedData);

  console.log('Final proposal sent to frontend:', proposalData);

  if (
    !proposalData.introduction &&
    !proposalData.coveragePlan &&
    !proposalData.whatToExpect &&
    !proposalData.preWeddingConcept
  ) {
    throw new Error('Groq returned JSON, but it did not contain expected proposal fields.');
  }

  return proposalData;
}

module.exports = {
  generateProposalWithGroq
};