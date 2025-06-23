// wwwroot/js/typing-test.js

// Bu değişkenler Razor sayfasından global olarak tanımlanacak
// const allWords;
// const TEST_DURATION;
// const JsonConvert; // Newtonsoft.Json'ı tarayıcıda kullanmayacağız, doğrudan Model.Words'ü kullanacağız

const WORDS_PER_PAGE = 20; // Her seferinde gösterilecek kelime sayısı

const wordContainer = document.getElementById('word-container');
const inputBox = document.getElementById('input-box');
const timerEl = document.getElementById('timer');
const resultsEl = document.getElementById('results');
const restartBtn = document.getElementById('restart-btn');

let timer;
let timeLeft; // TEST_DURATION initializeTest'te atanacak
let testStarted = false;
let currentWordIndex = 0; // Kullanıcının şu an yazdığı kelimenin genel dizideki indeksi
let correctWordsCount = 0;
let totalChars = 0;
let correctChars = 0;

let currentPageWords = []; // Mevcut sayfada gösterilen kelimeler
let currentPageStartIndex = 0; // Mevcut sayfanın başlangıç indeksi (allWords dizisinde)

// Başlangıçta tüm kelimeler Model.Words'ten gelecek, bu yüzden bu değişkeni
// HTML'de set edeceğiz.
// Örneğin: <script> const allWords = @Html.Raw(JsonConvert.SerializeObject(Model.Words)); </script>
// Bu dosya çalışırken allWords'ün zaten tanımlı olmasını bekliyoruz.

