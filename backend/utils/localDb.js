const fs = require('fs/promises');
const path = require('path');

const mockDbPath = path.join(__dirname, '..', 'mockDb.json');

async function getLocalProposals() {
  try {
    const data = await fs.readFile(mockDbPath, 'utf8');
    const dbObj = JSON.parse(data);
    return dbObj.proposals || [];
  } catch (error) {
    console.error('Error reading mockDb.json:', error);
    return [];
  }
}

async function saveLocalProposal(proposal) {
  try {
    const proposals = await getLocalProposals();
    proposals.push(proposal);

    await fs.writeFile(
      mockDbPath,
      JSON.stringify({ proposals }, null, 2)
    );

    return proposal;
  } catch (error) {
    console.error('Error writing to mockDb.json:', error);
    throw error;
  }
}

module.exports = {
  getLocalProposals,
  saveLocalProposal
};