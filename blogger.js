<script>//<![CDATA[
window.initWhatsapp = function(){

  const orderForm = document.getElementById("orderForm");

  orderForm.onsubmit = function(e){
    e.preventDefault();

    const name = custName.value;
    const addr = custAddress.value;
    const qty  = custQty.value;

    const p = APP.currentProduct;
    const total = Number(p.harga) * Number(qty);

    const msg = [
      "*PESANAN BARU*",
      "-----------------------------",
      `*Produk:* ${p.nama}`,
      `*Harga:* Rp ${Number(p.harga).toLocaleString('id-ID')}`,
      `*Jumlah:* ${qty}`,
      `*Total:* Rp ${total.toLocaleString('id-ID')}`,
      "-----------------------------",
      `*Nama:* ${name}`,
      `*Alamat:* ${addr}`
    ].join("\n");

    window.open(`https://wa.me/${APP.phone}?text=${encodeURIComponent(msg)}`, "_blank");

    orderForm.reset();
    document.getElementById("orderModal").style.display="none";
  };
};
//]]></script>

<script>//<![CDATA[
window.initTabs = function(){

  document.querySelectorAll(".tab-btn").forEach(btn=>{
    btn.onclick = function(){

      document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c=>c.classList.remove("active"));

      this.classList.add("active");

      const target = document.getElementById(this.dataset.tab);
      if(target) target.classList.add("active");

      this.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"});
    };
  });

};
//]]></script>

<script>//<![CDATA[
document.addEventListener("DOMContentLoaded", function(){
  initSheets();
  initModal();
  initWhatsapp();
  initTabs();
});
//]]></script>

  
<script>
//<![CDATA[
window.addEventListener("load", function(){

const clock = document.getElementById("clock");
console.log("clock found:", clock);

if (!clock) return;

const timeEl = document.getElementById("clockTime");
const dateEl = document.getElementById("clockDate");

const hari = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
const bulan = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];

function updateClock(){

  const now = new Date();

  const h = String(now.getHours()).padStart(2,"0");
  const m = String(now.getMinutes()).padStart(2,"0");
  const s = String(now.getSeconds()).padStart(2,"0");

  timeEl.textContent = `${h} : ${m} : ${s}`;

  const d = now.getDate();
  const day = hari[now.getDay()];
  const month = bulan[now.getMonth()];
  const y = now.getFullYear();

  dateEl.textContent = `${day}, ${d} ${month} ${y}`;
}

updateClock();
setInterval(updateClock,1000);

});
//]]>
</script>
  
  

<script>//<![CDATA[
(async function(){

const SECRET = "SIMPELTOKO.ID_0354";

/* =============================
   BASIC FUNCTIONS
============================= */

function getBlogID(){
  const el = document.getElementById("blogger-id");
  if(!el) return "";
  return el.textContent.trim();
}

function getLicenseFromWidget(){
  const el = document.getElementById("license-code");
  if(!el) return "";
  return el.textContent.trim();
}

function decodeLicense(str){
  try{ return atob(str); }
  catch(e){ return ""; }
}

async function sha1(msg){
  const buffer = new TextEncoder().encode(msg);
  const hash = await crypto.subtle.digest("SHA-1", buffer);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2,"0"))
    .join("");
}

function setCookie(name,value,days){
  const d = new Date();
  d.setTime(d.getTime() + (days*86400000));
  document.cookie = name+"="+value+";expires="+d.toUTCString()+";path=/";
}

function getCookie(name){
  const v = document.cookie.match('(^|;) ?'+name+'=([^;]*)(;|$)');
  return v ? v[2] : null;
}

function getFingerprint(){
  return btoa(
    navigator.userAgent +
    navigator.language +
    screen.width +
    screen.height +
    screen.colorDepth +
    new Date().getTimezoneOffset()
  );
}

/* =============================
   START
============================= */

