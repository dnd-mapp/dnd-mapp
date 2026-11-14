import{n as e,r as t}from"./rolldown-runtime-vtgMY1y5.js";import{C as n,I as r,T as i,U as a,l as o,nt as s,tt as c,v as l}from"./angular-platform-_ezXbbxl.js";import{a as u,r as d,t as f}from"./dist-DHjgR8Xf.js";import{a as p,n as m,t as h}from"./nav-link.component-DxTPuUqi.js";var g;function init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvZG5kLW1hcHAvZG5kLW1hcHAvcGFja2FnZXMvdWkvd2ViL3NyYy9jb21wb25lbnRzL3NraXAtbGluay9za2lwLWxpbmsuY29tcG9uZW50Lmh0bWw(){return(init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvZG5kLW1hcHAvZG5kLW1hcHAvcGFja2FnZXMvdWkvd2ViL3NyYy9jb21wb25lbnRzL3NraXAtbGluay9za2lwLWxpbmsuY29tcG9uZW50Lmh0bWw=e((()=>{g=`<ng-content />
`})))()}var _;function init_skip_link_component(){return(init_skip_link_component=e((()=>{_=`:host{top:var(--space-16);left:var(--space-16);clip-path:inset(50%);white-space:nowrap;width:1px;height:1px;position:fixed;overflow:hidden}:host(:focus){z-index:1000;width:auto;height:auto;min-height:var(--size-target-min);padding:0 var(--space-16);clip-path:none;border-radius:var(--radius-md);outline:var(--border-width-focus) solid var(--color-focus-ring);outline-offset:var(--focus-offset);background:var(--color-accent-default);color:var(--color-foreground-on-accent);font-family:var(--typography-button-font-family);font-size:var(--typography-button-font-size);font-weight:var(--typography-button-font-weight);letter-spacing:var(--typography-button-letter-spacing);line-height:var(--typography-button-line-height);-webkit-text-decoration:var(--typography-button-text-decoration);text-decoration:var(--typography-button-text-decoration);text-transform:var(--typography-button-text-case);align-items:center;display:inline-flex;overflow:visible}`})))()}var v;function init_skip_link_component$1(){return(init_skip_link_component$1=e((()=>{s(),init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvZG5kLW1hcHAvZG5kLW1hcHAvcGFja2FnZXMvdWkvd2ViL3NyYy9jb21wb25lbnRzL3NraXAtbGluay9za2lwLWxpbmsuY29tcG9uZW50Lmh0bWw(),init_skip_link_component(),o(),l(),v=class SkipLinkComponent{document=a(r);host=a(i);skipToTarget(e){let t=this.host.nativeElement.getAttribute(`href`);if(!t?.startsWith(`#`))return;let n=this.document.getElementById(decodeURIComponent(t.slice(1)));n&&(e.preventDefault(),n.hasAttribute(`tabindex`)||(n.setAttribute(`tabindex`,`-1`),n.addEventListener(`blur`,()=>{n.removeAttribute(`tabindex`)},{once:!0})),n.focus())}},v=c([n({selector:`a[dma-skip-link]`,template:g,host:{"(click)":`skipToTarget($event)`},styles:[_]})],v)})))()}function init_nav_link(){return(init_nav_link=e((()=>{m(),p()})))()}var y=t({Focus:()=>S,Hidden:()=>x,OnPage:()=>C,__namedExportsOrder:()=>w,default:()=>b}),b,x,S,C,w;function init_skip_link_stories(){return(init_skip_link_stories=e((()=>{f(),init_skip_link_component$1(),init_nav_link(),b={title:`Skip link`,component:v,argTypes:{label:{description:`The content the skip link projects, which names it to assistive technology.`,control:`text`}},parameters:{controls:{exclude:[`skipToTarget`]}},decorators:[d(e=>`<div style="transform: translate(0); min-height: calc(var(--size-target-min) + 2 * var(--space-16))">${e}</div>`)],render:e=>({props:e,template:`<a dma-skip-link href="#main">{{ label }}</a>`})},x={args:{label:`Skip to main content`}},S={args:{label:`Skip to main content`},parameters:{pseudo:{focus:!0}}},C={args:{label:`Skip to main content`},decorators:[u({imports:[h]})],render:e=>({props:e,template:`
            <a dma-skip-link href="#story-main">{{ label }}</a>
            <header style="display: flex; justify-content: flex-end; padding: var(--space-16)">
                <nav aria-label="Main" style="display: flex; gap: var(--space-4)">
                    <a dma-nav-link href="#">Compendium</a>
                    <a dma-nav-link href="#">Characters</a>
                    <a dma-nav-link href="#">Campaigns</a>
                </nav>
            </header>
            <main id="story-main" style="padding: var(--space-16)">Main content</main>
        `})},w=[`Hidden`,`Focus`,`OnPage`],x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Skip to main content'
  }
}`,...x.parameters?.docs?.source},description:{story:`The skip link before it gets focus: hidden from sight, but still in the accessibility tree.`,...x.parameters?.docs?.description}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Skip to main content'
  },
  parameters: {
    pseudo: {
      focus: true
    }
  }
}`,...S.parameters?.docs?.source},description:{story:`The skip link with focus, the look Penpot draws.`,...S.parameters?.docs?.description}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
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
}`,...C.parameters?.docs?.source},description:{story:`The skip link as the first focusable item of a page. Press Tab in the story to show it, then Enter to skip.`,...C.parameters?.docs?.description}}}})))()}export{y as a,init_skip_link_stories as i,x as n,C as r,S as t};