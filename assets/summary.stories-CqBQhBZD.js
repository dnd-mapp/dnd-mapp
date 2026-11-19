import{n as e,r as t}from"./rolldown-runtime-vtgMY1y5.js";import{a as n,t as r}from"./dist-B-70Eai5.js";import{n as i,t as a}from"./facts-list.component-BLZJ5NGa.js";import{i as o,n as s,r as c,t as l}from"./summary.component-CJuaZnUU.js";function init_facts_list(){return(init_facts_list=e((()=>{i()})))()}var u=t({FactsList:()=>p,FactsListMobile:()=>m,Points:()=>f,__namedExportsOrder:()=>h,default:()=>d}),d,f,p,m,h;function init_summary_stories(){return(init_summary_stories=e((()=>{r(),init_facts_list(),s(),o(),d={title:`Patterns/Summary`,component:l,decorators:[n({imports:[c,a]})],render:()=>({template:`
            <section dma-summary>
                <h2 dma-summary-title>In short</h2>
                <ul role="list">
                    <li>No accounts, no cookies, no analytics, and no ads.</li>
                    <li>Our server logs each request, including your IP address, to keep the site running and safe.</li>
                    <li>Your theme choice stays in your browser and never reaches us.</li>
                    <li>Questions or requests about your data go to the support address.</li>
                </ul>
            </section>
        `})},f={},p={render:()=>({template:`
            <section dma-summary>
                <h2 dma-summary-title>At a glance</h2>
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
            </section>
        `})},m={...p,globals:{viewport:{value:`mobile1`,isRotated:!1}}},h=[`Points`,`FactsList`,`FactsListMobile`],f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{}`,...f.parameters?.docs?.source},description:{story:`A title and its points, as the Privacy page opens.`,...f.parameters?.docs?.description}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => ({
    template: \`
            <section dma-summary>
                <h2 dma-summary-title>At a glance</h2>
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
            </section>
        \`
  })
}`,...p.parameters?.docs?.source},description:{story:`A title and a Facts list in place of the points, as the Accessibility page opens.`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  ...FactsList,
  globals: {
    viewport: {
      value: 'mobile1',
      isRotated: false
    }
  }
}`,...m.parameters?.docs?.source},description:{story:`The Facts list stacks each term above its value, below the desktop breakpoint. The docs page shows the story in an
iframe narrower than the breakpoint.`,...m.parameters?.docs?.description}}}})))()}export{u as a,init_summary_stories as i,m as n,f as r,p as t};