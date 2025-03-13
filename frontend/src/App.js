import { useEffect, useState, useRef } from 'react'
import './App.css';
import ReactMarkdown from 'react-markdown'

function App() {
  //
  // ページがロードされたときにサーバーのヘルスチェックを行う
  //
  useEffect(() => {
    fetch('http://localhost:3000/api/health_check')
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error('Error:', error))
  }, [])

  //
  // テキスト生成機能
  //
  const [inputText, setInputText] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  // ユーザーの入力に基づいてAPIリクエストを送信する関数
  const handleSubmit = () => {
    setLoading(true);
    fetch('http://localhost:3000/api/gemini/fetch_data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input_text: inputText }),
    })
      .then(response => response.json())
      .then(data => {
        setGeneratedText(data.generated_text);  // APIから返ってきた結果を表示
        setLoading(false);
        setInputText(''); // テキストボックスをクリア
        inputRef.currebt.value = ''; // テキストボックスをクリア
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  };

  const [composing, setComposition] = useState(false);
  const startComposition = () => setComposition(true);
  const endComposition = () => setComposition(false);

  // Enterキーでフォームを送信
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if(!composing) handleSubmit();
    }
  };



  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Gemini Tile</h1>
      </header>

      <div className="generated-content">
        {generatedText && (
          <div>
            <h2>Generated Text:</h2>
            <ReactMarkdown>{generatedText}</ReactMarkdown>
          </div>
        )}
      </div>

      <div className="input-container">
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onCompositionStart={startComposition}
          onCompositionEnd={endComposition}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text"
          onKeyDown={handleKeyDown} // Enterキーでフォームを送信
        />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </div>
    </div>
  );
}

export default App
