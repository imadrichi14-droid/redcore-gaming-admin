// Démo locale : les produits sont enregistrés dans localStorage du navigateur.
// Pour vendre en ligne à plusieurs clients, il faudra ensuite une base de données partagée.
const WHATSAPP_NUMBER = "212600000000";
const DEFAULT_PRODUCTS = [
  {id:1,name:"Carte graphique GeForce RTX",category:"Composants PC",price:3499,desc:"Carte graphique pour gaming et création.",icon:"▰"},
  {id:2,name:"Processeur AMD Ryzen 5",category:"Composants PC",price:1299,desc:"Processeur polyvalent pour configuration gaming.",icon:"▦"},
  {id:3,name:"Mémoire RAM DDR4 16 Go",category:"Composants PC",price:399,desc:"Mémoire pour améliorer la réactivité du PC.",icon:"▥"},
  {id:4,name:"SSD NVMe 1 To",category:"Composants PC",price:699,desc:"Stockage rapide pour système et jeux.",icon:"▤"},
  {id:5,name:"Clavier mécanique RGB",category:"Périphériques",price:299,desc:"Touches réactives et rétroéclairage RGB.",icon:"⌨"},
  {id:6,name:"Souris Gaming 7 boutons",category:"Périphériques",price:179,desc:"Souris confortable pour le jeu.",icon:"◉"},
  {id:7,name:"Casque Gaming avec micro",category:"Périphériques",price:249,desc:"Audio immersif et micro intégré.",icon:"◖"},
  {id:8,name:"Écran Gaming 24 pouces",category:"Écrans",price:1399,desc:"Moniteur gaming — vérifie la fréquence exacte.",icon:"▣"},
  {id:9,name:"PC Gamer Ryzen / GTX",category:"PC Gamer",price:5999,desc:"Configuration de démonstration à personnaliser.",icon:"▧"},
  {id:10,name:"Tapis de souris XL",category:"Périphériques",price:99,desc:"Grande surface pour clavier et souris.",icon:"▱"},
  {id:11,name:"Alimentation 650 W",category:"Composants PC",price:549,desc:"Choisis une alimentation adaptée à ta configuration.",icon:"▰"},
  {id:12,name:"Écran Gaming 27 pouces",category:"Écrans",price:1899,desc:"Grand format pour le gaming et le travail.",icon:"▣"}
];
let products = loadProducts();
let cart = [];
let selectedImage = "";
let editingId = null;
const money = n => `${Number(n).toLocaleString("fr-MA")} DH`;
const grid = document.getElementById("product-grid");
const $ = id => document.getElementById(id);
function loadProducts(){try{const saved=localStorage.getItem("redcore_products_v1");return saved?JSON.parse(saved):DEFAULT_PRODUCTS.map(p=>({...p}));}catch(e){return DEFAULT_PRODUCTS.map(p=>({...p}));}}
function saveProducts(){try{localStorage.setItem("redcore_products_v1",JSON.stringify(products));return true;}catch(e){alert("Le stockage du navigateur est plein. Choisis une image plus petite (moins de 1 Mo) ou supprime quelques photos.");return false;}}
function esc(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function renderProducts(){
 const q=$("search").value.trim().toLowerCase(), category=$("filter").value;
 const shown=products.filter(p=>(category==="Tous"||p.category===category)&&(`${p.name} ${p.desc} ${p.category}`).toLowerCase().includes(q));
 grid.innerHTML=shown.length?shown.map(p=>`<article class="product-card"><div class="product-visual"><span class="product-category">${esc(p.category)}</span>${p.image?`<img src="${p.image}" alt="${esc(p.name)}">`:`<span class="product-placeholder">${esc(p.icon||"▰")}</span>`}</div><div class="product-info"><h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p><div class="product-foot"><span class="price">${money(p.price)}</span><button class="add-btn" data-add="${p.id}">+ AJOUTER</button></div></div></article>`).join(""):'<p>Aucun produit trouvé. Essaie une autre recherche.</p>';
}
function openCart(){$("cart-panel").classList.add("open");$("overlay").classList.add("open")}
function closeCart(){$("cart-panel").classList.remove("open");$("overlay").classList.remove("open")}
function addToCart(id){const found=cart.find(x=>x.id===id);found?found.qty++:cart.push({id,qty:1});renderCart();openCart()}
function changeQty(id,delta){const item=cart.find(x=>x.id===id);if(!item)return;item.qty+=delta;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);renderCart()}
function renderCart(){
 cart=cart.filter(x=>products.some(p=>p.id===x.id));
 $("cart-count").textContent=cart.reduce((s,x)=>s+x.qty,0);
 $("cart-total").textContent=money(cart.reduce((s,x)=>s+(products.find(p=>p.id===x.id)?.price||0)*x.qty,0));
 const el=$("cart-items");if(!cart.length){el.innerHTML='<p class="empty">Ton panier est vide pour le moment.</p>';return}
 el.innerHTML=cart.map(x=>{const p=products.find(y=>y.id===x.id);return `<div class="cart-row"><div><strong>${esc(p.name)}</strong><small>${money(p.price)} / unité</small><div class="qty-controls"><button data-qty="${p.id}" data-delta="-1">−</button><span>${x.qty}</span><button data-qty="${p.id}" data-delta="1">+</button><button class="remove-btn" data-remove="${p.id}">Supprimer</button></div></div><strong>${money(p.price*x.qty)}</strong></div>`}).join("");
}
function orderMessage(){if(!cart.length){alert("Ton panier est vide.");return null}const total=cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0);const lines=cart.map(x=>{const p=products.find(y=>y.id===x.id);return `- ${p.name} x${x.qty} : ${money(p.price*x.qty)}`}).join("\n");const details=prompt("Entre ton nom, ta ville et ton adresse de livraison (tu pourras compléter sur WhatsApp) :");if(details===null)return null;return `Bonjour REDCORE GAMING, je souhaite commander :\n${lines}\n\nTotal estimé : ${money(total)}\nNom / ville / adresse : ${details||"À confirmer"}\n\nMerci de confirmer la disponibilité, le prix final et les frais de livraison.`}
function sendOrder(){const msg=orderMessage();if(!msg)return;if(WHATSAPP_NUMBER==="212600000000"){alert("Le numéro WhatsApp n'est pas encore configuré. Il faudra le remplacer dans script.js.");return}window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,"_blank","noopener")}
function openAdmin(){ $("admin-login").hidden=false;$("admin-password").value="";$("admin-password").focus(); }
function showAdmin(){ $("admin-login").hidden=true;$("admin-panel").hidden=false;renderAdminProducts();$("admin-panel").scrollIntoView({behavior:"smooth",block:"start"}); }
function renderAdminProducts(){const el=$("admin-products");if(!products.length){el.innerHTML="<p class='empty'>Aucun produit pour le moment.</p>";return}el.innerHTML=products.map(p=>`<div class="admin-product-row">${p.image?`<img src="${p.image}" alt="">`:`<div class="admin-thumb-placeholder">${esc(p.icon||"▰")}</div>`}<div><strong>${esc(p.name)}</strong><small>${money(p.price)} · ${esc(p.category)}</small></div><div class="admin-row-actions"><button data-edit="${p.id}">Modifier</button><button class="delete-product" data-delete="${p.id}">Supprimer</button></div></div>`).join("")}
function resetForm(){editingId=null;selectedImage="";$('product-form').reset();$('edit-id').value="";$('save-product').textContent="AJOUTER LE PRODUIT";$('cancel-edit').hidden=true;$('image-preview-wrap').hidden=true;$('p-image').value="";}
function editProduct(id){const p=products.find(x=>x.id===id);if(!p)return;editingId=id;$('edit-id').value=id;$('p-name').value=p.name;$('p-price').value=p.price;$('p-category').value=p.category;$('p-desc').value=p.desc||"";selectedImage=p.image||"";$('p-image').value="";$('save-product').textContent="ENREGISTRER LES MODIFICATIONS";$('cancel-edit').hidden=false;$('image-preview-wrap').hidden=!selectedImage;if(selectedImage)$('image-preview').src=selectedImage;$('product-form').scrollIntoView({behavior:"smooth",block:"start"});}
function removeProduct(id){const p=products.find(x=>x.id===id);if(!p||!confirm(`Supprimer « ${p.name} » ?`))return;products=products.filter(x=>x.id!==id);if(saveProducts()){renderProducts();renderAdminProducts();renderCart();if(editingId===id)resetForm();}}
grid.addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(b)addToCart(Number(b.dataset.add))});
$("cart-items").addEventListener("click",e=>{const q=e.target.closest("[data-qty]"),r=e.target.closest("[data-remove]");if(q)changeQty(Number(q.dataset.qty),Number(q.dataset.delta));if(r){cart=cart.filter(x=>x.id!==Number(r.dataset.remove));renderCart()}});
$("search").addEventListener("input",renderProducts);$("filter").addEventListener("change",renderProducts);
document.querySelectorAll("[data-category]").forEach(b=>b.addEventListener("click",()=>{$("filter").value=b.dataset.category;renderProducts();$("produits").scrollIntoView({behavior:"smooth"})}));
$("open-cart").addEventListener("click",openCart);$("close-cart").addEventListener("click",closeCart);$("overlay").addEventListener("click",closeCart);$("checkout").addEventListener("click",sendOrder);
$("contact-wa").addEventListener("click",()=>{if(WHATSAPP_NUMBER==="212600000000"){alert("Le numéro WhatsApp n'est pas encore configuré.");return}window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Bonjour, je voudrais des informations sur vos produits.")}`,"_blank","noopener")});
$("open-admin").addEventListener("click",openAdmin);$("cancel-login").addEventListener("click",()=>{$("admin-login").hidden=true});$("close-admin").addEventListener("click",()=>{$("admin-panel").hidden=true});
$("admin-login-form").addEventListener("submit",e=>{e.preventDefault();if($("admin-password").value==="RC2026")showAdmin();else alert("Mot de passe incorrect.")});
$("p-image").addEventListener("change",e=>{const file=e.target.files?.[0];if(!file)return;if(!file.type.startsWith("image/")){alert("Choisis un fichier image.");e.target.value="";return}if(file.size>1024*1024){alert("Cette image dépasse 1 Mo. Réduis sa taille puis réessaie.");e.target.value="";return}const reader=new FileReader();reader.onload=()=>{selectedImage=String(reader.result);$('image-preview').src=selectedImage;$('image-preview-wrap').hidden=false};reader.readAsDataURL(file)});
$("remove-image").addEventListener("click",()=>{selectedImage="";$('p-image').value="";$('image-preview-wrap').hidden=true});$("cancel-edit").addEventListener("click",resetForm);
$("product-form").addEventListener("submit",e=>{e.preventDefault();const name=$('p-name').value.trim(),price=Number($('p-price').value),category=$('p-category').value,desc=$('p-desc').value.trim();if(!name||!Number.isFinite(price)||price<0){alert("Vérifie le nom et le prix.");return}const previous=editingId?products.find(p=>p.id===editingId):null;const item={id:editingId||Math.max(0,...products.map(p=>Number(p.id)||0))+1,name,price,category,desc,icon:previous?.icon||"▰",image:selectedImage||previous?.image||""};if(editingId)products=products.map(p=>p.id===editingId?item:p);else products.unshift(item);if(saveProducts()){renderProducts();renderAdminProducts();resetForm();alert("Produit enregistré sur ce navigateur.")}});
$("admin-products").addEventListener("click",e=>{const edit=e.target.closest("[data-edit]"),del=e.target.closest("[data-delete]");if(edit)editProduct(Number(edit.dataset.edit));if(del)removeProduct(Number(del.dataset.delete))});
$("year").textContent=new Date().getFullYear();renderProducts();renderCart();
