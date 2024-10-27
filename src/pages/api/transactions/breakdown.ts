import { financeService } from '../../../services/financeService';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { type } = req.query;
    
    if (type !== 'income' && type !== 'expense') {
      return res.status(400).json({ message: 'Invalid type parameter' });
    }

    const breakdown = financeService.getCategoryBreakdown(type);
    return res.status(200).json(breakdown);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}