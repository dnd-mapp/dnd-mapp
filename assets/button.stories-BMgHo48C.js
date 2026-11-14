import{n as e,r as t}from"./rolldown-runtime-vtgMY1y5.js";import{C as n,O as r,nt as i,tt as a,v as o,y as s}from"./angular-platform-_ezXbbxl.js";import{a as c,t as l}from"./dist-DHjgR8Xf.js";import{_ as u,d,r as f,x as p}from"./icon-sun.component-Dt7irR-0.js";import{t as m}from"./icon-B0qhaTyE.js";import{n as h,t as g}from"./arg-types-T86RJuJ3.js";var _;function init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvZG5kLW1hcHAvZG5kLW1hcHAvcGFja2FnZXMvdWkvd2ViL3NyYy9jb21wb25lbnRzL2J1dHRvbi9idXR0b24uY29tcG9uZW50Lmh0bWw(){return(init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvZG5kLW1hcHAvZG5kLW1hcHAvcGFja2FnZXMvdWkvd2ViL3NyYy9jb21wb25lbnRzL2J1dHRvbi9idXR0b24uY29tcG9uZW50Lmh0bWw=e((()=>{_=`<ng-content />
`})))()}var v;function init_button_component(){return(init_button_component=e((()=>{v=`:host{box-sizing:border-box;flex-basis:content;justify-content:center;align-items:center;gap:var(--space-8);width:100%;min-height:var(--size-target-min);padding:0 calc(var(--space-20) - var(--border-width-default));border:var(--border-width-default) solid transparent;border-radius:var(--radius-md);background:var(--color-accent-default);color:var(--color-foreground-on-accent);cursor:pointer;font-family:var(--typography-button-font-family);font-size:var(--typography-button-font-size);font-weight:var(--typography-button-font-weight);letter-spacing:var(--typography-button-letter-spacing);line-height:var(--typography-button-line-height);-webkit-text-decoration:var(--typography-button-text-decoration);text-decoration:var(--typography-button-text-decoration);text-transform:var(--typography-button-text-case);margin:0;display:flex}@media (width>=64em){:host{width:auto;display:inline-flex}}:host(:hover){background:var(--color-accent-hover)}:host(.secondary),:host(.quiet){color:var(--color-foreground-default);background:0 0}:host(.secondary){border-color:var(--color-border-strong)}:host(.quiet){border-color:var(--color-border-control)}:host(.secondary:hover),:host(.quiet:hover){background:var(--color-background-hover)}:host(:focus-visible){outline:var(--border-width-focus) solid var(--color-focus-ring);outline-offset:var(--focus-offset)}`})))()}function buttonKindAttr(e){return Object.values(y).includes(e)?e:b}var y,b;function init_button_types(){return(init_button_types=e((()=>{y={Primary:`primary`,Secondary:`secondary`,Quiet:`quiet`},b=y.Primary})))()}var x;function init_button_component$1(){return(init_button_component$1=e((()=>{i(),init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvZG5kLW1hcHAvZG5kLW1hcHAvcGFja2FnZXMvdWkvd2ViL3NyYy9jb21wb25lbnRzL2J1dHRvbi9idXR0b24uY29tcG9uZW50Lmh0bWw(),init_button_component(),o(),init_button_types(),x=class ButtonComponent{kind=s(b,{transform:buttonKindAttr});static propDecorators={kind:[{type:r,args:[{isSignal:!0,alias:`kind`,required:!1,transform:void 0}]}]}},x=a([n({selector:`button[dma-button], a[dma-button]`,template:_,host:{"[class.secondary]":`kind() === 'secondary'`,"[class.quiet]":`kind() === 'quiet'`},styles:[v]})],x)})))()}var S=t({IconOnly:()=>R,LeadingIcon:()=>I,NarrowScreen:()=>z,OnLink:()=>F,PrimaryDefault:()=>E,PrimaryFocus:()=>O,PrimaryHover:()=>D,QuietDefault:()=>M,QuietFocus:()=>P,QuietHover:()=>N,SecondaryDefault:()=>k,SecondaryFocus:()=>j,SecondaryHover:()=>A,TrailingIcon:()=>L,__namedExportsOrder:()=>B,default:()=>C}),C,w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z,B;function init_button_stories(){return(init_button_stories=e((()=>{l(),init_button_component$1(),init_button_types(),m(),g(),C={title:`Button`,component:x,decorators:[c({imports:[p,u,d,f]})],argTypes:{kind:h({values:y,typeName:`ButtonKind`,defaultValue:b,description:`How the button looks: primary, for the one main action of a view, secondary, for its other calls to action, or quiet, for the tools in the header and menu.`}),label:{description:`The content the button projects, which names it to assistive technology.`,control:`text`}},render:e=>({props:e,template:`<button dma-button type="button" [kind]="kind">{{ label }}</button>`})},w={pseudo:{hover:!0}},T={pseudo:{focusVisible:!0}},E={args:{kind:`primary`,label:`Label`}},D={args:{kind:`primary`,label:`Label`},parameters:w},O={args:{kind:`primary`,label:`Label`},parameters:T},k={args:{kind:`secondary`,label:`Label`}},A={args:{kind:`secondary`,label:`Label`},parameters:w},j={args:{kind:`secondary`,label:`Label`},parameters:T},M={args:{kind:`quiet`,label:`Label`}},N={args:{kind:`quiet`,label:`Label`},parameters:w},P={args:{kind:`quiet`,label:`Label`},parameters:T},F={args:{kind:`primary`,label:`Label`},render:e=>({props:e,template:`<a dma-button [kind]="kind" href="#">{{ label }}</a>`})},I={args:{kind:`primary`,label:`New map`},render:e=>({props:e,template:`<button dma-button type="button" [kind]="kind"><dma-icon-plus />{{ label }}</button>`})},L={args:{kind:`secondary`,label:`Get started`},render:e=>({props:e,template:`<button dma-button type="button" [kind]="kind">{{ label }}<dma-icon-arrow-right /></button>`})},R={args:{kind:`quiet`},render:e=>({props:e,template:`<button dma-button type="button" [kind]="kind" aria-label="Close"><dma-icon-close /></button>`})},z={args:{kind:`secondary`,label:`Label`},globals:{viewport:{value:`mobile1`,isRotated:!1}},render:e=>({props:e,template:`
            <div class="column">
                <div class="row">
                    <button dma-button type="button" kind="quiet" aria-label="Menu"><dma-icon-menu /></button>
                    <button dma-button type="button" kind="quiet" aria-label="Close"><dma-icon-close /></button>
                </div>
                <button dma-button type="button" [kind]="kind">{{ label }}</button>
            </div>
        `,styles:[`
                .column {
                    max-inline-size: 20rem;
                }

                .row {
                    display: flex;
                    justify-content: space-between;
                    margin-block-end: var(--space-16);
                }
            `]})},B=[`PrimaryDefault`,`PrimaryHover`,`PrimaryFocus`,`SecondaryDefault`,`SecondaryHover`,`SecondaryFocus`,`QuietDefault`,`QuietHover`,`QuietFocus`,`OnLink`,`LeadingIcon`,`TrailingIcon`,`IconOnly`,`NarrowScreen`],E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'primary',
    label: 'Label'
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'primary',
    label: 'Label'
  },
  parameters: hover
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'primary',
    label: 'Label'
  },
  parameters: focus
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'secondary',
    label: 'Label'
  }
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'secondary',
    label: 'Label'
  },
  parameters: hover
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'secondary',
    label: 'Label'
  },
  parameters: focus
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'quiet',
    label: 'Label'
  }
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'quiet',
    label: 'Label'
  },
  parameters: hover
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'quiet',
    label: 'Label'
  },
  parameters: focus
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'primary',
    label: 'Label'
  },
  render: args => ({
    props: args,
    template: \`<a dma-button [kind]="kind" href="#">{{ label }}</a>\`
  })
}`,...F.parameters?.docs?.source},description:{story:"A button on `<a>`, which looks the same and keeps the semantics of a link.",...F.parameters?.docs?.description}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'primary',
    label: 'New map'
  },
  render: args => ({
    props: args,
    template: \`<button dma-button type="button" [kind]="kind"><dma-icon-plus />{{ label }}</button>\`
  })
}`,...I.parameters?.docs?.source},description:{story:`An icon before the label, which leads it.`,...I.parameters?.docs?.description}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'secondary',
    label: 'Get started'
  },
  render: args => ({
    props: args,
    template: \`<button dma-button type="button" [kind]="kind">{{ label }}<dma-icon-arrow-right /></button>\`
  })
}`,...L.parameters?.docs?.source},description:{story:`An icon after the label, which trails it.`,...L.parameters?.docs?.description}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'quiet'
  },
  render: args => ({
    props: args,
    template: \`<button dma-button type="button" [kind]="kind" aria-label="Close"><dma-icon-close /></button>\`
  })
}`,...R.parameters?.docs?.source},description:{story:"An icon of its own, which takes its name from `aria-label`, as the Close button of Mobile menu does.",...R.parameters?.docs?.description}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'secondary',
    label: 'Label'
  },
  globals: {
    viewport: {
      value: 'mobile1',
      isRotated: false
    }
  },
  render: args => ({
    props: args,
    template: \`
            <div class="column">
                <div class="row">
                    <button dma-button type="button" kind="quiet" aria-label="Menu"><dma-icon-menu /></button>
                    <button dma-button type="button" kind="quiet" aria-label="Close"><dma-icon-close /></button>
                </div>
                <button dma-button type="button" [kind]="kind">{{ label }}</button>
            </div>
        \`,
    styles: [\`
                .column {
                    max-inline-size: 20rem;
                }

                .row {
                    display: flex;
                    justify-content: space-between;
                    margin-block-end: var(--space-16);
                }
            \`]
  })
}`,...z.parameters?.docs?.source},description:{story:`Buttons on a small mobile screen: in a flex row, they keep the width of their content, as in Header, while a button
in a block container fills it, as in Mobile menu. The docs page shows the story in an iframe narrower than the
desktop breakpoint, and the column keeps it at the width of a small mobile screen.`,...z.parameters?.docs?.description}}}})))()}export{E as a,M as c,k as d,j as f,init_button_stories as g,S as h,F as i,P as l,L as m,I as n,O as o,A as p,z as r,D as s,R as t,N as u};