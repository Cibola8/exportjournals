var C=Object.defineProperty;var P=(u,e,t)=>e in u?C(u,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):u[e]=t;var w=(u,e)=>C(u,"name",{value:e,configurable:!0});var x=(u,e,t)=>(P(u,typeof e!="symbol"?e+"":e,t),t);var{TextEditor:j}=foundry.applications.ux,y=class{static async exportPack(e,t){let n=await e.getDocuments(),r=new JSZip,o=n.filter(i=>!i.folder),s={};await this.handleFolderDocs(o,t,r,e,s);for(let i of Array.from(e.folders).sort((l,m)=>l.sort??0-m.sort??0)){let l=n.filter(m=>m.folder===i);l.length!==0&&await this.handleFolderDocs(l,t,r,e,s)}let c=foundry.utils.expandObject(s),d=this.createTocMarkdown(c);r.file("TOC.md",d),this.generateSubfolderTOCs(c,r,[]);let p=(e.metadata.label||e.metadata.name||e.metadata.id).replace(/[^a-zA-Z0-9-_äöüÄÖÜß]/g,"_"),f=await r.generateAsync({type:"blob"}),a=document.createElement("a");a.href=URL.createObjectURL(f),a.download=`${p}.zip`,a.click(),URL.revokeObjectURL(a.href)}static createTocMarkdown(e,t=1,n=[]){return Object.entries(e).map(([r,o])=>{let s="#".repeat(t)+" "+r;if(Array.isArray(o)&&o.length===1){let c=n.length>0?n.map(d=>encodeURIComponent(d)).join("/")+"/"+encodeURIComponent(r):encodeURIComponent(r);return`- [${o[0]}](<./${c}/${o[0].replace(/[^a-zA-Z0-9-_äöüÄÖÜß]/g,"_")}.md>)`}else if(Array.isArray(o)){let c=n.length>0?n.map(d=>encodeURIComponent(d)).join("/")+"/"+encodeURIComponent(r):encodeURIComponent(r);return`${s}

${o.map(d=>`- [${d}](<./${c}/${d.replace(/[^a-zA-Z0-9-_äöüÄÖÜß]/g,"_")}.md>)`).join(`
`)}`}else return`${s}

${this.createTocMarkdown(o,t+1,n.concat(r))}`}).join(`

`)}static generateSubfolderTOCs(e,t,n=[]){Object.entries(e).forEach(([r,o])=>{let s=[...n,r];if(!Array.isArray(o)){let c=this.createSubfolderTocMarkdown(o),p=`[TOC](<./${"../".repeat(s.length)}TOC.md>)

${c}`;t.folder(s.join("/")).file("TOC.md",p),this.generateSubfolderTOCs(o,t,s)}})}static createSubfolderTocMarkdown(e,t=1,n=[]){return Object.entries(e).map(([r,o])=>{let s="#".repeat(t)+" "+r;if(Array.isArray(o)&&o.length===1){let c=o[0].replace(/[^a-zA-Z0-9-_äöüÄÖÜß]/g,"_");return`- [${o[0]}](<./${r}/${c}.md>)`}else return Array.isArray(o)?`${s}

${o.map(c=>{let d=c.replace(/[^a-zA-Z0-9-_äöüÄÖÜß]/g,"_");return`- [${c}](<./${r}/${d}.md>)`}).join(`
`)}`:`${s}

${this.createSubfolderTocMarkdown(o,t+1,n.concat(r))}`}).join(`

`)}static async handleFolderDocs(e,t,n,r,o){for(let s of e.sort((c,d)=>c.sort??0-d.sort??0)){let c=this.buildPath(s,r,[]),d=await this.convertJournalToMarkdown(s,t,r,c);c.push(s.name);let p=[];for(let f of d){let a=f.name.replace(/[^a-zA-Z0-9-_äöüÄÖÜß]/g,"_");if(p.push(f.name),n.folder(c.join("/")).file(`${a}.md`,f.markdown),f.imageUrls.length>0)for(let i of f.imageUrls){let l=await fetch(i);if(!l.ok)continue;let m=await l.blob(),h=i.split("/").pop();n.folder("asset").file(h,m)}}foundry.utils.setProperty(o,c.join("."),p)}}static buildPath(e,t,n){return e.folder?(n.unshift(e.folder.name),this.buildPath(e.folder,t,n)):n}static getImageUrlsAndRerout(e,t){return{pattern:/<img[^>]+src="([^"]+)"[^>]*>/g,enricher:async(r,o)=>{let s=r[1];if(s.startsWith("http")||s.startsWith("data:"))return r[0];o.urls.push(s);let c="./"+"../".repeat(o.pathLength+1)+"asset/"+s.split("/").pop();return r[0].replace(s,c)}}}static getLinkEnricher(e,t){let n=["Compendium","UUID"];return{pattern:new RegExp(`@(${n.join("|")})\\[([^#\\]]+)(?:#([^\\]]+))?](?:{([^}]+)})?`,"g"),enricher:async(o,s)=>{let[c,d,p,f]=o.slice(1,5),a;if(c==="UUID")a=await foundry.utils.fromUuid(d);else if(c==="Compendium"){let{collection:i,id:l}=foundry.utils.parseUuid(`Compendium.${d}`)??{};l&&i&&(i.index.has(l)?a=await i.getDocument(l):a=await i.getName(l))}if(a&&a.pack==e.metadata.id){let l=y.buildPath(a,e,[]).map(L=>encodeURIComponent(L)),m=y.buildPath(t,e,[]),h=a.name;a.documentName=="JournalEntry"&&(l.push(encodeURIComponent(a.name)),h=Array.from(a.pages)[0].name);let g=m.length>1?"../".repeat(m.length+1):"",$=h.replace(/[^a-zA-Z0-9-_äöüÄÖÜß]/g,"_");return`<a href="./${g}${l.join("/")}/${$}.md">${f||a.name}</a>`}return o[0]}}}static async convertJournalToMarkdown(e,t,n,r){let o=foundry.applications.sheets.journal.JournalEntryPageTextSheet._converter,s=r.length,c=[];for(let d of e.pages){let p=foundry.utils.getProperty(d,"text.content"),f=[];if(!p)continue;if(t.removeLinks=="convertLinks"){let m=this.getLinkEnricher(n,e),h=p.matchAll(m.pattern);for(let g of h){let $=await m.enricher(g,{});p=p.replace(g[0],$)}}if(t.withImages){let m=this.getImageUrlsAndRerout(n,e),h=p.matchAll(m.pattern);for(let g of h){let $=await m.enricher(g,{urls:f,pathLength:s});p=p.replace(g[0],$)}}t.enrich&&(p=await j.enrichHTML(p)),t.removeLinks=="removeLinks"&&(p=p.replace(/<a[^>]*>(.*?)<\/a>/g,"$1"));let a=o.makeMarkdown(p),l=[`[TOC](<./${"../".repeat(s+1)}/TOC.md>)`];for(let m=0;m<s;m++){let h="../".repeat(s-m);l.push(`[${r[m]}](<./${h}TOC.md>)`)}a=`${l.join(" / ")}

`+a,c.push({markdown:a,name:d.name,imageUrls:f})}return c}};w(y,"ExportAsMarkdown");var{TextEditor:v}=foundry.applications.ux,T=class{static async exportPack(e,t,n){let r=(await e.getDocuments()).sort((a,i)=>a.sort??0-i.sort??0),o={none:[]};for(let a of Array.from(e.folders).sort((i,l)=>i.sort??0-l.sort??0))for(let i of r.filter(l=>l.folder===a)){let m=(await this.convertJournalToHTML(i,t)).map(g=>`
                        <h3>${g.name}</h3>
                        ${g.html}
                    <div class="page_break"></div>`).join(""),h=`
                    <h2>${i.name}</h2>
                    ${m}
                    <div class="page_break"></div>`;o[a.id]=o[a.id]||[],o[a.id].push(h)}for(let a of r.filter(i=>!i.folder)){let l=(await this.convertJournalToHTML(a,t)).map(h=>`
                        <h3>${h.name}</h3>
                        ${h.html}
                    <div class="page_break"></div>`).join(""),m=`
                    <h2>${a.name}</h2>
                    ${l}
                    <div class="page_break"></div>`;o.none.push(m)}let s=Object.entries(o).map(([a,i])=>{let l=e.folders.get(a);return`<div class="folder">
                <h1>${l?l.name:""}</h1>
                ${i.join("")}
            </div>`}).join(""),c=e.metadata.label||e.metadata.name||e.metadata.id;window.HTML3PDFprogressCallback=n;let d=window.open("","_blank","width=800,height=600"),f=`
    <html>
        <head>
            <title>Generating PDF</title>
            <script crossorigin="anonymous" referrerpolicy="no-referrer" src="https://cdn.jsdelivr.net/npm/html3pdf@0.12.2/dist/html3pdf.bundle.min.js"><\/script>
            
            <style>
                    body { 
                    font-family: sans-serif; padding: 30px; max-width: 800px;                     
                    }
                    img {
                        max-width: 100% !important;
                    }
                    #pdf-content {
                        width: 100%;
                        max-width: 595px;
                        margin: 0 auto;
                    }
                    .page_break {
                        page-break-after: always;
                    }
                        ${t.foundryStyles?Array.from(document.styleSheets).map(a=>{try{return Array.from(a.cssRules).filter(i=>!(i instanceof CSSStyleRule)||!i.selectorText.includes("body")).map(i=>i.cssText).join(`
`)}catch{return""}}).join(`
`):""}
            </style>
        </head>
        <body>
            <div id="pdf-content">
                ${s}
            </div>
            <script>
            const originalLog = console.debug;
                console.debug = function(...args) {
                originalLog.apply(console, args); // still log locally
                if (window.opener && typeof window.opener.receiveLogFromChild === 'function') {
                    window.opener.receiveLogFromChild(args.join(' '));
                }
            };
                window.onload = async () => {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    const el = document.getElementById("pdf-content");
                    html3pdf().set({
                        filename: "${c}.pdf",
                        margin: 1,
                        pagebreak: { mode: ['avoid-all', 'css', 'legacy'], elementType: 'div', className: 'page_break' },
                        html2canvas: { scale: 2 },
                        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
                    }).from(el).save().listen(window.opener.HTML3PDFprogressCallback).then(() => window.close());
                }
            <\/script>
        </body>
    </html>
