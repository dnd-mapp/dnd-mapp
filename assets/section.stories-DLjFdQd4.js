import{n as e,r as t}from"./rolldown-runtime-vtgMY1y5.js";import{C as n,H as r,I as i,j as a,mt as o,pt as s,w as c}from"./angular-platform-e5VfW5pO.js";import{a as l,t as u}from"./dist-B-70Eai5.js";import{n as d,t as f}from"./arg-types-T86RJuJ3.js";import{a as p,n as m,t as h}from"./section-intro.component-rFe8RNaz.js";var g;function init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvY3JpdHNvdXJjZS9jcml0c291cmNlL3BhY2thZ2VzL3VpL3dlYi9zcmMvY29tcG9uZW50cy9zZWN0aW9uL3NlY3Rpb24uY29tcG9uZW50Lmh0bWw(){return(init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvY3JpdHNvdXJjZS9jcml0c291cmNlL3BhY2thZ2VzL3VpL3dlYi9zcmMvY29tcG9uZW50cy9zZWN0aW9uL3NlY3Rpb24uY29tcG9uZW50Lmh0bWw=e((()=>{g=`<div class="content"><ng-content /></div>
`})))()}var _;function init_section_component(){return(init_section_component=e((()=>{_=`section[dma-section]{padding:var(--space-section-block) var(--space-page-inline);background:var(--color-background-page);flex-direction:column;align-items:center;display:flex}section[dma-section].surface{background:var(--color-background-surface)}section[dma-section]>.content{gap:var(--space-section-gap);inline-size:100%;max-inline-size:var(--size-content-max);flex-direction:column;display:flex}section[dma-section]>.content>*{margin:0}`})))()}function sectionBackgroundAttr(e){return Object.values(v).includes(e)?e:y}var v,y;function init_section_types(){return(init_section_types=e((()=>{v={Page:`page`,Surface:`surface`},y=v.Page})))()}var b;function init_section_component$1(){return(init_section_component$1=e((()=>{o(),init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvY3JpdHNvdXJjZS9jcml0c291cmNlL3BhY2thZ2VzL3VpL3dlYi9zcmMvY29tcG9uZW50cy9zZWN0aW9uL3NlY3Rpb24uY29tcG9uZW50Lmh0bWw(),init_section_component(),n(),init_section_types(),b=class SectionComponent{background=c(y,{transform:sectionBackgroundAttr});static propDecorators={background:[{type:i,args:[{isSignal:!0,alias:`background`,required:!1,transform:void 0}]}]}},b=s([a({selector:`section[dma-section]`,template:g,encapsulation:r.None,host:{"[class.surface]":`background() === 'surface'`},styles:[_]})],b)})))()}function init_section_intro(){return(init_section_intro=e((()=>{m(),p()})))()}var x=t({Page:()=>C,PageMobile:()=>T,Surface:()=>w,SurfaceMobile:()=>E,__namedExportsOrder:()=>D,default:()=>S}),S,C,w,T,E,D;function init_section_stories(){return(init_section_stories=e((()=>{u(),init_section_component$1(),init_section_types(),init_section_intro(),f(),S={title:`Regions/Section`,component:b,decorators:[l({imports:[h]})],parameters:{layout:`fullscreen`},argTypes:{background:d({values:v,typeName:`SectionBackground`,defaultValue:y,description:`What the section fills itself with: the page background, or the surface background.`})},render:e=>({props:e,template:`
            <section dma-section [background]="background" aria-labelledby="section-heading">
                <hgroup dma-section-intro>
                    <p>Eyebrow</p>
                    <h2 id="section-heading">Section heading</h2>
                    <p>One or two sentences that say what this section covers and why it matters to the reader.</p>
                </hgroup>
                <div class="slot">Section content</div>
            </section>
        `,styles:[`
                .slot {
                    display: grid;
                    place-items: center;
                    box-sizing: border-box;
                    min-block-size: 12.5rem;
                    border: var(--border-width-default) dashed var(--color-border-control);
                    border-radius: var(--radius-lg);
                    color: var(--color-foreground-muted);
                    font-size: var(--typography-body-sm-font-size);
                }
            `]})},C={args:{background:`page`}},w={args:{background:`surface`}},T={...C,globals:{viewport:{value:`mobile1`,isRotated:!1}}},E={...w,globals:{viewport:{value:`mobile1`,isRotated:!1}}},D=[`Page`,`Surface`,`PageMobile`,`SurfaceMobile`],C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    background: 'page'
  }
}`,...C.parameters?.docs?.source},description:{story:`A section on the page background, from the desktop breakpoint up.`,...C.parameters?.docs?.description}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    background: 'surface'
  }
}`,...w.parameters?.docs?.source},description:{story:`A section on the surface background, from the desktop breakpoint up.`,...w.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  ...Page,
  globals: {
    viewport: {
      value: 'mobile1',
      isRotated: false
    }
  }
}`,...T.parameters?.docs?.source},description:{story:`A section on the page background, with the smaller padding and gap below the desktop breakpoint. The docs page shows
the story in an iframe narrower than the breakpoint.`,...T.parameters?.docs?.description}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  ...Surface,
  globals: {
    viewport: {
      value: 'mobile1',
      isRotated: false
    }
  }
}`,...E.parameters?.docs?.source},description:{story:`A section on the surface background, below the desktop breakpoint.`,...E.parameters?.docs?.description}}}})))()}export{init_section_stories as a,E as i,T as n,x as o,w as r,C as t};