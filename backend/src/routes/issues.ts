import express from 'express';
import * as issueController from '../controllers/issueController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.use(authenticateToken);

router.post('/', issueController.createIssue);
router.get('/', issueController.getIssues);
router.get('/summary', issueController.getIssuesSummary);
router.get('/:id', issueController.getIssueById);
router.patch('/:id', issueController.updateIssue);
router.delete('/:id', issueController.deleteIssue);

export default router;