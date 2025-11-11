document.addEventListener('DOMContentLoaded', () => {
    // DOM要素の取得
    const moodInputScreen = document.getElementById('mood-input-screen');
    const historyScreen = document.getElementById('history-screen');
    const moodButtons = document.querySelectorAll('.mood-btn');
    const viewHistoryBtn = document.getElementById('view-history-btn');
    const backToInputBtn = document.getElementById('back-to-input-btn');
    const moodList = document.getElementById('mood-list');

    // --- 画面切り替え関数 ---
    const showScreen = (screenToShow) => {
        moodInputScreen.style.display = 'none';
        historyScreen.style.display = 'none';
        screenToShow.style.display = 'block';
    };

    // --- ローカルストレージ操作関数 ---

    // 記録を取得する
    const getMoodHistory = () => {
        const historyJson = localStorage.getItem('moodTrackerHistory');
        // JSON文字列をパースし、存在しない場合は空の配列を返す
        return historyJson ? JSON.parse(historyJson) : [];
    };

    // 記録を保存する
    const saveMood = (mood) => {
        const history = getMoodHistory();
        const now = new Date();
        // YYYY-MM-DD 形式の日付文字列を作成
        const dateString = now.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\//g, '-'); // '2025/11/11' -> '2025-11-11' に変換

        const newEntry = {
            date: dateString,
            mood: mood
        };

        // 新しい記録を履歴の最初に追加（新しいものが上に来るように）
        history.unshift(newEntry); 
        
        // ローカルストレージに保存
        localStorage.setItem('moodTrackerHistory', JSON.stringify(history));
    };

    // --- 履歴表示関数 ---
    const renderHistory = () => {
        const history = getMoodHistory();
        moodList.innerHTML = ''; // リストをクリア

        if (history.length === 0) {
            moodList.innerHTML = '<li>まだ記録がありません。</li>';
            return;
        }

        history.forEach(entry => {
            const listItem = document.createElement('li');
            // 気分の値を日本語に変換して表示
            let moodText = '';
            let moodColor = '';
            
            switch (entry.mood) {
                case 'good':
                    moodText = '良い 😊';
                    moodColor = 'blue';
                    break;
                case 'normal':
                    moodText = '普通 😐';
                    moodColor = '#daa520'; // Gold系の色
                    break;
                case 'bad':
                    moodText = '悪い 😔';
                    moodColor = 'red';
                    break;
                default:
                    moodText = entry.mood;
                    moodColor = 'gray';
            }

            listItem.innerHTML = `**${entry.date}**: <span style="font-weight: bold; color: ${moodColor};">${moodText}</span>`;
            moodList.appendChild(listItem);
        });
    };

    // --- イベントリスナー設定 ---

    // 1. 気分ボタンのクリックイベント
    moodButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const mood = event.target.dataset.mood;
            saveMood(mood);
            alert(`気分「${mood}」を記録しました！`); // 記録完了をユーザーに通知
        });
    });

    // 2. 「記録を見る」ボタンのクリックイベント
    viewHistoryBtn.addEventListener('click', () => {
        renderHistory(); // 履歴をレンダリング
        showScreen(historyScreen); // 履歴画面へ切り替え
    });

    // 3. 「戻る」ボタンのクリックイベント
    backToInputBtn.addEventListener('click', () => {
        showScreen(moodInputScreen); // 入力画面へ切り替え
    });

    // アプリ起動時の初期画面表示 (既に入力画面が表示されている想定)
    // showScreen(moodInputScreen); 
});
