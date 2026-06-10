const { getPool, isMySQLEnabled } = require('../config/db');
const { getLocalProposals, saveLocalProposal } = require('../utils/localDb');
const { generateProposalWithGroq } = require('../services/groqService');

async function generateProposal(req, res) {
  try {
    const proposalData = await generateProposalWithGroq(req.body);
    res.json(proposalData);
  } catch (error) {
    console.error('Generate proposal error:', error.message);

    res.status(500).json({
      error: 'Failed to generate proposal.',
      details: error.message
    });
  }
}

async function saveProposal(req, res) {
  const {
    coupleNames,
    weddingDate,
    venue,
    city,
    events,
    packageType,
    specialRequests,
    theme,
    proposal
  } = req.body;

  if (!proposal) {
    return res.status(400).json({
      error: 'No proposal content to save.'
    });
  }

  const proposalRecord = {
    id: 'prop_' + Date.now(),
    coupleNames: coupleNames && coupleNames.trim() ? coupleNames.trim() : 'Unnamed Couple',
    weddingDate: weddingDate || 'TBD',
    venue: venue && venue.trim() ? venue.trim() : 'Not specified',
    city: city && city.trim() ? city.trim() : 'Not specified',
    events: Array.isArray(events) && events.length > 0 ? events : ['General Coverage'],
    packageType: packageType || 'Standard',
    specialRequests: specialRequests || '',
    theme: theme || 'dark',
    proposal,
    createdAt: new Date().toISOString()
  };

  try {
    if (isMySQLEnabled()) {
      const pool = getPool();

      await pool.query(
        `INSERT INTO proposals
        (id, couple_names, wedding_date, venue, city, events, package_type, special_requests, theme, proposal, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          proposalRecord.id,
          proposalRecord.coupleNames,
          proposalRecord.weddingDate,
          proposalRecord.venue,
          proposalRecord.city,
          JSON.stringify(proposalRecord.events),
          proposalRecord.packageType,
          proposalRecord.specialRequests,
          proposalRecord.theme,
          JSON.stringify(proposalRecord.proposal),
          proposalRecord.createdAt
        ]
      );
    } else {
      await saveLocalProposal(proposalRecord);
    }

    res.status(201).json(proposalRecord);
  } catch (error) {
    console.error('Error saving proposal:', error);

    res.status(500).json({
      error: 'Failed to save proposal to database.'
    });
  }
}

async function getProposals(req, res) {
  try {
    let proposalsList = [];

    if (isMySQLEnabled()) {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM proposals ORDER BY created_at DESC');

      proposalsList = rows.map((row) => {
        let parsedEvents = [];

        try {
          parsedEvents = JSON.parse(row.events);
        } catch (error) {
          parsedEvents = typeof row.events === 'string' ? row.events.split(',') : row.events;
        }

        let parsedProposal = {};

        try {
          parsedProposal = JSON.parse(row.proposal);
        } catch (error) {
          parsedProposal = row.proposal;
        }

        return {
          id: row.id,
          coupleNames: row.couple_names,
          weddingDate: row.wedding_date,
          venue: row.venue,
          city: row.city,
          events: parsedEvents,
          packageType: row.package_type,
          specialRequests: row.special_requests,
          theme: row.theme,
          proposal: parsedProposal,
          createdAt: row.created_at
        };
      });
    } else {
      proposalsList = await getLocalProposals();
      proposalsList.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    }

    res.json(proposalsList);
  } catch (error) {
    console.error('Error fetching proposals:', error);

    res.status(500).json({
      error: 'Failed to retrieve proposal history.'
    });
  }
}

module.exports = {
  generateProposal,
  saveProposal,
  getProposals
};