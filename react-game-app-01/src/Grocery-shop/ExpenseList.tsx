
interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
}

interface Props {
  expenses: Expense[];

  onDelete: (id: number) => void;
}

const ExpenseList = ({ expenses, onDelete }: Props) => {
    if(expenses.length == 0) return <p>Jafar-Loka-01 List is Empty Now 😁😋😋🤣🤣</p>
    return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th className="text-center">ID</th>
          <th>Description</th>
          <th>Category</th>
          <th>Amount</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {expenses.map((expense) => (
          <tr key={expense.id}>
            <td className="text-center">{expense.id}</td>
            <td>{expense.description}</td>
            <td>{expense.category}</td>
            <td>{expense.amount}</td>
            <td>
              <button
                className="btn btn-danger"
                onClick={() => onDelete(expense.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>

      <tfoot>
        <tr>
          <td colSpan={2} className="text-center">Total</td>
          <td colSpan={3} className="text-center">
            $
            {expenses
              .reduce((acc, expense) => acc + expense.amount, 0)
              .toFixed(2)}
          </td>
        </tr>
      </tfoot>
    </table>
  );
};

export default ExpenseList;
