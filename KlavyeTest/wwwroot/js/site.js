// wwwroot/js/site.js

// Bu değişkenler Razor sayfasından global olarak tanımlanacak:
// const allWords;
// const TEST_DURATION;
// const isLoggedIn;

const wordContainer = document.getElementById('word-container');
const inputBox = document.getElementById('input-box');
const timerEl = document.getElementById('timer');
const resultsEl = document.getElementById('results');
const restartBtn = document.getElementById('restart-btn');

let timer;
let timeLeft;
let testStarted = false;
let currentWordIndex = 0;
let correctWordsCount = 0;
// YENİ: Vuruş (keystroke) sayaçları
let keystrokesCorrect = 0;
let keystrokesIncorrect = 0;

function initializeTest() {
    clearInterval(timer);
    timeLeft = TEST_DURATION;
    testStarted = false;
    currentWordIndex = 0;
    correctWordsCount = 0;
    // YENİ: Sayaçları sıfırla
    keystrokesCorrect = 0;
    keystrokesIncorrect = 0;

    timerEl.textContent = `${Math.floor(timeLeft / 60).toString().padStart(1, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`;
    resultsEl.innerHTML = '';
    resultsEl.classList.remove('visible');
    inputBox.value = '';
    inputBox.disabled = false;

    displayWords();
}

function displayWords() {
    wordContainer.innerHTML = '';
    // Kelimeleri allWords dizisinden alıyoruz (sayfalama şimdilik basitleştirildi)
    allWords.forEach(word => {
        const span = document.createElement('span');
        span.textContent = word + " ";
        wordContainer.appendChild(span);
    });
    if (wordContainer.children.length > 0) {
        wordContainer.children[0].classList.add('current');
    }
    inputBox.focus();
}

inputBox.addEventListener('input', (e) => {
    if (!testStarted) {
        startTimer();
        testStarted = true;
    }

    const currentWordSpan = wordContainer.children[currentWordIndex];
    const typedValue = inputBox.value;

    if (typedValue.endsWith(' ')) {
        const typedWord = typedValue.trim();
        const actualWord = allWords[currentWordIndex];

        if (typedWord === actualWord) {
            currentWordSpan.classList.add('correct');
            correctWordsCount++;
            // YENİ: Doğru vuruşları say (kelime + boşluk)
            keystrokesCorrect += actualWord.length + 1;
        } else {
            currentWordSpan.classList.add('incorrect');
            // YENİ: Yanlış vuruşları say
            keystrokesIncorrect += actualWord.length + 1;
        }

        currentWordSpan.classList.remove('current');
        currentWordIndex++;

        if (currentWordIndex < allWords.length) {
            wordContainer.children[currentWordIndex].classList.add('current');
        } else {
            endTest(); // Bütün kelimeler biterse testi bitir
        }
        inputBox.value = '';

    } else {
        // YENİ: Yazarken anlık vuruş kontrolü (basit haliyle)
        // Her tuşa basıldığında bir vuruş sayılır. Kelime sonunda doğru/yanlış olarak tasnif edilir.
        // Daha detaylı bir vuruş sayımı için her karakteri kontrol etmek gerekir,
        // bu versiyon basit ve etkilidir.
    }
});

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerEl.textContent = `${minutes.toString().padStart(1, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (timeLeft <= 0) {
            endTest();
        }
    }, 1000);
}

function endTest() {
    clearInterval(timer);
    inputBox.disabled = true;

    // Test sonuçlarının hesaplanması
    const incorrectWordsCount = currentWordIndex - correctWordsCount;
    // DKS (WPM) hesaplaması: (Doğru yazılan karakter sayısı / 5) / geçen dakika
    const wpm = (keystrokesCorrect / 5) / (TEST_DURATION / 60);
    const accuracy = (keystrokesCorrect + keystrokesIncorrect) > 0 ? (keystrokesCorrect / (keystrokesCorrect + keystrokesIncorrect) * 100) : 0;

    resultsEl.innerHTML = `
        <h2>Test Bitti!</h2>
        <p>Sürət: <strong>${Math.round(wpm)} DKS</strong></p>
        <p>Dəqiqlik: <strong>${accuracy.toFixed(1)}%</strong></p>
        <p>Doğru/Yanlış Söz: <strong>${correctWordsCount}/${incorrectWordsCount}</strong></p>
    `;
    resultsEl.classList.add('visible');

    // DEĞİŞİKLİK: Test bitiminde skoru kaydetmek için ana fonksiyonu çağırıyoruz.
    onTestFinish(correctWordsCount, incorrectWordsCount, TEST_DURATION, keystrokesCorrect, keystrokesIncorrect);
}

restartBtn.addEventListener('click', initializeTest);

// Sayfa ilk yüklendiğinde testi hazırla
initializeTest();


// YENİ: AŞAĞIDAKİ FONKSİYONLAR .CSHTML'DEN BURAYA TAŞINDI
//================================================================

// Skoru sunucuya gönderen fonksiyon
function saveScoreToServer(scoreData) {
    // isLoggedIn değişkeni, Index.cshtml sayfasından global olarak tanımlanmalıdır.
    if (!isLoggedIn) {
        console.log("Kullanıcı giriş yapmamış. Skor kaydedilmeyecek.");
        return;
    }

    fetch("/Test/SaveScore", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // CSRF token'ı gerekiyorsa buraya eklenmelidir.
        },
        body: JSON.stringify(scoreData)
    }).then(res => {
        if (res.ok) {
            console.log("Skor başarıyla kaydedildi.");
            // İsteğe bağlı: Liderlik tablosunu yenile
            // window.location.reload(); 
        } else {
            console.error("Skor kaydedilemedi. Sunucu hatası.");
        }
    }).catch(error => {
        console.error("Skor gönderilirken bir ağ hatası oluştu:", error);
    });
}

// Test bitiminde çağrılan ve verileri toplayan ana fonksiyon
function onTestFinish(wordCount, incorrectWordCount, duration, correctKeys, incorrectKeys) {
    const scoreData = {
        WordCount: wordCount,
        IncorrectWordCount: incorrectWordCount,
        DurationSeconds: duration,
        KeystrokesCorrect: correctKeys,
        KeystrokesIncorrect: incorrectKeys,
        IsCompetition: false // Bu değeri ihtiyaca göre dinamik yapabilirsiniz
    };

    // Verileri sunucuya göndermek için ilgili fonksiyonu çağır
    saveScoreToServer(scoreData);
}