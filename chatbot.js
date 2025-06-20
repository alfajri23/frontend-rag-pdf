(function(){const a="http://localhost:5000/chat";const t=`
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
    `;const o=`
        <div class="chatbot-toggle">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </div>
        <div class="chat-window">
            <div class="chat-header"><h3>Chat with AI</h3><button class="chat-close">&times;</button></div>
            <div class="chat-body"><div class="message bot">Halo! Ingin cari tau apa?</div></div>
            <div class="chat-footer"><input type="text" id="chat-input" placeholder="Ketik pesanmu..."><button id="send-btn">Kirim</button></div>
        </div>
    `;const n=document.createElement("style");n.textContent=t;document.head.appendChild(n);const e=document.createElement("div");e.id="my-chatbot-container";e.innerHTML=o;document.body.appendChild(e);const r=e.querySelector(".chatbot-toggle");const i=e.querySelector(".chat-close");const c=e.querySelector("#send-btn");const s=e.querySelector("#chat-input");const d=e.querySelector(".chat-body");const h=()=>{e.classList.toggle("open")};r.addEventListener("click",h);i.addEventListener("click",h);const l=()=>{const t=s.value.trim();if(t==="")return;p(t,"user");s.value="";const o=b();fetch(a,{method:"POST",headers:{t:"application/json"},body:JSON.stringify({query:t})}).then(t=>{if(!t.ok){throw new Error(`HTTP error! status: ${t.status}`)}return t.json()}).then(t=>{o.remove();console.log("Response from backend:",t);p(t.response,"bot")})["catch"](t=>{console.error("Error fetching chatbot response:",t);o.remove();p("Maaf, terjadi kesalahan. Silakan coba lagi nanti.","bot")})};const p=(t,o)=>{const a=document.createElement("div");a.className=`message ${o}`;a.textContent=t;d.appendChild(a);d.scrollTop=d.scrollHeight};const b=()=>{const t=document.createElement("div");t.className="message bot loading";t.innerHTML="<span></span><span></span><span></span>";d.appendChild(t);d.scrollTop=d.scrollHeight;return t};c.addEventListener("click",l);s.addEventListener("keypress",t=>{if(t.key==="Enter"){t.preventDefault();l()}})})();