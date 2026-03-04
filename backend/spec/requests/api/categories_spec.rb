require 'rails_helper'

RSpec.describe "Api::Categories", type: :request do
  describe "GET /api/categories" do
    let!(:food) { Category.create!(name: "Food") }
    let!(:transport) { Category.create!(name: "Transport") }
    let!(:supplies) { Category.create!(name: "Supplies") }

    it "returns all categories" do
      get "/api/categories"

      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json.length).to eq(3)
      expect(json.map { |c| c["name"] }).to include("Food", "Transport", "Supplies")
    end

    it "returns categories in alphabetical order" do
      get "/api/categories"

      json = JSON.parse(response.body)
      expect(json.map { |c| c["name"] }).to eq([ "Food", "Supplies", "Transport" ])
    end
  end

  describe "POST /api/categories" do
    context "with valid parameters" do
      let(:valid_params) { { category: { name: "Entertainment" } } }

      it "creates a new category" do
        expect {
          post "/api/categories", params: valid_params
        }.to change(Category, :count).by(1)
      end

      it "returns the created category" do
        post "/api/categories", params: valid_params

        expect(response).to have_http_status(:created)
        json = JSON.parse(response.body)
        expect(json["name"]).to eq("Entertainment")
      end
    end

    context "with invalid parameters" do
      let(:invalid_params) { { category: { name: "" } } }

      it "does not create a category" do
        expect {
          post "/api/categories", params: invalid_params
        }.not_to change(Category, :count)
      end

      it "returns error messages" do
        post "/api/categories", params: invalid_params

        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json["errors"]).to be_present
      end
    end

    context "with duplicate name" do
      let!(:existing_category) { Category.create!(name: "Food") }
      let(:duplicate_params) { { category: { name: "Food" } } }

      it "does not create a duplicate category" do
        expect {
          post "/api/categories", params: duplicate_params
        }.not_to change(Category, :count)
      end

      it "returns error messages" do
        post "/api/categories", params: duplicate_params

        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json["errors"]).to be_present
      end
    end
  end
end
