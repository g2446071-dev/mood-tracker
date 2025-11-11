document.addEventListener('DOMContentLoaded', () => {
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
        const storedMoods = localStorage.getItem('moods');
        return storedMoods ? JSON.parse(storedMoods) : [];
    }

    // データをlocalStorageに保存する関数
    function saveMoods(moods) {
        localStorage.setItem('moods', JSON.stringify(moods));
    }

    // =======================================================
    // 4. 気分を記録するロジック
    // =======================================================

    moodButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const selectedMood = event.target.getAttribute('data-mood');
            const currentDate = new Date();
            
            const moods = getMoods();
            
            const dateString = `${currentDate.getFullYear()}/${currentDate.getMonth() + 1}/${currentDate.getDate()}`;
            
            const newRecord = {
                date: dateString,
                mood: selectedMood
            };
            
            moods.push(newRecord);
            saveMoods(moods);
            
            alert(`${dateString}の気分を「${event.target.textContent}」として記録しました！`);
        });
    });

    // =======================================================
    // 5. 履歴をリストに表示するロジック
    // =======================================================

    function renderMoods() {
        const moods = getMoods();
        moodList.innerHTML = ''; 

        if (moods.length === 0) {
            moodList.innerHTML = '<li>まだ記録がありません。</li>';
            return;
        }

        moods.slice().reverse().forEach(record => {
            const listItem = document.createElement('li');
            
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
