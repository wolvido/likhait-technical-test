require 'rails_helper'

RSpec.describe Expense, type: :model do
  let(:category) { Category.create!(name: "Food") }

  describe "validations" do
    describe "date validation" do
      it "allows today's date" do
        expense = Expense.new(date: Date.current, amount: 100, description: "Test", category: category)
        expect(expense).to be_valid
      end

      it "allows yesterday's date" do
        expense = Expense.new(date: Date.current - 1.day, amount: 100, description: "Test", category: category)
        expect(expense).to be_valid
      end

      it "allows tomorrow's date (timezone buffer)" do
        expense = Expense.new(date: Date.current + 1.day, amount: 100, description: "Test", category: category)
        expect(expense).to be_valid
      end

      it "rejects dates 2+ days in the future" do
        expense = Expense.new(date: Date.current + 2.days, amount: 100, description: "Test", category: category)
        expect(expense).not_to be_valid
        expect(expense.errors[:date]).to be_present
      end

      it "rejects dates far in the future" do
        expense = Expense.new(date: Date.current + 30.days, amount: 100, description: "Test", category: category)
        expect(expense).not_to be_valid
        expect(expense.errors[:date]).to be_present
      end
    end
  end
end