function displayWords() {
    wordContainer.innerHTML = ''; // Önceki kelimeleri temizle
    currentPageWords = allWords.slice(currentPageStartIndex, currentPageStartIndex + WORDS_PER_PAGE);

    if (currentPageWords.length === 0) {
        // Tüm kelimeler bitmişse testi sonlandır
        endTest();
        return;
    }

    currentPageWords.forEach((word, index) => {
        const span = document.createElement('span');
        span.textContent = word + " ";
        // currentWordIndex'in, mevcut kelime setindeki ilk kelime ile eşleşip eşleşmediğini kontrol et
        // Bu kısım, sayfalama yapıldığında ilk kelimenin doğru vurgulanmasını sağlar.
        if (currentWordIndex === currentPageStartIndex + index) {
            span.classList.add('current');
        }
        wordContainer.appendChild(span);
    });

    // Eğer henüz bir kelime seçilmediyse veya sayfa yenilenirse ilk kelimeyi seç
    if (wordContainer.children.length > 0) {
        const currentActiveWord = wordContainer.querySelector('.current');
        if (!currentActiveWord) { // Eğer zaten bir kelime aktif değilse (yani yeni sayfa yüklendiğinde)
            wordContainer.children[0].classList.add('current');
        }
        // Eğer mevcut aktif kelime container'ın dışındaysa onu kaydır
        else if (currentActiveWord && currentActiveWord.offsetParent !== wordContainer) {
            currentActiveWord.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    inputBox.focus();
}

function initializeTest() {
    clearInterval(timer);
    timeLeft = TEST_DURATION; // TEST_DURATION, HTML sayfasından set edilecek
    testStarted = false;
    currentWordIndex = 0;
    correctWordsCount = 0;
    totalChars = 0;
    correctChars = 0;
    currentPageStartIndex = 0; // Test başladığında ilk sayfadan başla

    timerEl.textContent = `${Math.floor(TEST_DURATION / 60).toString().padStart(1, '0')}:${(TEST_DURATION % 60).toString().padStart(2, '0')}`;
    resultsEl.innerHTML = '';
    resultsEl.classList.remove('visible');
    inputBox.value = '';
    inputBox.disabled = false;

    displayWords(); // İlk 20 kelimeyi göster
}

inputBox.addEventListener('input', (e) => {
    if (!testStarted && inputBox.value.length > 0) {
        startTimer();
        testStarted = true;
    }

    // currentPageWords'deki doğru indeksi bulmak için
    const relativeCurrentWordIndex = currentWordIndex - currentPageStartIndex;
    const currentWordSpan = wordContainer.children[relativeCurrentWordIndex];
    if (!currentWordSpan) {
        // Tüm kelimeler bitmişse veya bir hata oluştuysa
        // Eğer tüm kelimeler yazıldıysa ve testi bitirmeliyiz
        if (currentWordIndex >= allWords.length) {
            endTest();
        }
        return;
    }

    const typedValue = inputBox.value;
    const actualCurrentWord = allWords[currentWordIndex]; // Genel dizideki kelime

    // Kullanıcı boşluk tuşuna bastığında kelimeyi kontrol et
    if (typedValue.endsWith(' ')) {
        const typedWord = typedValue.trim();

        totalChars += (actualCurrentWord.length + 1); // boşluk dahil

        if (typedWord === actualCurrentWord) {
            currentWordSpan.classList.remove('incorrect-char'); // Yanlış karakter vurgusunu kaldır
            currentWordSpan.classList.add('correct');
            correctWordsCount++;
            correctChars += (actualCurrentWord.length + 1);
        } else {
            currentWordSpan.classList.add('incorrect');
        }

        currentWordSpan.classList.remove('current');
        currentWordIndex++; // Genel kelime indeksini ilerlet

        inputBox.value = ''; // Input kutusunu temizle

        // Yeni kelimeyi vurgula veya yeni sayfa yükle
        // Eğer mevcut sayfa kelimelerinin sonuna geldiysek veya sona yaklaştıysak
        if (currentWordIndex % WORDS_PER_PAGE === 0 && currentWordIndex < allWords.length) {
            // Yeni bir sayfa yükle
            currentPageStartIndex = currentWordIndex;
            displayWords();
        } else if (currentWordIndex < allWords.length) {
            // Aynı sayfa içinde bir sonraki kelimeye geç
            const nextWordSpan = wordContainer.children[currentWordIndex - currentPageStartIndex];
            if (nextWordSpan) { // Hata önleme
                nextWordSpan.classList.add('current');
                nextWordSpan.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else {
            // Tüm kelimeler bitmişse testi sonlandır
            endTest();
        }

    } else {
        // Yazarken anlık geri bildirim
        let isMatch = true;
        if (typedValue.length > actualCurrentWord.length) { // Fazla karakter yazıldıysa yanlış
            isMatch = false;
        } else {
            for (let i = 0; i < typedValue.length; i++) {
                if (typedValue[i] !== actualCurrentWord[i]) {
                    isMatch = false;
                    break;
                }
            }
        }

        if (isMatch) {
            currentWordSpan.classList.remove('incorrect-char');
        } else {
            currentWordSpan.classList.add('incorrect-char');
        }
    }
});

// Boşluk dışındaki tuş basışlarında da karakter bazlı doğruluk kontrolü yapabiliriz
inputBox.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace') {
        const relativeCurrentWordIndex = currentWordIndex - currentPageStartIndex;
        const currentWordSpan = wordContainer.children[relativeCurrentWordIndex];
        if (currentWordSpan) {
            // Backspace'e basıldığında, anlık hata vurgusunu kaldır
            currentWordSpan.classList.remove('incorrect-char');
            // Eğer kelime doğru yazılmış ve silinmeye başlanmışsa correct/incorrect sınıflarını kaldır
            if (currentWordSpan.classList.contains('correct') || currentWordSpan.classList.contains('incorrect')) {
                currentWordSpan.classList.remove('correct', 'incorrect');
                // current sınıfını tekrar ekle (eğer otomatik olarak eklenmiyorsa)
                currentWordSpan.classList.add('current');
            }
        }
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
    // WPM hesaplaması genellikle (doğru yazılan karakter sayısı / 5) / geçen dakika olarak hesaplanır.
    const grossWpm = (correctChars / 5) / (TEST_DURATION / 60);
    const accuracy = totalChars > 0 ? ((correctChars / totalChars) * 100).toFixed(2) : 0;

    resultsEl.innerHTML = `
        <h2>Test Bitti!</h2>
        <p>Sürət: <strong>${Math.round(grossWpm)} WPM</strong></p>
        <p>Dəqiqlik: <strong>${accuracy}%</strong></p>
        <p>Doğru/Yanlış Söz: <strong>${correctWordsCount}/${currentWordIndex - correctWordsCount}</strong></p>
    `;
    resultsEl.classList.add('visible');
}

restartBtn.addEventListener('click', initializeTest);
initializeTest(); // Sayfa yüklendiğinde testi başlat