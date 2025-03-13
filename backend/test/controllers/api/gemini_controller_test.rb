require "test_helper"

class Api::GeminiControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get api_gemini_index_url
    assert_response :success
  end
end