`;for(d.document.open(),d.document.write(f),d.document.close();!d.closed;)console.log("Waiting for the window to close..."),await new Promise(a=>setTimeout(a,1e3));window.HTML3PDFprogressCallback=null}static buildPath(e,t,n){return e.folder?(n.unshift(e.folder.name),this.buildPath(e.folder,t,n)):n}static async convertJournalToHTML(e,t){let n=[];for(let r of e.pages){let o=foundry.utils.getProperty(r,"text.content");!o||(t.enrich&&(o=await v.enrichHTML(o)),t.removeLinks.value=="removeLinks"&&(o=o.replace(/<a[^>]*>(.*?)<\/a>/g,"$1")),n.push({html:o,name:r.name}))}return n}};w(T,"ExportAsPDF");Hooks.on("getCompendiumContextOptions",(u,e)=>{if(!game.user.isGM)return!1;let t=w(n=>{let r=n.dataset.pack;return game.packs.get(r)?.documentName=="JournalEntry"},"condition");e.push({name:"exportJournals.exportMarkdown",icon:'<i class="fas fa-markdown"></i>',condition:t,callback:n=>U(n)})});async function U(u){let e=u.dataset.pack,t=game.packs.get(e);new b(t).render({force:!0})}w(U,"exportCompendium");var k=class extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2){constructor(e){super(),this.pack=e,this.history=[]}get title(){return this.pack.metadata.label||this.pack.metadata.name||this.pack.metadata.id}static exportMarkdown(e,t){let n=new foundry.applications.ux.FormDataExtended(this.element.querySelector("form")).object;y.exportPack(this.pack,n),this.close()}updateProgress(e){this.progress.update({message:"exportJournals.exportPDF",localize:!0,pct:e.val/e.n})}receiveLogFromChild(e){this.history.push(e),this.history=this.history.slice(-3);let t=this.element.querySelector(".progress");t.classList.remove("hidden"),t.textContent=this.history.join(`
`)}static async exportPDF(e,t){window.receiveLogFromChild=this.receiveLogFromChild.bind(this),this.progress=ui.notifications.info("exportJournals.exportPDF",{progress:!0,localize:!0});let n=new foundry.applications.ux.FormDataExtended(this.element.querySelector("form")).object;await T.exportPack(this.pack,n),window.receiveLogFromChild=null,this.progress.update({message:"exportJournals.exportPDF",localize:!0,progress:1}),this.close()}},b=k;w(b,"Exporter"),x(b,"PARTS",{main:{template:"modules/exportjournals/templates/exporter.hbs",root:!0}}),x(b,"DEFAULT_OPTIONS",{actions:{exportMarkdown:k.exportMarkdown,exportPDF:k.exportPDF},position:{width:500},window:{contentClasses:["standard-form"]}});
