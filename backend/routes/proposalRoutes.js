const express = require('express');

const {
  generateProposal,
  saveProposal,
  getProposals
} = require('../controllers/proposalController');

const router = express.Router();

router.post('/generate', generateProposal);
router.post('/proposals', saveProposal);
router.get('/proposals', getProposals);

module.exports = router;