import{n as e,r as t}from"./rolldown-runtime-vtgMY1y5.js";import{C as n,K as r,N as i,j as a,l as o,mt as s,pt as c,tt as l}from"./angular-platform-e5VfW5pO.js";import{a as u,r as d,t as f}from"./dist-B-70Eai5.js";import{t as p}from"./nav-link.component-vrSCSt3S.js";import{t as m}from"./nav-link-B7o1wdw_.js";var h;function init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvY3JpdHNvdXJjZS9jcml0c291cmNlL3BhY2thZ2VzL3VpL3dlYi9zcmMvY29tcG9uZW50cy9za2lwLWxpbmsvc2tpcC1saW5rLmNvbXBvbmVudC5odG1s(){return(init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvY3JpdHNvdXJjZS9jcml0c291cmNlL3BhY2thZ2VzL3VpL3dlYi9zcmMvY29tcG9uZW50cy9za2lwLWxpbmsvc2tpcC1saW5rLmNvbXBvbmVudC5odG1s=e((()=>{h=`<ng-content />
`})))()}var g;function init_skip_link_component(){return(init_skip_link_component=e((()=>{g=`:host{top:var(--space-16);left:var(--space-16);clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:fixed;overflow:hidden}:host(:focus){z-index:1000;width:auto;height:auto;min-height:var(--size-target-min);padding:0 var(--space-16);clip-path:none;border-radius:var(--radius-md);outline:var(--border-width-focus) solid var(--color-focus-ring);outline-offset:var(--focus-offset);background:var(--color-accent-default);color:var(--color-foreground-on-accent);font-family:var(--typography-button-font-family);font-size:var(--typography-button-font-size);font-weight:var(--typography-button-font-weight);letter-spacing:var(--typography-button-letter-spacing);line-height:var(--typography-button-line-height);-webkit-text-decoration:var(--typography-button-text-decoration);text-decoration:var(--typography-button-text-decoration);text-transform:var(--typography-button-text-case);align-items:center;display:inline-flex;overflow:visible}`})))()}var _;function init_skip_link_component$1(){return(init_skip_link_component$1=e((()=>{s(),init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvY3JpdHNvdXJjZS9jcml0c291cmNlL3BhY2thZ2VzL3VpL3dlYi9zcmMvY29tcG9uZW50cy9za2lwLWxpbmsvc2tpcC1saW5rLmNvbXBvbmVudC5odG1s(),init_skip_link_component(),o(),n(),_=class SkipLinkComponent{document=l(r);host=l(i);skipToTarget(e){let t=this.host.nativeElement.getAttribute(`href`);if(!t?.startsWith(`#`))return;let n=this.document.getElementById(decodeURIComponent(t.slice(1)));n&&(e.preventDefault(),n.hasAttribute(`tabindex`)||(n.setAttribute(`tabindex`,`-1`),n.addEventListener(`blur`,()=>{n.removeAttribute(`tabindex`)},{once:!0})),n.focus())}},_=c([a({selector:`a[dma-skip-link]`,template:h,host:{"(click)":`skipToTarget($event)`},styles:[g]})],_)})))()}var v=t({Focus:()=>x,Hidden:()=>b,OnPage:()=>S,__namedExportsOrder:()=>C,default:()=>y}),y,b,x,S,C;function init_skip_link_stories(){return(init_skip_link_stories=e((()=>{f(),init_skip_link_component$1(),m(),y={title:`Elements/Skip link`,component:_,argTypes:{label:{description:`The content the skip link projects, which names it to assistive technology.`,control:`text`}},parameters:{controls:{exclude:[`skipToTarget`]}},decorators:[d(e=>`<div style="transform: translate(0); min-height: calc(var(--size-target-min) + 2 * var(--space-16))">${e}</div>`)],render:e=>({props:e,template:`<a dma-skip-link href="#main">{{ label }}</a>`})},b={args:{label:`Skip to main content`}},x={args:{label:`Skip to main content`},parameters:{pseudo:{focus:!0}}},S={args:{label:`Skip to main content`},decorators:[u({imports:[p]})],render:e=>({props:e,template:`
            <a dma-skip-link href="#story-main">{{ label }}</a>
            <header style="display: flex; justify-content: flex-end; padding: var(--space-16)">
                <nav aria-label="Main" style="display: flex; gap: var(--space-4)">
                    <a dma-nav-link href="#">Compendium</a>
                    <a dma-nav-link href="#">Characters</a>
                    <a dma-nav-link href="#">Campaigns</a>
                </nav>
            </header>
            <main id="story-main" style="padding: var(--space-16)">Main content</main>
        `})},C=[`Hidden`,`Focus`,`OnPage`],b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Skip to main content'
  }
}`,...b.parameters?.docs?.source},description:{story:`The skip link before it gets focus: hidden from sight, but still in the accessibility tree.`,...b.parameters?.docs?.description}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Skip to main content'
  },
  parameters: {
    pseudo: {
      focus: true
    }
  }
}`,...x.parameters?.docs?.source},description:{story:`The skip link with focus, the look Penpot draws.`,...x.parameters?.docs?.description}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Skip to main content'
  },
  decorators: [moduleMetadata({
    imports: [NavLinkComponent]
  })],
  render: args => ({
    props: args,
    template: \`
            <a dma-skip-link href="#story-main">{{ label }}</a>
            <header style="display: flex; justify-content: flex-end; padding: var(--space-16)">
                <nav aria-label="Main" style="display: flex; gap: var(--space-4)">
                    <a dma-nav-link href="#">Compendium</a>
                    <a dma-nav-link href="#">Characters</a>
                    <a dma-nav-link href="#">Campaigns</a>
                </nav>
            </header>
            <main id="story-main" style="padding: var(--space-16)">Main content</main>
        \`
  })
}`,...S.parameters?.docs?.source},description:{story:`The skip link as the first focusable item of a page. Press Tab in the story to show it, then Enter to skip.`,...S.parameters?.docs?.description}}}})))()}export{v as a,init_skip_link_stories as i,b as n,S as r,x as t};