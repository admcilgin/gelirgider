import { financeService } from '../../../services/financeService';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { year, month } = req.query;
    
    if (!year || !month) {
      return res.status(400).json({ message: 'Year and month are required' });
    }

    const analytics = financeService.getMonthlyAnalytics(
      parseInt(year as string),
      parseInt(month as string)
    );

    return res.status(200).json(analytics);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}