import{n as e,r as t}from"./rolldown-runtime-vtgMY1y5.js";import{C as n,H as r,N as i,U as a,j as o,mt as s,pt as c,q as l,tt as u}from"./angular-platform-e5VfW5pO.js";var d;function init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvY3JpdHNvdXJjZS9jcml0c291cmNlL3BhY2thZ2VzL3VpL3dlYi9zcmMvY29tcG9uZW50cy9kYXRhLXRhYmxlL2RhdGEtdGFibGUuY29tcG9uZW50Lmh0bWw(){return(init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvY3JpdHNvdXJjZS9jcml0c291cmNlL3BhY2thZ2VzL3VpL3dlYi9zcmMvY29tcG9uZW50cy9kYXRhLXRhYmxlL2RhdGEtdGFibGUuY29tcG9uZW50Lmh0bWw=e((()=>{d=`<ng-content />
`})))()}var f;function init_data_table_component(){return(init_data_table_component=e((()=>{f=`table[dma-data-table]{inline-size:100%;max-inline-size:var(--size-measure);border:var(--border-width-default) solid var(--color-border-divider);border-radius:var(--radius-md);border-spacing:0;margin:0;position:relative}table[dma-data-table]>caption{clip-path:inset(50%);white-space:nowrap;block-size:1px;inline-size:1px;position:absolute;overflow:hidden}table[dma-data-table]>:is(thead,tbody)>tr>:is(th,td){padding-block:var(--space-12);padding-inline:var(--space-16) 0;text-align:start;vertical-align:top}table[dma-data-table]>:is(thead,tbody)>tr>:last-child{padding-inline-end:var(--space-16)}table[dma-data-table]>thead>tr>th{background:var(--color-background-sunken);color:var(--color-foreground-muted);font-family:var(--typography-caps-font-family);font-size:var(--typography-caps-font-size);font-weight:var(--typography-caps-font-weight);letter-spacing:var(--typography-caps-letter-spacing);line-height:var(--typography-caps-line-height);-webkit-text-decoration:var(--typography-caps-text-decoration);text-decoration:var(--typography-caps-text-decoration);text-transform:var(--typography-caps-text-case)}table[dma-data-table]>thead>tr>th:first-child{border-start-start-radius:calc(var(--radius-md) - var(--border-width-default))}table[dma-data-table]>thead>tr>th:last-child{border-start-end-radius:calc(var(--radius-md) - var(--border-width-default))}table[dma-data-table]>tbody>tr>:is(th,td){border-block-start:var(--border-width-default) solid var(--color-border-divider)}table[dma-data-table]>tbody>tr>th{color:var(--color-foreground-default);font-family:var(--typography-body-strong-font-family);font-size:var(--typography-body-strong-font-size);font-weight:var(--typography-body-strong-font-weight);letter-spacing:var(--typography-body-strong-letter-spacing);line-height:var(--typography-body-strong-line-height);-webkit-text-decoration:var(--typography-body-strong-text-decoration);text-decoration:var(--typography-body-strong-text-decoration);text-transform:var(--typography-body-strong-text-case)}table[dma-data-table]>tbody>tr>td{color:var(--color-foreground-muted);font-family:var(--typography-body-sm-font-family);font-size:var(--typography-body-sm-font-size);font-weight:var(--typography-body-sm-font-weight);letter-spacing:var(--typography-body-sm-letter-spacing);line-height:var(--typography-body-sm-line-height);-webkit-text-decoration:var(--typography-body-sm-text-decoration);text-decoration:var(--typography-body-sm-text-decoration);text-transform:var(--typography-body-sm-text-case)}@media (width<64em){table[dma-data-table]{border:none;display:block}table[dma-data-table]>colgroup{display:none}table[dma-data-table]>thead{clip-path:inset(50%);white-space:nowrap;block-size:1px;inline-size:1px;position:absolute;overflow:hidden}table[dma-data-table]>tbody{gap:var(--space-12);flex-direction:column;display:flex}table[dma-data-table]>tbody>tr{gap:var(--space-12);padding:calc(var(--space-16) - var(--border-width-default));border:var(--border-width-default) solid var(--color-border-divider);border-radius:var(--radius-md);flex-direction:column;display:flex}table[dma-data-table]>tbody>tr>:is(th,td,:last-child){border:none;padding:0;display:block}table[dma-data-table]>tbody>tr>td:before{content:attr(data-label)/"";color:var(--color-foreground-muted);font-family:var(--typography-caps-font-family);font-size:var(--typography-caps-font-size);font-weight:var(--typography-caps-font-weight);letter-spacing:var(--typography-caps-letter-spacing);line-height:var(--typography-caps-line-height);-webkit-text-decoration:var(--typography-caps-text-decoration);text-decoration:var(--typography-caps-text-decoration);text-transform:var(--typography-caps-text-case);margin-block-end:var(--space-4);display:block}}`})))()}var p;function init_data_table_component$1(){return(init_data_table_component$1=e((()=>{s(),init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvY3JpdHNvdXJjZS9jcml0c291cmNlL3BhY2thZ2VzL3VpL3dlYi9zcmMvY29tcG9uZW50cy9kYXRhLXRhYmxlL2RhdGEtdGFibGUuY29tcG9uZW50Lmh0bWw(),init_data_table_component(),n(),p=class DataTableComponent{table=u(i).nativeElement;constructor(){let e=u(l);a(()=>{this.describeCells();let t=new MutationObserver(()=>{this.describeCells()});t.observe(this.table,{childList:!0,characterData:!0,subtree:!0}),e.onDestroy(()=>{t.disconnect()})})}describeCells(){let{tHead:e,tBodies:t}=this.table,n=Array.from(e?.rows[0]?.cells??[],e=>e.textContent.replace(/\s+/g,` `).trim());for(let r of[e,...Array.from(t)])if(r){r.setAttribute(`role`,`rowgroup`);for(let t of Array.from(r.rows)){t.setAttribute(`role`,`row`);for(let i of Array.from(t.cells))i.tagName===`TD`?(i.setAttribute(`role`,`cell`),i.setAttribute(`data-label`,n[i.cellIndex]??``)):i.setAttribute(`role`,r===e?`columnheader`:`rowheader`)}}}static ctorParameters=()=>[]},p=c([o({selector:`table[dma-data-table]`,template:d,encapsulation:r.None,host:{role:`table`},styles:[f]})],p)})))()}var m=t({Desktop:()=>g,Mobile:()=>_,__namedExportsOrder:()=>v,default:()=>h}),h,g,_,v;function init_data_table_stories(){return(init_data_table_stories=e((()=>{init_data_table_component$1(),h={title:`Patterns/Data table`,component:p,render:()=>({template:`
            <table dma-data-table>
                <caption>Data we process</caption>
                <colgroup>
                    <col class="data" />
                    <col />
                    <col class="legal-basis" />
                    <col class="kept-for" />
                </colgroup>
                <thead>
                    <tr>
                        <th scope="col">Data</th>
                        <th scope="col">Why</th>
                        <th scope="col">Legal basis</th>
                        <th scope="col">Kept for</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">Server logs</th>
                        <td>
                            Your IP address, the time, the page you asked for, the page you came from, and your browser.
                            We use them to deliver pages, find errors, and stop abuse.
                        </td>
                        <td>Legitimate interest, GDPR art. 6(1)(f)</td>
                        <td>14 days</td>
                    </tr>
                    <tr>
                        <th scope="row">Bot check</th>
                        <td>
                            Cloudflare runs a script and sets the cf_clearance cookie to tell people from bots and protect
                            the site from abuse.
                        </td>
                        <td>Legitimate interest, GDPR art. 6(1)(f)</td>
                        <td>6 months, in your browser</td>
                    </tr>
                    <tr>
                        <th scope="row">Theme choice</th>
                        <td>
                            Dark or Light, if you pick one, so the next visit opens in that theme. It stays in your
                            browser's local storage and is never sent to us.
                        </td>
                        <td>None needed: it stays on your device</td>
                        <td>Until you pick System or clear your site data</td>
                    </tr>
                    <tr>
                        <th scope="row">Emails to us</th>
                        <td>Your address and what you write, so we can answer you.</td>
                        <td>Legitimate interest, GDPR art. 6(1)(f)</td>
                        <td>1 year after your question is resolved</td>
                    </tr>
                </tbody>
            </table>
        `,styles:[`
                .data {
                    inline-size: 10.375rem;
                }

                .legal-basis {
                    inline-size: 9.75rem;
                }

                .kept-for {
                    inline-size: 9.5rem;
                }
            `]})},g={},_={globals:{viewport:{value:`mobile1`,isRotated:!1}}},v=[`Desktop`,`Mobile`],g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{}`,...g.parameters?.docs?.source},description:{story:`A table under a header row, as wide as its container up to the measure of 720 px, with the column widths of Penpot.`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  globals: {
    viewport: {
      value: 'mobile1',
      isRotated: false
    }
  }
}`,..._.parameters?.docs?.source},description:{story:`Each row is a card that labels each cell with its column, below the desktop breakpoint. The docs page shows the story
in an iframe narrower than the breakpoint.`,..._.parameters?.docs?.description}}}})))()}export{init_data_table_stories as i,_ as n,m as r,g as t};