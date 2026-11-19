import{n as e,r as t}from"./rolldown-runtime-vtgMY1y5.js";import{n,t as r}from"./facts-list.component-BLZJ5NGa.js";var i=t({Desktop:()=>o,Mobile:()=>s,__namedExportsOrder:()=>c,default:()=>a}),a,o,s,c;function init_facts_list_stories(){return(init_facts_list_stories=e((()=>{n(),a={title:`Patterns/Facts list`,component:r,render:()=>({template:`
            <div class="column">
                <dl dma-facts-list>
                    <div>
                        <dt>Standard</dt>
                        <dd>WCAG 2.2, level AA</dd>
                    </div>
                    <div>
                        <dt>Status</dt>
                        <dd>Partially conformant</dd>
                    </div>
                    <div>
                        <dt>Last checked</dt>
                        <dd>November 11, 2026</dd>
                    </div>
                    <div>
                        <dt>Method</dt>
                        <dd>Our own checks; no outside audit yet</dd>
                    </div>
                </dl>
            </div>
        `,styles:[`
                .column {
                    max-inline-size: 42rem;
                }
            `]})},o={},s={globals:{viewport:{value:`mobile1`,isRotated:!1}}},c=[`Desktop`,`Mobile`],o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source},description:{story:`Each term sits beside its value, from the desktop breakpoint up.`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  globals: {
    viewport: {
      value: 'mobile1',
      isRotated: false
    }
  }
}`,...s.parameters?.docs?.source},description:{story:`Each term stacks above its value, below the desktop breakpoint. The docs page shows the story in an iframe narrower
than the breakpoint.`,...s.parameters?.docs?.description}}}})))()}export{init_facts_list_stories as i,s as n,i as r,o as t};