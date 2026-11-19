import{n as e,r as t}from"./rolldown-runtime-vtgMY1y5.js";import{n,t as r}from"./arg-types-T86RJuJ3.js";import{a as i,i as a,n as o,r as s,t as c}from"./link.component-wSLcnZDx.js";var l=t({InText:()=>S,InlineDefault:()=>p,InlineFocus:()=>h,InlineHover:()=>m,QuietDefault:()=>y,QuietFocus:()=>x,QuietHover:()=>b,StandaloneDefault:()=>g,StandaloneFocus:()=>v,StandaloneHover:()=>_,__namedExportsOrder:()=>C,default:()=>u}),u,d,f,p,m,h,g,_,v,y,b,x,S,C;function init_link_stories(){return(init_link_stories=e((()=>{o(),i(),r(),u={title:`Elements/Link`,component:c,argTypes:{kind:n({values:a,typeName:`LinkKind`,defaultValue:s,description:`How the link looks: inline in a line of text, standalone on a line of its own with an arrow, or quiet in a list of links.`}),label:{description:`The content the link projects, which names it to assistive technology.`,control:`text`}},render:e=>({props:e,template:`<a dma-link [kind]="kind" href="#">{{ label }}</a>`})},d={pseudo:{hover:!0}},f={pseudo:{focusVisible:!0}},p={args:{kind:`inline`,label:`link text`}},m={args:{kind:`inline`,label:`link text`},parameters:d},h={args:{kind:`inline`,label:`link text`},parameters:f},g={args:{kind:`standalone`,label:`Label`}},_={args:{kind:`standalone`,label:`Label`},parameters:d},v={args:{kind:`standalone`,label:`Label`},parameters:f},y={args:{kind:`quiet`,label:`Link`}},b={args:{kind:`quiet`,label:`Link`},parameters:d},x={args:{kind:`quiet`,label:`Link`},parameters:f},S={args:{kind:`inline`,label:`the rules glossary`},render:e=>({props:e,template:`<p class="body-text">Each spell lists its range and duration, as <a dma-link [kind]="kind" href="#">{{ label }}</a> explains.</p>`,styles:[`
                .body-text {
                    margin: 0;
                    max-width: var(--size-measure);
                }
            `]})},C=[`InlineDefault`,`InlineHover`,`InlineFocus`,`StandaloneDefault`,`StandaloneHover`,`StandaloneFocus`,`QuietDefault`,`QuietHover`,`QuietFocus`,`InText`],p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'inline',
    label: 'link text'
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'inline',
    label: 'link text'
  },
  parameters: hover
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'inline',
    label: 'link text'
  },
  parameters: focus
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'standalone',
    label: 'Label'
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'standalone',
    label: 'Label'
  },
  parameters: hover
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'standalone',
    label: 'Label'
  },
  parameters: focus
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'quiet',
    label: 'Link'
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'quiet',
    label: 'Link'
  },
  parameters: hover
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'quiet',
    label: 'Link'
  },
  parameters: focus
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
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
}`,...S.parameters?.docs?.source},description:{story:`An inline link in a paragraph of body text, the place it is made for.`,...S.parameters?.docs?.description}}}})))()}export{y as a,g as c,init_link_stories as d,l as f,m as i,v as l,p as n,x as o,h as r,b as s,S as t,_ as u};