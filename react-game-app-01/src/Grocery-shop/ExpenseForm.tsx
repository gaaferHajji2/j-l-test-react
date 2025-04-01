// import { FormEvent, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import categories from "./categories";
import { useForm } from "react-hook-form";
import { z } from "zod";


let schema = z.object({
  description: z
  .string()
  .min(3, { message: "Description Must Be at Least 3-characters" })
  .max(50, { message: "Description Must Be No More Than 50-characters" }),

  amount: z
    .number({ invalid_type_error: "You must enter Product Amount." })
    .min(10_000, { message: "You must enter value > 1,000." })
    .max(1000_000, { message: "You must enter value < 1,000,000." }),

  category: z.enum(categories, { errorMap: () => ({ message: "Category is Required"})}),
});

type ExpenseFormData = z.infer<typeof schema>;

export type { ExpenseFormData };

interface Props {
  onSubmit: (data: ExpenseFormData) => void;
}

const ExpenseForm = ({ onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    // resetField,
  } = useForm<ExpenseFormData>({ resolver: zodResolver(schema) });

  const handleData = (data: ExpenseFormData) => {
    if (isValid) {
      console.log(data);
      onSubmit(data);
      // data = {};

      // The First Way to Reset The Form Data.
      // resetField("description");
      // resetField("amount");
      // resetField("category");

      // The Second Way to Reset The Form Data.
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleData)}>
      <div className="mb-3">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <input
          type="text"
          className="form-control"
          id="description"
          {...register("description")}
        />
      </div>

      <div>
        {errors.description && (
          <span className="text-danger">{errors.description.message}</span>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="amount" className="form-label">
          Amount
        </label>
        <input
          type="number"
          className="form-control"
          id="amount"
          {...register("amount", { valueAsNumber: true })}
        />
      </div>

      <div>
        {errors.amount && (
          <span className="text-danger">{errors.amount.message}</span>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="category" className="form-label">
          Catgeory
        </label>
        <select className="form-select" id="category" {...register("category")}>
          <option value="">Select A Category</option>
          {categories.map((category) => (
            <option value={category} key={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        {errors.category && (
          <span className="text-danger">{errors.category.message}</span>
        )}
      </div>

      <div className="mb-3">
        <button type="submit" className="btn btn-outline-success">
          Save To J-L-01 Expense List
        </button>
      </div>

    </form>
  );
};

export default ExpenseForm;
