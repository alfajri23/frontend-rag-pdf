(function() {
    // URL Endpoint Backend Anda
    // GANTI URL INI DENGAN URL ENDPOINT ANDA YANG SEBENARNYA
    const BACKEND_ENDPOINT = 'http://localhost:5000/chat';

    // 1. Definisikan CSS sebagai string (termasuk style untuk loading)
    const chatbotCSS = `
        :root {
            --chatbot-primary-color: #007bff;
            --chatbot-bg-color: #ffffff;
            --chatbot-text-color: #000000;
            --chatbot-header-bg: #f1f1f1;
        }
        #my-chatbot-container { position: fixed; bottom: 30px; right: 30px; z-index: 9999; }
        #my-chatbot-container .chatbot-toggle { width: 60px; height: 60px; background-color: var(--chatbot-primary-color); color: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.2); transition: transform 0.3s ease; }
        #my-chatbot-container .chat-window { width: 350px; max-height: 460px; background-color: var(--chatbot-bg-color); border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); overflow: hidden; display: flex; flex-direction: column; position: absolute; bottom: 80px; right: 0; opacity: 0; transform: scale(0.5); transform-origin: bottom right; transition: opacity 0.3s ease, transform 0.3s ease; pointer-events: none; }
        #my-chatbot-container.open .chat-window { opacity: 1; transform: scale(1); pointer-events: auto; }
        #my-chatbot-container .chat-header { padding: 15px; background-color: var(--chatbot-header-bg); display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ddd; }
        #my-chatbot-container .chat-header h3 { margin: 0; font-size: 1.1em; }
        #my-chatbot-container .chat-close { background: none; border: none; font-size: 1.5em; cursor: pointer; }
        #my-chatbot-container .chat-body { flex-grow: 1; padding: 15px; overflow-y: auto; background-color: #f9f9f9; display: flex; flex-direction: column; }
        #my-chatbot-container .message { padding: 10px 15px; border-radius: 20px; margin-bottom: 10px; max-width: 80%; line-height: 1.4; }
        #my-chatbot-container .message.bot { background-color: #e9e9eb; align-self: flex-start; }
        #my-chatbot-container .message.user { background-color: var(--chatbot-primary-color); color: white; align-self: flex-end; }
        #my-chatbot-container .chat-footer { display: flex; padding: 10px; border-top: 1px solid #ddd; }
        #my-chatbot-container #chat-input { flex-grow: 1; border: 1px solid #ccc; border-radius: 20px; padding: 10px 15px; margin-right: 10px; }
        #my-chatbot-container #send-btn { background-color: var(--chatbot-primary-color); color: white; border: none; padding: 10px 20px; border-radius: 20px; cursor: pointer; }
        #my-chatbot-container .message.loading { padding: 15px; align-self: flex-start; }
        #my-chatbot-container .message.loading span { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #888; margin: 0 1px; animation: blink 1.4s infinite both; }
        #my-chatbot-container .message.loading span:nth-child(2) { animation-delay: 0.2s; }
        #my-chatbot-container .message.loading span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes blink { 0% { opacity: 0.2; } 20% { opacity: 1; } 100% { opacity: 0.2; } }
    `;

    // 2. Definisikan HTML sebagai string
    const chatbotHTML = `
        <div class="chatbot-toggle">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </div>
        <div class="chat-window">
            <div class="chat-header"><h3>Chat with AI</h3><button class="chat-close">&times;</button></div>
            <div class="chat-body"><div class="message bot">Halo! Ingin cari tau apa?</div></div>
            <div class="chat-footer"><input type="text" id="chat-input" placeholder="Ketik pesanmu..."><button id="send-btn">Kirim</button></div>
        </div>
    `;

    // 3. Injeksi CSS dan HTML
    const styleElement = document.createElement('style');
    styleElement.textContent = chatbotCSS;
    document.head.appendChild(styleElement);

    const chatbotContainer = document.createElement('div');
    chatbotContainer.id = 'my-chatbot-container';
    chatbotContainer.innerHTML = chatbotHTML;
    document.body.appendChild(chatbotContainer);

    // 4. Ambil elemen-elemen DOM
    const toggleButton = chatbotContainer.querySelector('.chatbot-toggle');
    const closeButton = chatbotContainer.querySelector('.chat-close');
    const sendButton = chatbotContainer.querySelector('#send-btn');
    const chatInput = chatbotContainer.querySelector('#chat-input');
    const chatBody = chatbotContainer.querySelector('.chat-body');

    // 5. Fungsionalitas
    const toggleChatWindow = () => {
        chatbotContainer.classList.toggle('open');
    };
    
    toggleButton.addEventListener('click', toggleChatWindow);
    closeButton.addEventListener('click', toggleChatWindow);

    // FUNGSI UTAMA YANG DIMODIFIKASI
    const sendMessage = () => {
        const messageText = chatInput.value.trim();
        if (messageText === '') return;

        // Tampilkan pesan pengguna
        appendMessage(messageText, 'user');
        chatInput.value = '';

        // Tampilkan indikator loading
        const loadingElement = appendLoadingIndicator();

        // Kirim request ke backend
        fetch(BACKEND_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: messageText }) // Sesuaikan body request jika perlu
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Hapus indikator loading
            loadingElement.remove();
            console.log('Response from backend:', data);
            // Tampilkan balasan dari bot
            // Asumsi backend mengembalikan JSON: { "reply": "Ini balasan bot" }
            // Sesuaikan 'data.reply' jika format respons Anda berbeda
            appendMessage(data.response, 'bot');
        })
        .catch(error => {
            console.error('Error fetching chatbot response:', error);
            // Hapus indikator loading
            loadingElement.remove();
            // Tampilkan pesan error di chat
            appendMessage('Maaf, terjadi kesalahan. Silakan coba lagi nanti.', 'bot');
        });
    };
    
    // Fungsi bantuan untuk menambahkan pesan ke chat body
    const appendMessage = (text, type) => {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = text;
        chatBody.appendChild(messageElement);
        chatBody.scrollTop = chatBody.scrollHeight; // Auto-scroll
    };

    // Fungsi bantuan untuk menambahkan indikator loading
    const appendLoadingIndicator = () => {
        const loadingElement = document.createElement('div');
        loadingElement.className = 'message bot loading';
        loadingElement.innerHTML = '<span></span><span></span><span></span>';
        chatBody.appendChild(loadingElement);
        chatBody.scrollTop = chatBody.scrollHeight;
        return loadingElement;
    };


    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    });

})();