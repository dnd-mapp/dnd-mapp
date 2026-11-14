import{n as e,r as t}from"./rolldown-runtime-vtgMY1y5.js";import{n,t as r}from"./arg-types-T86RJuJ3.js";import{a as i,i as a,n as o,r as s,t as c}from"./nav-link.component-CgjdCNQh.js";var l=t({BarCurrent:()=>m,BarCurrentFocus:()=>g,BarCurrentHover:()=>h,BarDefault:()=>d,BarFocus:()=>p,BarHover:()=>f,InHeader:()=>x,RowCurrent:()=>b,RowDefault:()=>_,RowFocus:()=>y,RowHover:()=>v,__namedExportsOrder:()=>S,default:()=>u}),u,d,f,p,m,h,g,_,v,y,b,x,S;function init_nav_link_stories(){return(init_nav_link_stories=e((()=>{o(),i(),r(),u={title:`Nav link`,component:c,argTypes:{kind:n({values:a,typeName:`NavLinkKind`,defaultValue:s,description:`How the nav link looks: in the bar of the header, as wide as its label, or as a row of a menu, as wide as its container.`}),label:{description:`The content the nav link projects, which names it to assistive technology.`,control:`text`},current:{description:'Whether the nav link marks the current page, through `aria-current="page"` on the link.',control:`boolean`,table:{type:{summary:`boolean`},defaultValue:{summary:`false`}}}},render:e=>({props:e,template:`<a dma-nav-link [kind]="kind" [attr.aria-current]="current ? 'page' : null" href="#">{{ label }}</a>`})},d={args:{kind:`bar`,label:`Features`,current:!1}},f={args:{kind:`bar`,label:`Features`,current:!1},parameters:{pseudo:{hover:!0}}},p={args:{kind:`bar`,label:`Features`,current:!1},parameters:{pseudo:{focusVisible:!0}}},m={args:{kind:`bar`,label:`Features`,current:!0}},h={args:{kind:`bar`,label:`Features`,current:!0},parameters:{pseudo:{hover:!0}}},g={args:{kind:`bar`,label:`Features`,current:!0},parameters:{pseudo:{focusVisible:!0}}},_={args:{kind:`row`,label:`Features`,current:!1}},v={args:{kind:`row`,label:`Features`,current:!1},parameters:{pseudo:{hover:!0}}},y={args:{kind:`row`,label:`Features`,current:!1},parameters:{pseudo:{focusVisible:!0}}},b={args:{kind:`row`,label:`Features`,current:!0}},x={render:()=>({template:`
            <nav aria-label="Main" style="display: flex; gap: var(--space-4)">
                <a dma-nav-link aria-current="page" href="#">Features</a>
                <a dma-nav-link href="#">Roadmap</a>
                <a dma-nav-link href="#">FAQ</a>
            </nav>
        `})},S=[`BarDefault`,`BarHover`,`BarFocus`,`BarCurrent`,`BarCurrentHover`,`BarCurrentFocus`,`RowDefault`,`RowHover`,`RowFocus`,`RowCurrent`,`InHeader`],d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'bar',
    label: 'Features',
    current: false
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'bar',
    label: 'Features',
    current: false
  },
  parameters: {
    pseudo: {
      hover: true
    }
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'bar',
    label: 'Features',
    current: false
  },
  parameters: {
    pseudo: {
      focusVisible: true
    }
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'bar',
    label: 'Features',
    current: true
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'bar',
    label: 'Features',
    current: true
  },
  parameters: {
    pseudo: {
      hover: true
    }
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'bar',
    label: 'Features',
    current: true
  },
  parameters: {
    pseudo: {
      focusVisible: true
    }
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'row',
    label: 'Features',
    current: false
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'row',
    label: 'Features',
    current: false
  },
  parameters: {
    pseudo: {
      hover: true
    }
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'row',
    label: 'Features',
    current: false
  },
  parameters: {
    pseudo: {
      focusVisible: true
    }
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'row',
    label: 'Features',
    current: true
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => ({
    template: \`
            <nav aria-label="Main" style="display: flex; gap: var(--space-4)">
                <a dma-nav-link aria-current="page" href="#">Features</a>
                <a dma-nav-link href="#">Roadmap</a>
                <a dma-nav-link href="#">FAQ</a>
            </nav>
        \`
  })
}`,...x.parameters?.docs?.source},description:{story:`The nav links of the header, with the first one on the current page.`,...x.parameters?.docs?.description}}}})))()}export{p as a,b as c,v as d,init_nav_link_stories as f,d as i,_ as l,g as n,f as o,l as p,h as r,x as s,m as t,y as u};