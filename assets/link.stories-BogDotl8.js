import{n as e,r as t}from"./rolldown-runtime-vtgMY1y5.js";import{C as n,O as r,nt as i,tt as a,v as o,y as s}from"./angular-platform-_ezXbbxl.js";import{x as c}from"./icon-sun.component-Dt7irR-0.js";import{t as l}from"./icon-B0qhaTyE.js";import{n as u,t as d}from"./arg-types-T86RJuJ3.js";var f;function init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvZG5kLW1hcHAvZG5kLW1hcHAvcGFja2FnZXMvdWkvd2ViL3NyYy9jb21wb25lbnRzL2xpbmsvbGluay5jb21wb25lbnQuaHRtbA(){return(init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvZG5kLW1hcHAvZG5kLW1hcHAvcGFja2FnZXMvdWkvd2ViL3NyYy9jb21wb25lbnRzL2xpbmsvbGluay5jb21wb25lbnQuaHRtbA=e((()=>{f=`<ng-content />
@if (kind() === 'standalone') {
    <dma-icon-arrow-right />
}
`})))()}var p;function init_link_component(){return(init_link_component=e((()=>{p=`:host{border-radius:var(--radius-xs);color:var(--color-accent-text);font-family:var(--typography-link-font-family);font-size:var(--typography-link-font-size);font-weight:var(--typography-link-font-weight);letter-spacing:var(--typography-link-letter-spacing);line-height:var(--typography-link-line-height);-webkit-text-decoration:var(--typography-link-text-decoration);text-decoration:var(--typography-link-text-decoration);text-transform:var(--typography-link-text-case)}:host(:hover){color:var(--color-foreground-default)}:host(:focus-visible){outline:var(--border-width-focus) solid var(--color-focus-ring);outline-offset:var(--focus-offset)}:host(.standalone){align-items:center;gap:var(--space-8);font-family:var(--typography-body-strong-font-family);font-size:var(--typography-body-strong-font-size);font-weight:var(--typography-body-strong-font-weight);letter-spacing:var(--typography-body-strong-letter-spacing);line-height:var(--typography-body-strong-line-height);-webkit-text-decoration:var(--typography-body-strong-text-decoration);text-decoration:var(--typography-body-strong-text-decoration);text-transform:var(--typography-body-strong-text-case);display:inline-flex}:host(.standalone:hover){color:var(--color-accent-text);font-family:var(--typography-link-strong-font-family);font-size:var(--typography-link-strong-font-size);font-weight:var(--typography-link-strong-font-weight);letter-spacing:var(--typography-link-strong-letter-spacing);line-height:var(--typography-link-strong-line-height);-webkit-text-decoration:var(--typography-link-strong-text-decoration);text-decoration:var(--typography-link-strong-text-decoration);text-transform:var(--typography-link-strong-text-case)}dma-icon-arrow-right{width:var(--size-icon-sm);height:var(--size-icon-sm)}:host(.quiet){color:var(--color-foreground-muted);font-family:var(--typography-body-font-family);font-size:var(--typography-body-font-size);font-weight:var(--typography-body-font-weight);letter-spacing:var(--typography-body-letter-spacing);line-height:var(--typography-body-line-height);-webkit-text-decoration:var(--typography-body-text-decoration);text-decoration:var(--typography-body-text-decoration);text-transform:var(--typography-body-text-case)}:host(.quiet:hover){color:var(--color-foreground-default);font-family:var(--typography-link-font-family);font-size:var(--typography-link-font-size);font-weight:var(--typography-link-font-weight);letter-spacing:var(--typography-link-letter-spacing);line-height:var(--typography-link-line-height);-webkit-text-decoration:var(--typography-link-text-decoration);text-decoration:var(--typography-link-text-decoration);text-transform:var(--typography-link-text-case)}`})))()}function linkKindAttr(e){return Object.values(m).includes(e)?e:h}var m,h;function init_link_types(){return(init_link_types=e((()=>{m={Inline:`inline`,Standalone:`standalone`,Quiet:`quiet`},h=m.Inline})))()}var g;function init_link_component$1(){return(init_link_component$1=e((()=>{i(),init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvZG5kLW1hcHAvZG5kLW1hcHAvcGFja2FnZXMvdWkvd2ViL3NyYy9jb21wb25lbnRzL2xpbmsvbGluay5jb21wb25lbnQuaHRtbA(),init_link_component(),o(),init_link_types(),l(),g=class LinkComponent{kind=s(h,{transform:linkKindAttr});static propDecorators={kind:[{type:r,args:[{isSignal:!0,alias:`kind`,required:!1,transform:void 0}]}]}},g=a([n({selector:`a[dma-link]`,template:f,imports:[c],host:{"[class.standalone]":`kind() === 'standalone'`,"[class.quiet]":`kind() === 'quiet'`},styles:[p]})],g)})))()}var _=t({InText:()=>A,InlineDefault:()=>x,InlineFocus:()=>C,InlineHover:()=>S,QuietDefault:()=>D,QuietFocus:()=>k,QuietHover:()=>O,StandaloneDefault:()=>w,StandaloneFocus:()=>E,StandaloneHover:()=>T,__namedExportsOrder:()=>j,default:()=>v}),v,y,b,x,S,C,w,T,E,D,O,k,A,j;function init_link_stories(){return(init_link_stories=e((()=>{init_link_component$1(),init_link_types(),d(),v={title:`Link`,component:g,argTypes:{kind:u({values:m,typeName:`LinkKind`,defaultValue:h,description:`How the link looks: inline in a line of text, standalone on a line of its own with an arrow, or quiet in a list of links.`}),label:{description:`The content the link projects, which names it to assistive technology.`,control:`text`}},render:e=>({props:e,template:`<a dma-link [kind]="kind" href="#">{{ label }}</a>`})},y={pseudo:{hover:!0}},b={pseudo:{focusVisible:!0}},x={args:{kind:`inline`,label:`link text`}},S={args:{kind:`inline`,label:`link text`},parameters:y},C={args:{kind:`inline`,label:`link text`},parameters:b},w={args:{kind:`standalone`,label:`Label`}},T={args:{kind:`standalone`,label:`Label`},parameters:y},E={args:{kind:`standalone`,label:`Label`},parameters:b},D={args:{kind:`quiet`,label:`Link`}},O={args:{kind:`quiet`,label:`Link`},parameters:y},k={args:{kind:`quiet`,label:`Link`},parameters:b},A={args:{kind:`inline`,label:`the rules glossary`},render:e=>({props:e,template:`<p class="body-text">Each spell lists its range and duration, as <a dma-link [kind]="kind" href="#">{{ label }}</a> explains.</p>`,styles:[`
                .body-text {
                    margin: 0;
                    max-width: var(--size-measure);
                }
            `]})},j=[`InlineDefault`,`InlineHover`,`InlineFocus`,`StandaloneDefault`,`StandaloneHover`,`StandaloneFocus`,`QuietDefault`,`QuietHover`,`QuietFocus`,`InText`],x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'inline',
    label: 'link text'
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'inline',
    label: 'link text'
  },
  parameters: hover
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'inline',
    label: 'link text'
  },
  parameters: focus
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'standalone',
    label: 'Label'
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'standalone',
    label: 'Label'
  },
  parameters: hover
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'standalone',
    label: 'Label'
  },
  parameters: focus
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'quiet',
    label: 'Link'
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'quiet',
    label: 'Link'
  },
  parameters: hover
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'quiet',
    label: 'Link'
  },
  parameters: focus
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'inline',
    label: 'the rules glossary'
  },
  render: args => ({
    props: args,
    template: \`<p class="body-text">Each spell lists its range and duration, as <a dma-link [kind]="kind" href="#">{{ label }}</a> explains.</p>\`,
    styles: [\`
                .body-text {
                    margin: 0;
                    max-width: var(--size-measure);
                }
            \`]
  })
}`,...A.parameters?.docs?.source},description:{story:`An inline link in a paragraph of body text, the place it is made for.`,...A.parameters?.docs?.description}}}})))()}export{D as a,w as c,init_link_stories as d,_ as f,S as i,E as l,x as n,k as o,C as r,O as s,A as t,T as u};