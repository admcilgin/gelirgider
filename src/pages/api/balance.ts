import { financeService } from '../../services/financeService';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const balance = financeService.calculateBalance();
    return res.status(200).json({ balance });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}