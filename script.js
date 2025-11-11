    // =======================================================
    // 1. 要素の取得
    // =======================================================
    const inputScreen = document.getElementById('mood-input-screen');
    const historyScreen = document.getElementById('history-screen');
    const moodButtons = document.querySelectorAll('.mood-btn');
    const viewHistoryBtn = document.getElementById('view-history-btn');
    const backToInputBtn = document.getElementById('back-to-input-btn');
    const moodList = document.getElementById('mood-list');

    // =======================================================
    // 2. 画面切り替えの関数
    // =======================================================

    // 履歴画面を表示
    viewHistoryBtn.addEventListener('click', () => {
        inputScreen.style.display = 'none';
        historyScreen.style.display = 'block';
        renderMoods(); // 履歴画面に切り替える時にデータを表示する
    });

    // 記録画面に戻る
    backToInputBtn.addEventListener('click', () => {
        historyScreen.style.display = 'none';
        inputScreen.style.display = 'block';
    });

    // =======================================================
    // 3. データの保存と読み込み
    // =======================================================

    // localStorageからデータを読み込む関数
    function getMoods() {
        // localStorageから'moods'というキーでデータを取得
        const storedMoods = localStorage.getItem('moods');
        // JSON.parse()を使って文字列をJavaScriptのオブジェクト（配列）に戻す
        return storedMoods ? JSON.parse(storedMoods) : [];
    }

    // データをlocalStorageに保存する関数
    function saveMoods(moods) {
        // JSON.stringify()を使ってJavaScriptのオブジェクト（配列）を文字列に変換する
        localStorage.setItem('moods', JSON.stringify(moods));
    }

    // =======================================================
    // 4. 気分を記録するロジック
    // =======================================================

    moodButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // クリックされたボタンの'data-mood'属性（good, normal, bad）を取得
            const selectedMood = event.target.getAttribute('data-mood');
            const currentDate = new Date();
            
            // データを配列に追加
            const moods = getMoods();
            
            // 日付をYYYY/MM/DD形式でフォーマット
            const dateString = `${currentDate.getFullYear()}/${currentDate.getMonth() + 1}/${currentDate.getDate()}`;
            
            // 新しい記録オブジェクト
            const newRecord = {
                date: dateString,
                mood: selectedMood
            };
            
            // 記録を追加して保存
            moods.push(newRecord);
            saveMoods(moods);
            
            // 記録が完了したことをユーザーに通知
            alert(`${dateString}の気分を「${event.target.textContent}」として記録しました！`);
        });
    });

    // =======================================================
    // 5. 履歴をリストに表示するロジック
    // =======================================================

    function renderMoods() {
        const moods = getMoods();
        // 一度リストの中身を空にする
        moodList.innerHTML = ''; 

        if (moods.length === 0) {
            moodList.innerHTML = '<li>まだ記録がありません。</li>';
            return;
        }

        // 最新の記録が上に来るように逆順で表示
        moods.slice().reverse().forEach(record => {
            const listItem = document.createElement('li');
            
            // 気分に合わせて表示する日本語テキストを決定
            let moodText = '';
            switch (record.mood) {
                case 'good':
                    moodText = '良い';
                    break;
                case 'normal':
                    moodText = '普通';
                    break;
                case 'bad':
                    moodText = '悪い';
                    break;
            }

            // リストアイテムのHTMLを生成 (CSSのインジケータークラスを使用)
            listItem.innerHTML = `
                <span>${record.date}</span>
                <span style="display: flex; align-items: center;">
                    <span class="mood-indicator ${record.mood}"></span>
                    ${moodText}
                </span>
            `;
            moodList.appendChild(listItem);
        });
    }
});