document.addEventListener("DOMContentLoaded", async function(){

  const blogID = getBlogID();
  const inputLicense = decodeLicense(getLicenseFromWidget());
  const validLicense = await sha1(blogID + SECRET);

  if(inputLicense !== validLicense){

    /* =============================
       TRIAL MODE
    ============================= */

    const TRIAL_DAYS = 1;
    const FP = getFingerprint();
    const KEY = "st_trial_" + blogID + "_" + FP;

    let start =
      localStorage.getItem(KEY) ||
      getCookie(KEY);

    if(!start){
      start = Date.now();
      localStorage.setItem(KEY, start);
      setCookie(KEY, start, 3650);
    }

    const daysUsed = Math.floor((Date.now() - start) / 86400000);

    if(daysUsed < TRIAL_DAYS){
      console.log("Trial aktif hari ke:", daysUsed+1);
      return;
    }

    /* =============================
       SHOW OVERLAY AFTER DELAY
    ============================= */

    setTimeout(()=>{

      /* ===== BLUR LAYER ===== */
      const blurLayer = document.createElement("div");
      blurLayer.style.cssText = `
        position:fixed;
        inset:0;
        backdrop-filter: blur(10px) saturate(120%);
        background: rgba(15,23,42,0.35);
        z-index:999998;
        opacity:0;
        transition:opacity .4s ease;
      `;
      document.body.appendChild(blurLayer);

      /* ===== OVERLAY ===== */
      const overlay = document.createElement("div");
      overlay.id = "simpeltoko-license-overlay";
      overlay.style.cssText = `
        position:fixed;
        inset:0;
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:999999;
        font-family:system-ui,-apple-system,sans-serif;
        opacity:0;
        transform:scale(.92);
        transition:all .35s ease;
      `;

      overlay.innerHTML = `
        <div style="
          background:linear-gradient(180deg,#ffffff,#f8fafc);
          width:92%;
          max-width:420px;
          padding:30px 26px;
          border-radius:20px;
          text-align:center;
          box-shadow:0 25px 70px rgba(0,0,0,.25);
        ">
          <div style="
            width:58px;height:58px;margin:0 auto 14px;
            border-radius:16px;background:#FC2C5C;
            display:flex;align-items:center;justify-content:center;
            color:#fff;font-size:26px;font-weight:bold;
          ">!</div>

          <h2 style="margin:6px 0 8px;color:#0f172a">
            Lisensi Tidak Aktif
          </h2>

          <p style="color:#475569;font-size:14px;line-height:1.6;margin-bottom:20px">
            Template ini belum memiliki lisensi aktif.<br>
            Aktivasi lisensi untuk membuka semua fitur premium.
          </p>

          <a href="https://www.simpeltoko.id" target="_blank"
             style="
              display:block;padding:14px;border-radius:12px;
              background:#2563eb;color:white;text-decoration:none;
              font-weight:600;
              box-shadow:0 10px 20px rgba(37,99,235,.35);
             ">
            Aktivasi Sekarang
          </a>

          <div style="margin-top:14px;font-size:13px;color:#64748b">
            Redirect otomatis dalam <b><span id="count">20</span></b> detik
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      requestAnimationFrame(()=>{
        blurLayer.style.opacity="1";
        overlay.style.opacity="1";
        overlay.style.transform="scale(1)";
      });

      /* ===== COUNTDOWN ===== */
      let sec = 20;
      const timer = setInterval(()=>{
        sec--;
        document.getElementById("count").innerText = sec;
        if(sec === 0){
          clearInterval(timer);
          window.location.href="https://www.simpeltoko.id";
        }
      },1000);

      /* =============================
         🔒 PROTECTION LAYER
      ============================= */

      // reload jika widget lisensi dihapus
      setInterval(()=>{
        if(!document.getElementById("license-code")){
          location.reload();
        }
      },3000);

      // monitor DOM perubahan
      const observer = new MutationObserver(()=>{
        if(!document.getElementById("license-code")){
          location.reload();
        }
      });
      observer.observe(document.body,{childList:true,subtree:true});

      // paksa overlay tetap tampil
      setInterval(()=>{
        const o = document.getElementById("simpeltoko-license-overlay");
        if(o){
          o.style.display="flex";
          o.style.opacity="1";
          o.style.visibility="visible";
          o.style.pointerEvents="auto";
        }
      },1000);

      // reload jika overlay dihapus
      overlay.addEventListener("remove", ()=> location.reload());

      /* =============================
         🔒 ANTI DISABLE SCRIPT
      ============================= */

      try{
        Object.defineProperty(window, "simpeltokoProtected", {
          value:true,
          writable:false,
          configurable:false
        });
      }catch(e){}

      // cegah manipulasi body
      const originalRemove = Element.prototype.remove;
      Element.prototype.remove = function(){
        if(this.id === "simpeltoko-license-overlay"){
          location.reload();
          return;
        }
        originalRemove.apply(this, arguments);
      };

    },7000);

  }

});

})();//]]>
</script>
