import { financeService } from '../../../services/financeService';

export default function handler(req, res) {
  try {
    switch (req.method) {
      case 'GET':
        const transactions = financeService.getAllTransactions();
        return res.status(200).json(transactions);

      case 'POST':
        const newTransaction = financeService.addTransaction(req.body);
        return res.status(201).json(newTransaction);

      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}