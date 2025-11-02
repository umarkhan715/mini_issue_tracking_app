import { Request, Response, NextFunction } from 'express';
import * as issueService from '../services/issueService';

export const createIssue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const issue = await issueService.createIssue(req.body);
        res.status(201).json(issue);
    } catch (err) {
        next(err);
    }
};

export const getIssues = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const issues = await issueService.getIssuesWithFilters(req.query);
        res.status(200).json(issues);
    } catch (err) {
        next(err);
    }
};

export const getIssueById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const issue = await issueService.getIssueById(Number(req.params['id']));
        res.status(200).json(issue);
    } catch (err) {
        next(err);
    }
};

export const updateIssue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const issue = await issueService.updateIssue(Number(req.params['id']), req.body);
        res.status(200).json(issue);
    } catch (err) {
        next(err);
    }
};

export const getIssuesSummary = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const summary = await issueService.getIssuesSummary();
        res.status(200).json(summary);
    } catch (err) {
        next(err);
    }
};

export const deleteIssue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await issueService.deleteIssue(Number(req.params['id']));
        res.status(200).json({ message: 'Issue deleted successfully' });
    } catch (err) {
        next(err);
    }
};
