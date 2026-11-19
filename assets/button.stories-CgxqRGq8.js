import{n as e,r as t}from"./rolldown-runtime-vtgMY1y5.js";import{a as n,t as r}from"./dist-B-70Eai5.js";import{a as i,i as a,n as o,r as s,t as c}from"./button.component-C24ZEmEz.js";import{T as l,_ as u,d,r as f}from"./icon-sun.component-DF1-h-2U.js";import{t as p}from"./icon-C-gfMzhi.js";import{n as m,t as h}from"./arg-types-T86RJuJ3.js";var g=t({IconOnly:()=>M,LeadingIcon:()=>A,NarrowScreen:()=>N,OnLink:()=>k,PrimaryDefault:()=>b,PrimaryFocus:()=>S,PrimaryHover:()=>x,QuietDefault:()=>E,QuietFocus:()=>O,QuietHover:()=>D,SecondaryDefault:()=>C,SecondaryFocus:()=>T,SecondaryHover:()=>w,TrailingIcon:()=>j,__namedExportsOrder:()=>P,default:()=>_}),_,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P;function init_button_stories(){return(init_button_stories=e((()=>{r(),o(),i(),p(),h(),_={title:`Elements/Button`,component:c,decorators:[n({imports:[l,u,d,f]})],argTypes:{kind:m({values:s,typeName:`ButtonKind`,defaultValue:a,description:`How the button looks: primary, for the one main action of a view, secondary, for its other calls to action, or quiet, for the tools in the header and menu.`}),label:{description:`The content the button projects, which names it to assistive technology.`,control:`text`}},render:e=>({props:e,template:`<button dma-button type="button" [kind]="kind">{{ label }}</button>`})},v={pseudo:{hover:!0}},y={pseudo:{focusVisible:!0}},b={args:{kind:`primary`,label:`Label`}},x={args:{kind:`primary`,label:`Label`},parameters:v},S={args:{kind:`primary`,label:`Label`},parameters:y},C={args:{kind:`secondary`,label:`Label`}},w={args:{kind:`secondary`,label:`Label`},parameters:v},T={args:{kind:`secondary`,label:`Label`},parameters:y},E={args:{kind:`quiet`,label:`Label`}},D={args:{kind:`quiet`,label:`Label`},parameters:v},O={args:{kind:`quiet`,label:`Label`},parameters:y},k={args:{kind:`primary`,label:`Label`},render:e=>({props:e,template:`<a dma-button [kind]="kind" href="#">{{ label }}</a>`})},A={args:{kind:`primary`,label:`New map`},render:e=>({props:e,template:`<button dma-button type="button" [kind]="kind"><dma-icon-plus />{{ label }}</button>`})},j={args:{kind:`secondary`,label:`Get started`},render:e=>({props:e,template:`<button dma-button type="button" [kind]="kind">{{ label }}<dma-icon-arrow-right /></button>`})},M={args:{kind:`quiet`},render:e=>({props:e,template:`<button dma-button type="button" [kind]="kind" aria-label="Close"><dma-icon-close /></button>`})},N={args:{kind:`secondary`,label:`Label`},globals:{viewport:{value:`mobile1`,isRotated:!1}},render:e=>({props:e,template:`
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
            `]})},P=[`PrimaryDefault`,`PrimaryHover`,`PrimaryFocus`,`SecondaryDefault`,`SecondaryHover`,`SecondaryFocus`,`QuietDefault`,`QuietHover`,`QuietFocus`,`OnLink`,`LeadingIcon`,`TrailingIcon`,`IconOnly`,`NarrowScreen`],b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'primary',
    label: 'Label'
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'primary',
    label: 'Label'
  },
  parameters: hover
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'primary',
    label: 'Label'
  },
  parameters: focus
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'secondary',
    label: 'Label'
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'secondary',
    label: 'Label'
  },
  parameters: hover
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'secondary',
    label: 'Label'
  },
  parameters: focus
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'quiet',
    label: 'Label'
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'quiet',
    label: 'Label'
  },
  parameters: hover
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'quiet',
    label: 'Label'
  },
  parameters: focus
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'primary',
    label: 'Label'
  },
  render: args => ({
    props: args,
    template: \`<a dma-button [kind]="kind" href="#">{{ label }}</a>\`
  })
}`,...k.parameters?.docs?.source},description:{story:"A button on `<a>`, which looks the same and keeps the semantics of a link.",...k.parameters?.docs?.description}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'primary',
    label: 'New map'
  },
  render: args => ({
    props: args,
    template: \`<button dma-button type="button" [kind]="kind"><dma-icon-plus />{{ label }}</button>\`
  })
}`,...A.parameters?.docs?.source},description:{story:`An icon before the label, which leads it.`,...A.parameters?.docs?.description}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'secondary',
    label: 'Get started'
  },
  render: args => ({
    props: args,
    template: \`<button dma-button type="button" [kind]="kind">{{ label }}<dma-icon-arrow-right /></button>\`
  })
}`,...j.parameters?.docs?.source},description:{story:`An icon after the label, which trails it.`,...j.parameters?.docs?.description}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'quiet'
  },
  render: args => ({
    props: args,
    template: \`<button dma-button type="button" [kind]="kind" aria-label="Close"><dma-icon-close /></button>\`
  })
}`,...M.parameters?.docs?.source},description:{story:"An icon of its own, which takes its name from `aria-label`, as the Close button of Mobile menu does.",...M.parameters?.docs?.description}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
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
}`,...N.parameters?.docs?.source},description:{story:`Buttons on a small mobile screen: in a flex row, they keep the width of their content, as in Header, while a button
in a block container fills it, as in Mobile menu. The docs page shows the story in an iframe narrower than the
desktop breakpoint, and the column keeps it at the width of a small mobile screen.`,...N.parameters?.docs?.description}}}})))()}export{b as a,E as c,C as d,T as f,init_button_stories as g,g as h,k as i,O as l,j as m,A as n,S as o,w as p,N as r,x as s,M as t,D as u};