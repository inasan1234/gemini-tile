class Api::GeminiController < ApplicationController
  require 'googleauth'
  require 'json'

  # Gemini 2.0 APIのURL
  GEMINI_API_KEY = ENV['GEMINI_API_KEY']
  MODEL = "gemini-2.0-flash"
  API_URL = "https://generativelanguage.googleapis.com/v1beta/models/#{MODEL}:generateContent?key=#{GEMINI_API_KEY}"

  def fetch_data
    # APIリクエストの作成
    response = HTTParty.post(API_URL,
      headers: {
        "Content-Type" => "application/json"
      },
      body: {
        contents: [
          {
            role: "user",
            parts: [{ text: params[:input_text] }]
          }
        ],
        generation_config: {
          temperature: 1.0,
          max_output_tokens: 1000,
          # response_mime_type: "application/json"
        }
      }.to_json
    )

    # レスポンスが正常なら結果を返す
    if response.code == 200
      parsed_response = JSON.parse(response.body)

      Rails.logger.info "Gemini API Response: #{parsed_response.inspect}"

      if parsed_response['candidates'] && parsed_response['candidates'][0]['content']['parts'][0]['text']
        render json: { generated_text: parsed_response['candidates'][0]['content']['parts'][0]['text'] }
      else
        render json: { error: "Unexpected response format", details: parsed_response }, status: :unprocessable_entity
      end
    else
      # エラーが発生した場合
      Rails.logger.error "API Request Failed: #{response.body}" # エラーログ
      render json: { error: "API request failed", details: response.body }, status: :unprocessable_entity
    end
  end
end
